'use strict';

import { readFileSync, writeFile, exists, watch } from 'fs';
import { SessionService } from './../domain/sessionService';
import { BreakpointModel } from '../domain/inputModel/breakpointModel';
import { CodeReader } from './codeReader';
import { StepModel, CurrentCommandStep } from '../domain/inputModel/stepModel';

export class VsdbgFileLog {

    private readonly logFile = "C:\\Users\\EduardoAFontana\\vsdbg-ui.log";

    private sessionService : SessionService = new SessionService();
    private currentSessionId : string = null;
    private currentStep : string = CurrentCommandStep[CurrentCommandStep.StepOver];

    public processFileLog(eventAction : string[]) : void {
        let fileLines = readFileSync(this.logFile).toString().split('\n');

        for (let line of fileLines) {
            if(this.invalidStartLine(line))
                continue;

            let strObjLine = this.clearLine(line);

            let objLine = JSON.parse(strObjLine);

            if(objLine.command == "launch" && eventAction.filter(e => e == "launch")[0] != undefined){
                this.processLaunch(objLine);
                break;
            } else if(objLine.command == "setBreakpoints" && eventAction.filter(e => e == "setBreakpoints")[0] != undefined){
                this.processBreakpoint(objLine);
            } else if(objLine.event == "stopped" && objLine.body.reason == "breakpoint" && eventAction.filter(e => e == "breakpointHitted")[0] != undefined){
                this.processBreakpointHitted(objLine);
            } else if(objLine.command == "stepIn" && eventAction.filter(e => e == "registerSteps")[0] != undefined){
                this.currentStep = CurrentCommandStep[CurrentCommandStep.StepInto];
            } else if(objLine.event == "stopped" && objLine.body.reason == "step" && eventAction.filter(e => e == "registerSteps")[0] != undefined){
                this.processSteps(objLine);
            } else if(objLine.command == "disconnect" && eventAction.filter(e => e == "disconnect")[0] != undefined){
                this.sessionService.endCurrentSession();
                break;
            }
        }
    }

    public initMonitoringFileLog(): void {
        var self = this;

        watch(this.logFile, function(e: string) {
            self.processFileLog(["setBreakpoints", "breakpointHitted", "registerSteps"]);
        });
    }

    private invalidStartLine(line : string) : boolean {
        return !line.startsWith("-> (C) ") && !line.startsWith("<- (E) ");
    }

    private clearLine(line : string) : string {
        return line.replace("-> (C) ", "").replace("<- (E) ", "");
    }

    private processLaunch(objLine : any): void {
        if(this.currentSessionId == null)
            this.currentSessionId = objLine.arguments.__sessionId;

        if(this.currentSessionId == objLine.arguments.__sessionId)
            this.sessionService.registerNewSession(objLine.arguments.__sessionId);
        else{
            this.sessionService.endCurrentSession();

            this.sessionService.registerNewSession(objLine.arguments.__sessionId);
        }
    }

    private processBreakpoint(objLine: any): void {
        let breakpoints = [];

        for (let breakpointEntry of objLine.arguments.breakpoints) {
            let breakpoint = BreakpointModel.newBreakpointModel();
            breakpoint.FileName = objLine.arguments.source.name;
            breakpoint.LineNumber = breakpointEntry.line;
            breakpoint.Namespace = CodeReader.getNamespace(objLine.arguments.source.path);
            breakpoint.Type = CodeReader.getType(objLine.arguments.source.path);
            breakpoint.Method = CodeReader.getMethod(objLine.arguments.source.path, breakpointEntry.line);
            breakpoint.LineOfCode = CodeReader.getCurrentLine(objLine.arguments.source.path, breakpointEntry.line);
            breakpoint.CharStart = CodeReader.getCharStart(objLine.arguments.source.path, breakpointEntry.line);
            breakpoint.CharEnd = CodeReader.getCharEnd(objLine.arguments.source.path, breakpointEntry.line);

            breakpoints.push(breakpoint);
        }

        this.sessionService.registerBreakpoint(breakpoints, objLine.seq);
    }

    private processBreakpointHitted(objLine: any): void {
        if(objLine.body.reason != "breakpoint")
            return;

        let breakpoint = BreakpointModel.newBreakpointModel();
        breakpoint.FileName = objLine.body.source.name;
        breakpoint.LineNumber = objLine.body.line;
        breakpoint.Namespace = CodeReader.getNamespace(objLine.body.source.path);
        breakpoint.Type = CodeReader.getType(objLine.body.source.path);
        breakpoint.Method = CodeReader.getMethod(objLine.body.source.path, objLine.body.line);
        breakpoint.LineOfCode = CodeReader.getCurrentLine(objLine.body.source.path, objLine.body.line);
        breakpoint.CharStart = CodeReader.getCharStart(objLine.body.source.path, objLine.body.line);
        breakpoint.CharEnd = CodeReader.getCharEnd(objLine.body.source.path, objLine.body.line);

        this.sessionService.registerHitted(breakpoint, objLine.seq);
    }

    private processSteps(objLine: any): void {
        if(objLine.body.reason != "step")
            return;

        let step = StepModel.newStepModel();
        step.CurrentCommandStep = this.currentStep;
        step.FileName = objLine.body.source.name;
        step.LineNumber = objLine.body.line;
        step.Namespace = CodeReader.getNamespace(objLine.body.source.path);
        step.Type = CodeReader.getType(objLine.body.source.path);
        step.Method = CodeReader.getMethod(objLine.body.source.path, objLine.body.line);
        step.LineOfCode = CodeReader.getCurrentLine(objLine.body.source.path, objLine.body.line);
        step.CharStart = objLine.body.column;
        step.CharEnd = CodeReader.getCharEnd(objLine.body.source.path, objLine.body.line);

        this.sessionService.registerStep(step, objLine.seq);

        this.currentStep = CurrentCommandStep[CurrentCommandStep.StepOver];
    }
}