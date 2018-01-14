'use strict';

import * as vscode from 'vscode';
import { listeners } from 'cluster';

export function activate(context: vscode.ExtensionContext) {

    vscode.debug.onDidStartDebugSession((e: vscode.DebugSession) => {
        console.log("Start: " + e);
    });

    vscode.debug.onDidTerminateDebugSession((e: vscode.DebugSession) => {
        console.log("Terminate: " + e);
        vscode.window.showInformationMessage('Passed here!');
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