'use strict';

import { SessionData } from './dataModel/sessionData';
import { BreakpointData, BreakpointKind } from './dataModel/breakpointData';
import { RepositoryLog } from './../dataLog/repositoryLog';
import { VsdbgFileLog } from './../swarmClientVSCode/vsdbgFileLog';

export class SessionController {
    
    private sessionData : SessionData = null;
    private repositoryLog : RepositoryLog = new RepositoryLog();
    private vsdbgFileLog : VsdbgFileLog = new VsdbgFileLog(this);

    public captureSession() : void {
        this.vsdbgFileLog.processLog();
    }

    public processEntry(line : string) : void {
        if(this.invalidStartLine(line))
            return;

        let strObjLine = this.clearLine(line);

        let objLine = JSON.parse(strObjLine);

        if(objLine.command == "launch"){
            //TODO test if Identifier changed, so new session on processing.

            this.sessionData = SessionData.newSessionData();
            this.sessionData.Identifier = objLine.arguments.__sessionId;
            this.sessionData.Label = "VSCode";
            this.sessionData.Description = "TODO";
            this.sessionData.Purpose = "TODO";
            this.sessionData.Started = new Date();
        }
        
        if(objLine.command == "setBreakpoints"){
            let breakpointData = BreakpointData.newBreakpointData();
            breakpointData.BreakpointKind = BreakpointKind[BreakpointKind.Line];
            breakpointData.Created = new Date();

            this.sessionData.Breakpoints.push(breakpointData);
        }

        if(this.sessionData != undefined){
            this.repositoryLog.writeOutput(JSON.stringify(this.sessionData, null, 2));
        }        
    }

    private invalidStartLine(line : string) : boolean {
        return !line.startsWith("->");
    }

    private clearLine(line : string) : string {
        return line.replace("-> (C) ", "");
    }
}