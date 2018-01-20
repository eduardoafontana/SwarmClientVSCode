'use strict';

import { readFileSync, writeFile, exists } from 'fs';
import { SessionService } from './../domain/sessionService';

export class VsdbgFileLog {

    private readonly logFile = "C:\\Users\\EduardoAFontana\\vsdbg-ui.log";

    private sessionService : SessionService = new SessionService();

    public processFileLog() : void {
        let fileLines = readFileSync(this.logFile).toString().split('\n');

        for (let line of fileLines) {

            //TODO: improve to capture json oject from file log and send it to service by domain model.

            if(this.invalidStartLine(line))
                return;

            let strObjLine = this.clearLine(line);

            this.sessionService.processEntry(strObjLine);
        }
    }

    private invalidStartLine(line : string) : boolean {
        return !line.startsWith("->");
    }

    private clearLine(line : string) : string {
        return line.replace("-> (C) ", "");
    }
}