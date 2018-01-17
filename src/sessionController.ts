'use strict';

//import * as vscode from 'vscode';
import { readFileSync, writeFile, exists } from 'fs';
import { SessionData } from './sessionData';

export class SessionController {

    private static readonly logFile = "C:\\Users\\EduardoAFontana\\vsdbg-ui.log";
    private static readonly sessionFile = "C:\\SwarmData\\VSCode\\session-20180114153066666.txt";
    
    private static sessionData : SessionData = undefined;

    public static captureSession() : void {
        let fileLines = readFileSync(this.logFile).toString().split('\n');

        for (let line of fileLines) {
            if(line.startsWith("->")){
                let strObjLine = line.replace("-> (C) ", "");
                let objLine = JSON.parse(strObjLine);
                if(objLine.command == "launch"){
                    this.sessionData = SessionData.newSessionData();
                    this.sessionData.Identifier = objLine.arguments.__sessionId;
                    this.sessionData.Label = "VSCode";
                    this.sessionData.Description = "TODO";
                    this.sessionData.Purpose = "TODO";
                    this.sessionData.Started = new Date();

                    break;
                }
            }
        }

        if(this.sessionData != undefined){
            writeFile(this.sessionFile, JSON.stringify(this.sessionData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
                console.log("File has been created");
            });
        }
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