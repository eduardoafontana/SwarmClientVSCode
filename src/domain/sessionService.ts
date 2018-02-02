'use strict';

import { SessionData } from './dataModel/sessionData';
import { BreakpointData, BreakpointKind, BreakpointOrigin } from './dataModel/breakpointData';
import { EventData, EventKind } from './dataModel/eventData';
import { RepositoryLog } from './../dataLog/repositoryLog';
import { Guid } from "guid-typescript";
import { BreakpointModel } from './inputModel/breakpointModel';
import { StepModel } from './inputModel/stepModel';

export class SessionService {

    private currentSession : SessionData = null;
    private repositoryLog : RepositoryLog = new RepositoryLog();

    private breakpointOrigin : string = BreakpointOrigin[BreakpointOrigin.AddedBeforeDebug];

    public registerNewSession(dbgSessionId : string) : void{
        if(this.currentSession != null)
            return;

        this.currentSession = SessionData.newSessionData();
        this.currentSession.Identifier = Guid.create().toString();
        this.currentSession.Label = "VSCode";
        this.currentSession.Description = "_sessionId in vsdbg-ui.log is: " + dbgSessionId;
        this.currentSession.Purpose = "TODO";
        this.currentSession.Started = new Date();

        this.repositoryLog.generateIdentifier();
        this.repositoryLog.save(this.currentSession);

        this.breakpointOrigin = BreakpointOrigin[BreakpointOrigin.AddedBeforeDebug];
    }

    public registerBreakpoint(breakpoints: BreakpointModel[], seq : number) : void {
        if(this.currentSession == null)
            return;

        this.registerBreakpointAdded(breakpoints, seq);

        this.registerBreakpointRemoved(breakpoints, seq);
    }

    public registerHitted(breakpoint : BreakpointModel, seq : number) : void {
        if(this.currentSession == null)
            return;

        let currentEventHash = EventData.generateEventHash(breakpoint.FileName, breakpoint.LineNumber, seq);
        let alreadyRegistered = this.currentSession.Events.filter(e => e.Detail == currentEventHash)[0];

        if(alreadyRegistered != undefined)
            return;

        if(this.breakpointOrigin == BreakpointOrigin[BreakpointOrigin.AddedBeforeDebug])
            this.breakpointOrigin = BreakpointOrigin[BreakpointOrigin.AddedDuringDebug];

        let eventData = EventData.newEventData();
        eventData.EventKind = EventKind[EventKind.BreakpointHitted];
        eventData.Detail = currentEventHash;
        eventData.Namespace = breakpoint.Namespace;
        eventData.Type = breakpoint.Type;
        eventData.TypeFullPath = "TODO";
        eventData.Method = breakpoint.Method;
        eventData.MethodKey = "";
        //     MethodSignature = sessionModel.CurrentStackFrameFunctionName,
        //     CharStart = sessionModel.CurrentDocument.StartLineText,
        //     CharEnd = sessionModel.CurrentDocument.EndLineText,
        eventData.LineNumber = breakpoint.LineNumber;
        eventData.LineOfCode = breakpoint.LineOfCode;
        eventData.Created = new Date();

        this.currentSession.Events.push(eventData);
        this.repositoryLog.save(this.currentSession);
    }

    public registerStep(step: StepModel, seq: number): void {
        if(this.currentSession == null)
            return;

        let currentEventHash = EventData.generateEventHash(step.FileName, step.LineNumber, seq);
        let alreadyRegistered = this.currentSession.Events.filter(e => e.Detail == currentEventHash)[0];

        if(alreadyRegistered != undefined)
            return;

        let eventData = EventData.newEventData();
        eventData.EventKind = step.CurrentCommandStep;
        eventData.Detail = currentEventHash,
        eventData.Namespace = step.Namespace;
        eventData.Type = step.Type;
        eventData.TypeFullPath = "TODO";
        eventData.Method = step.Method;
        eventData.MethodKey = "";
        //     MethodSignature = sessionModel.CurrentStackFrameFunctionName,
        eventData.CharStart = step.CharStart;
        //     CharEnd = sessionModel.CurrentDocument.EndLineText,
        eventData.LineNumber = step.LineNumber;
        eventData.LineOfCode = step.LineOfCode;
        eventData.Created = new Date();

        this.currentSession.Events.push(eventData);
        this.repositoryLog.save(this.currentSession);
    }

    public endCurrentSession() : void {
        this.currentSession.Finished = new Date();

        this.repositoryLog.save(this.currentSession);

        this.currentSession = null;
        this.breakpointOrigin = BreakpointOrigin[BreakpointOrigin.AddedBeforeDebug];
    }

    private registerBreakpointAdded(breakpoints: BreakpointModel[], seq: number): void {
        for (let breakpoint of breakpoints) {

            let exist = this.currentSession.Breakpoints.filter(b => 
                b.FileName == breakpoint.FileName && 
                b.LineNumber == breakpoint.LineNumber)[0];

            if(exist != undefined)
            {
                if(exist.RemovedSequencial == 0)
                    continue;
                else if(seq > exist.RemovedSequencial) {
                    this.currentSession.Breakpoints.splice(this.currentSession.Breakpoints.indexOf(exist), 1);
                } else
                    continue;
            }

            let eventData = EventData.newEventData();
            eventData.EventKind = EventKind[EventKind.BreakpointAdd];
            eventData.Detail = EventData.generateEventHash(breakpoint.FileName, breakpoint.LineNumber, seq),
            eventData.Namespace = breakpoint.Namespace;
            eventData.Type = breakpoint.Type;
            eventData.TypeFullPath = "TODO";
            eventData.Method = breakpoint.Method;
            eventData.MethodKey = "";
            //     MethodSignature = item.FunctionName,
            //     CharStart = item.StartLineText,
            //     CharEnd = item.DocumentModel.EndLineText,
            eventData.LineNumber = breakpoint.LineNumber;
            eventData.LineOfCode = breakpoint.LineOfCode;
            eventData.Created = new Date();

            let breakpointData = BreakpointData.newBreakpointData();
            breakpointData.BreakpointKind = BreakpointKind[BreakpointKind.Line];
            breakpointData.Origin = this.breakpointOrigin;
            breakpointData.LineNumber = breakpoint.LineNumber;
            breakpointData.FileName = breakpoint.FileName;
            breakpointData.Namespace = breakpoint.Namespace;
            breakpointData.Type = breakpoint.Type;
            breakpointData.Method = breakpoint.Method;
            breakpointData.LineOfCode = breakpoint.LineOfCode;
            breakpointData.Created = new Date();
            breakpointData.AddedSequential = seq;
    
            this.currentSession.Events.push(eventData);
            this.currentSession.Breakpoints.push(breakpointData);
        }

        this.repositoryLog.save(this.currentSession);
    }

    private registerBreakpointRemoved(breakpoints: BreakpointModel[], seq: number): void {
        let excludedList = this.currentSession.Breakpoints.filter(b => 
            b.AddedSequential < seq && 
            breakpoints.filter(bC => bC.FileName == b.FileName && bC.LineNumber == b.LineNumber)[0] == undefined &&
            b.RemovedSequencial == 0
        );

        for (let breakpointExcluded of excludedList) {
            let eventData = EventData.newEventData();
            eventData.EventKind = EventKind[EventKind.BreakpointRemove];
            eventData.Detail = EventData.generateEventHash(breakpointExcluded.FileName, breakpointExcluded.LineNumber, seq),
            eventData.Namespace = breakpointExcluded.Namespace;
            eventData.Type = breakpointExcluded.Type;
            eventData.TypeFullPath = "TODO",
            eventData.Method = breakpointExcluded.Method,
            eventData.MethodKey = "",
            //     MethodSignature = item.FunctionName,
            //     CharStart = item.StartLineText,
            //     CharEnd = item.DocumentModel.EndLineText,
            eventData.LineNumber = breakpointExcluded.LineNumber;
            eventData.LineOfCode = breakpointExcluded.LineOfCode;
            eventData.Created = new Date();

            this.currentSession.Events.push(eventData);

            breakpointExcluded.RemovedSequencial = seq;
        }

        this.repositoryLog.save(this.currentSession);
    }
}