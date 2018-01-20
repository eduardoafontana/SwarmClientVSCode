'use strict';

import { readFileSync, writeFile, exists } from 'fs';
import { SessionService } from './../domain/sessionService';
import { BreakpointKind } from '../domain/dataModel/breakpointData';

export class VsdbgFileLog {

    private readonly logFile = "C:\\Users\\EduardoAFontana\\vsdbg-ui.log";

    private sessionService : SessionService = new SessionService();

    public processFileLog() : void {
        let fileLines = readFileSync(this.logFile).toString().split('\n');

        for (let line of fileLines) {
            if(this.invalidStartLine(line))
                continue;

            let strObjLine = this.clearLine(line);

            let objLine = JSON.parse(strObjLine);

            switch (objLine.command) {
                case "launch":
                    this.sessionService.registerNewSession(objLine.arguments.__sessionId);
                    break;
                case "setBreakpoints":
                    this.sessionService.registerBreakpoint();
                    break;
                case "disconnect":
                    this.sessionService.endCurrentSession();
                    break;
            }
        }
    }

    private invalidStartLine(line : string) : boolean {
        return !line.startsWith("->");
    }

    private clearLine(line : string) : string {
        return line.replace("-> (C) ", "");
    }
}