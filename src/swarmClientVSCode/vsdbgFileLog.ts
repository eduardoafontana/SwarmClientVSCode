'use strict';

import { readFileSync, writeFile, exists, watch } from 'fs';
import { SessionService } from './../domain/sessionService';
import { BreakpointKind } from '../domain/dataModel/breakpointData';

export class VsdbgFileLog {

    private readonly logFile = "C:\\Users\\EduardoAFontana\\vsdbg-ui.log";

    private sessionService : SessionService = new SessionService();
    private currentSessionId : string = null;

    public processFileLog(eventAction : string) : void {
        let fileLines = readFileSync(this.logFile).toString().split('\n');

        for (let line of fileLines) {
            if(this.invalidStartLine(line))
                continue;

            let strObjLine = this.clearLine(line);

            let objLine = JSON.parse(strObjLine);

            if(objLine.command == "launch" && eventAction == "launch"){
                this.processLaunch(objLine);
                break;
            } else if(objLine.command == "setBreakpoints" && eventAction == "setBreakpoints"){
                this.sessionService.registerBreakpoint();
                break;
            } else if(objLine.command == "disconnect" && eventAction == "disconnect"){
                this.sessionService.endCurrentSession();
                break;
            }
        }
    }

    public initMonitoringFileLog(): void {
        var self = this;

        watch(this.logFile, function(e: string) {
            self.processFileLog("setBreakpoints");
        });
    }

    private invalidStartLine(line : string) : boolean {
        return !line.startsWith("->");
    }

    private clearLine(line : string) : string {
        return line.replace("-> (C) ", "");
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
}