'use strict';

import { readFileSync, writeFile, exists } from 'fs';
import { SessionController } from './sessionController';

export class FileController {

    private readonly logFile = "C:\\Users\\EduardoAFontana\\vsdbg-ui.log";
    private readonly sessionFile = "C:\\SwarmData\\VSCode\\session-" + this.generateIdentifier() + ".txt";

    private sessionController = null;

    constructor(sessionController: SessionController) {
        this.sessionController = sessionController;
    }

    private generateIdentifier() : string {
        return new Date().toISOString().replace(/-/g, '').replace(/:/g, '').replace(/\./g, '').replace(/T/g, '').replace(/Z/g, '');
    }

    public processLog() : void {
        let fileLines = readFileSync(this.logFile).toString().split('\n');

        for (let line of fileLines) {
            this.sessionController.processEntry(line);
        }
    }

    public writeOutput(jsonObject : string) : void {
        writeFile(this.sessionFile, jsonObject, (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log("File has been created");
        }); 
    }
}