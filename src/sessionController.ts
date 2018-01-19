'use strict';

//import * as vscode from 'vscode';
import { SessionData } from './sessionData';
import { BreakpointData } from './breakpointData';
import { FileController } from './fileController';

export class SessionController {
    
    private static sessionData : SessionData = undefined;

    public static captureSession() : void {
        FileController.processLog();
    }

    public static processEntry(line : string) : void {
        if(this.invalidStartLine(line))
            return;

        let strObjLine = this.clearLine(line);

        let objLine = JSON.parse(strObjLine);

        if(objLine.command == "launch"){
            this.sessionData = SessionData.newSessionData();
            this.sessionData.Identifier = objLine.arguments.__sessionId;
            this.sessionData.Label = "VSCode";
            this.sessionData.Description = "TODO";
            this.sessionData.Purpose = "TODO";
            this.sessionData.Started = new Date();
        }
        
        if(objLine.command == "setBreakpoints"){
            let breakpointData = BreakpointData.newBreakpointData(); 
        }

        if(this.sessionData != undefined){
            FileController.writeOutput(JSON.stringify(this.sessionData, null, 2));
        }        
    }

    private static invalidStartLine(line : string) : boolean {
        return !line.startsWith("->");
    }

    private static clearLine(line : string) : string {
        return line.replace("-> (C) ", "");
    }

    /*
    public static verifyEntryOnLogFile(entry: string, message: string) : void {
        let fileLines1 = readFileSync(this.logFile).toString().split('\n');
        let notFound = true;
    
        for (let line of fileLines1) {
            if(line.indexOf(entry) > 0) {
                notFound = false;
                vscode.window.showInformationMessage(message + " exist on file! " + line.substr(line.indexOf(entry) + 12, 36));
                break;
            }
        }
    
        if(notFound)
            vscode.window.showInformationMessage(message + " does NOT exist on file!");
    }
    */
}