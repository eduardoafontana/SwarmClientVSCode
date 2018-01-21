'use strict';

import { SessionData } from './dataModel/sessionData';
import { BreakpointData, BreakpointKind, BreakpointOrigin } from './dataModel/breakpointData';
import { RepositoryLog } from './../dataLog/repositoryLog';
import { Guid } from "guid-typescript";
import { BreakpointModel } from './inputModel/breakpointModel';

export class SessionService {
    
    private currentSession : SessionData = null;
    private repositoryLog : RepositoryLog = new RepositoryLog();

    private notAddedBreakpoints : boolean = true;

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

        this.notAddedBreakpoints = true;
    }

    public registerBreakpoint(breakpoints: BreakpointModel[]) : void {
        if(this.currentSession == null)
            return;

        let breakpointOrigin = BreakpointOrigin[BreakpointOrigin.AddedDuringDebug];

        if (this.notAddedBreakpoints){
            breakpointOrigin = BreakpointOrigin[BreakpointOrigin.AddedBeforeDebug];

            this.notAddedBreakpoints = false;
        }

        for (let breakpoint of breakpoints) {

            let exist = this.currentSession.Breakpoints.filter(b => 
                b.FileName == breakpoint.FileName && 
                b.LineNumber == breakpoint.LineNumber)[0];

            if(exist != undefined)
                continue;

            let breakpointData = BreakpointData.newBreakpointData();
            breakpointData.BreakpointKind = BreakpointKind[BreakpointKind.Line];
            breakpointData.Origin = breakpointOrigin;
            breakpointData.LineNumber = breakpoint.LineNumber;
            breakpointData.FileName = breakpoint.FileName;
            breakpointData.Namespace = breakpoint.Namespace;
            breakpointData.Type = breakpoint.Type;
            breakpointData.Created = new Date();
    
            this.currentSession.Breakpoints.push(breakpointData);
        }

        this.repositoryLog.save(this.currentSession);
    }

    public endCurrentSession() : void {
        this.currentSession.Finished = new Date();

        this.repositoryLog.save(this.currentSession);

        this.currentSession = null;
        this.notAddedBreakpoints = true;
    }
}