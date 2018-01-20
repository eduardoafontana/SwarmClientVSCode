'use strict';

import { SessionData } from './dataModel/sessionData';
import { BreakpointData, BreakpointKind } from './dataModel/breakpointData';
import { RepositoryLog } from './../dataLog/repositoryLog';

export class SessionService {
    
    private currentSession : SessionData = null;
    private repositoryLog : RepositoryLog = new RepositoryLog();

    public registerNewSession(identifier : string) : void{
        if(this.currentSession != null)
            return;

        this.currentSession = SessionData.newSessionData();
        this.currentSession.Identifier = identifier;
        this.currentSession.Label = "VSCode";
        this.currentSession.Description = "TODO";
        this.currentSession.Purpose = "TODO";
        this.currentSession.Started = new Date();

        this.repositoryLog.save(this.currentSession);
    }

    public registerBreakpoint() : void {
        let breakpointData = BreakpointData.newBreakpointData();
        breakpointData.BreakpointKind = BreakpointKind[BreakpointKind.Line];
        breakpointData.Created = new Date();

        this.currentSession.Breakpoints.push(breakpointData);

        this.repositoryLog.save(this.currentSession);
    }

    public endCurrentSession() : void {
        this.currentSession.Finished = new Date();

        this.repositoryLog.save(this.currentSession);

        this.currentSession = null;
    }
}