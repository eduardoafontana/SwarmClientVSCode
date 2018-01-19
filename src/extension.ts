'use strict';

import * as vscode from 'vscode';
import { listeners } from 'cluster';
import { readFileSync, writeFile, exists } from 'fs';
import { SessionController } from './sessionController';

var sessionController: SessionController = null;

export function activate(context: vscode.ExtensionContext) {

    vscode.debug.onDidStartDebugSession((e: vscode.DebugSession) => {
        sessionController = new SessionController();
        sessionController.captureSession();
    });

    vscode.debug.onDidChangeActiveDebugSession((e: vscode.DebugSession) => {
        if(sessionController == null)
            return;

        sessionController.captureSession();
    });

    vscode.debug.onDidTerminateDebugSession((e: vscode.DebugSession) => {
        if(sessionController == null)
            return;

        sessionController.captureSession();

        sessionController = null;
    });

    vscode.debug.onDidReceiveDebugSessionCustomEvent((e: vscode.DebugSessionCustomEvent) => {

    });
}

export function deactivate() {
}