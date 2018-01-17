'use strict';

import * as vscode from 'vscode';
import { listeners } from 'cluster';
import { readFileSync, writeFile, exists } from 'fs';
import { SessionController } from './sessionController';

export function activate(context: vscode.ExtensionContext) {

    vscode.debug.onDidStartDebugSession((e: vscode.DebugSession) => {
        //console.log("Start: " + e);

        //SessionController.verifyEntryOnLogFile("__sessionId", "Session");

        // exists(logFile, function(exists){
        //     if(exports)
        //         vscode.window.showInformationMessage("Log file exist!");
        //     else
        //         vscode.window.showInformationMessage("Log file not exist!");
        // });

        SessionController.captureSession();
    });

    vscode.debug.onDidTerminateDebugSession((e: vscode.DebugSession) => {
        //console.log("Terminate: " + e);
        //vscode.window.showInformationMessage('Passed here!');

        //SessionController.verifyEntryOnLogFile("\"command\":\"disconnect\"", "command disconnect");

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