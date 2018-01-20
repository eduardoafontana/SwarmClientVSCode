'use strict';

import { SessionData } from './dataModel/sessionData';
import { BreakpointData, BreakpointKind } from './dataModel/breakpointData';
import { RepositoryLog } from './../dataLog/repositoryLog';

export class SessionService {
    
    private sessionData : SessionData = null;
    private repositoryLog : RepositoryLog = new RepositoryLog();

    public registerNewSession(identifier : string) : void{
        this.sessionData = SessionData.newSessionData();
        this.sessionData.Identifier = identifier;
        this.sessionData.Label = "VSCode";
        this.sessionData.Description = "TODO";
        this.sessionData.Purpose = "TODO";
        this.sessionData.Started = new Date();

        this.repositoryLog.save(this.sessionData);
    }

    public registerBreakpoint() : void {
        let breakpointData = BreakpointData.newBreakpointData();
        breakpointData.BreakpointKind = BreakpointKind[BreakpointKind.Line];
        breakpointData.Created = new Date();

        this.sessionData.Breakpoints.push(breakpointData);

        this.repositoryLog.save(this.sessionData);
    }

    public endCurrentSession() : void {
        this.sessionData.Finished = new Date();

        this.repositoryLog.save(this.sessionData);
    }
}