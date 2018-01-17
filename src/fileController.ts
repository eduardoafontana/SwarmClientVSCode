'use strict';

import { readFileSync, writeFile, exists } from 'fs';
import { SessionController } from './sessionController';

export class FileController {

    private static readonly logFile = "C:\\Users\\EduardoAFontana\\vsdbg-ui.log";
    private static readonly sessionFile = "C:\\SwarmData\\VSCode\\session-" + FileController.generateIdentifier() + ".txt";

    public static generateIdentifier() : string {
        return new Date().toISOString().replace(/-/g, '').replace(/:/g, '').replace(/\./g, '').replace(/T/g, '').replace(/Z/g, '');
    }

    public static processLog() : void {
        let fileLines = readFileSync(this.logFile).toString().split('\n');

        for (let line of fileLines) {
            SessionController.processEntry(line);
        }
    }

    public static writeOutput(jsonObject : string) : void {
        writeFile(this.sessionFile, jsonObject, (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log("File has been created");
        }); 
    }

    // exists(logFile, function(exists){
    //     if(exports)
    //         vscode.window.showInformationMessage("Log file exist!");
    //     else
    //         vscode.window.showInformationMessage("Log file not exist!");
    // });
}