'use strict';

import * as vscode from 'vscode';
import { listeners } from 'cluster';
import { readFileSync, writeFile, exists } from 'fs';
import { SessionController } from './sessionController';

var sessionController: SessionController = null;

export function activate(context: vscode.ExtensionContext) {

    vscode.debug.onDidStartDebugSession((e: vscode.DebugSession) => {
        //console.log("Start: " + e);

        //SessionController.verifyEntryOnLogFile("__sessionId", "Session");

        sessionController = new SessionController();
        sessionController.captureSession();
    });

    vscode.debug.onDidTerminateDebugSession((e: vscode.DebugSession) => {
        //console.log("Terminate: " + e);

        //SessionController.verifyEntryOnLogFile("\"command\":\"disconnect\"", "command disconnect");
    });

    vscode.debug.onDidReceiveDebugSessionCustomEvent((e: vscode.DebugSessionCustomEvent) => {
        //console.log("Event body: " + e.body);
        //console.log("Event event: " + e.event);
        //console.log("Event session: " + e.session);
    });

    vscode.debug.onDidChangeActiveDebugSession((e: vscode.DebugSession) => {
        //console.log("Change: " + e);

        if(sessionController == null)
            return;

        sessionController.captureSession();

        sessionController = null;
    });
}

export function deactivate() {
}