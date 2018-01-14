'use strict';

import * as vscode from 'vscode';
import { listeners } from 'cluster';
import { readFileSync, writeFile } from 'fs';
import { SessionData } from './sessionData';

const logFile = "C:\\Users\\EduardoAFontana\\vsdbg-ui.log";

export function activate(context: vscode.ExtensionContext) {

    vscode.debug.onDidStartDebugSession((e: vscode.DebugSession) => {
        console.log("Start: " + e);
    });

    vscode.debug.onDidTerminateDebugSession((e: vscode.DebugSession) => {
        //console.log("Terminate: " + e);
        //vscode.window.showInformationMessage('Passed here!');

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

        writeFile("C:\\SwarmData\\VSCode\\session-20180114153066666.txt", JSON.stringify(sessionData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log("File has been created");
        });
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