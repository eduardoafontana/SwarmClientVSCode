'use strict';

import { readFileSync, writeFile, exists } from 'fs';
import { SessionService } from './../domain/sessionService';

export class VsdbgFileLog {

    private readonly logFile = "C:\\Users\\EduardoAFontana\\vsdbg-ui.log";

    private sessionService = null;

    constructor(sessionService: SessionService) {
        this.sessionService = sessionService;
    }

    public processLog() : void {
        let fileLines = readFileSync(this.logFile).toString().split('\n');

        for (let line of fileLines) {
            this.sessionService.processEntry(line);
        }
    }
}