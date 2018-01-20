'use strict';

import { SessionData } from './dataModel/sessionData';
import { BreakpointData, BreakpointKind } from './dataModel/breakpointData';
import { RepositoryLog } from './../dataLog/repositoryLog';

export class SessionService {
    
    private sessionData : SessionData = null;
    private repositoryLog : RepositoryLog = new RepositoryLog();

    public processEntry(strObjLine : string) : void {
        let objLine = JSON.parse(strObjLine);

        if(objLine.command == "launch"){
            //TODO test if Identifier changed, so new session on processing.

            this.sessionData = SessionData.newSessionData();
            this.sessionData.Identifier = objLine.arguments.__sessionId;
            this.sessionData.Label = "VSCode";
            this.sessionData.Description = "TODO";
            this.sessionData.Purpose = "TODO";
            this.sessionData.Started = new Date();

            this.repositoryLog.save(this.sessionData);
        }
        
        if(objLine.command == "setBreakpoints"){
            let breakpointData = BreakpointData.newBreakpointData();
            breakpointData.BreakpointKind = BreakpointKind[BreakpointKind.Line];
            breakpointData.Created = new Date();

            this.sessionData.Breakpoints.push(breakpointData);

            this.repositoryLog.save(this.sessionData);
        }
    }
}