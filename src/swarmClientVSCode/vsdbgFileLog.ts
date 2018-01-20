'use strict';

import { readFileSync, writeFile, exists } from 'fs';
import { SessionController } from './../domain/sessionController';

export class VsdbgFileLog {

    private readonly logFile = "C:\\Users\\EduardoAFontana\\vsdbg-ui.log";

    private sessionController = null;

    constructor(sessionController: SessionController) {
        this.sessionController = sessionController;
    }

    public processLog() : void {
        let fileLines = readFileSync(this.logFile).toString().split('\n');

        for (let line of fileLines) {
            this.sessionController.processEntry(line);
        }
    }
}