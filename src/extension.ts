'use strict';

import * as vscode from 'vscode';
import { listeners } from 'cluster';
import { readFileSync, writeFile, exists } from 'fs';
import { SessionData } from './sessionData';

const logFile = "C:\\Users\\EduardoAFontana\\vsdbg-ui.log";
const sessionFile = "C:\\SwarmData\\VSCode\\session-20180114153066666.txt";

var sessionData : SessionData = undefined;

export function activate(context: vscode.ExtensionContext) {

    vscode.debug.onDidStartDebugSession((e: vscode.DebugSession) => {
        //console.log("Start: " + e);

        VerifyEntryOnLogFile("__sessionId", "Session");

        // exists(logFile, function(exists){
        //     if(exports)
        //         vscode.window.showInformationMessage("Log file exist!");
        //     else
        //         vscode.window.showInformationMessage("Log file not exist!");
        // });

        let fileLines = readFileSync(logFile).toString().split('\n');

        for (let line of fileLines) {
            if(line.startsWith("->")){
                let strObjLine = line.replace("-> (C) ", "");
                let objLine = JSON.parse(strObjLine);
                if(objLine.command == "launch"){
                    sessionData = SessionData.newSessionData();
                    sessionData.Identifier = objLine.arguments.__sessionId;
                    sessionData.Label = "VSCode";
                    sessionData.Description = "TODO";
                    sessionData.Purpose = "TODO";
                    sessionData.Started = new Date();

                    break;
                }
            }
        }

        if(sessionData != undefined){
            writeFile(sessionFile, JSON.stringify(sessionData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
                console.log("File has been created");
            });
        }
    });

    vscode.debug.onDidTerminateDebugSession((e: vscode.DebugSession) => {
        //console.log("Terminate: " + e);
        //vscode.window.showInformationMessage('Passed here!');

        VerifyEntryOnLogFile("\"command\":\"disconnect\"", "command disconnect");

        //--------------------------------------------------------------------

        /*
        var sessionData : SessionData = {
            Identifier: "test identifier",
            Label: "VSCode",
            Description: "test description",
            Purpose: "test purpose",
            Started: new Date(),
            Finished: new Date(),
        
            Breakpoints: [],
            Events: [],
            PathNodes: [],
        
            Task: {},
            Developer: {},
        };

        let fileLines = readFileSync(logFile).toString().split('\n');

        for (let line of fileLines) {
            //criar objeto de sessão
        }

        writeFile(sessionFile, JSON.stringify(sessionData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log("File has been created");
        });
        */
    });

    vscode.debug.onDidReceiveDebugSessionCustomEvent((e: vscode.DebugSessionCustomEvent) => {
        console.log("Event body: " + e.body);
        console.log("Event event: " + e.event);
        console.log("Event session: " + e.session);
    });

    vscode.debug.onDidChangeActiveDebugSession((e: vscode.DebugSession) => {
        console.log("Change: " + e);
    });
}

export function deactivate() {
}

function VerifyEntryOnLogFile(entry: string, message: string){
    let fileLines1 = readFileSync(logFile).toString().split('\n');
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