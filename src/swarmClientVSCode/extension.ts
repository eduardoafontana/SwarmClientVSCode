'use strict';

import * as vscode from 'vscode';
import { listeners } from 'cluster';
import { readFileSync, writeFile, exists } from 'fs';
import { SessionService } from './../domain/sessionService';

var sessionService: SessionService = null;

export function activate(context: vscode.ExtensionContext) {

    vscode.debug.onDidStartDebugSession((e: vscode.DebugSession) => {
        sessionService = new SessionService();
        sessionService.captureSession();
    });

    vscode.debug.onDidChangeActiveDebugSession((e: vscode.DebugSession) => {
        if(sessionService == null)
            return;

            sessionService.captureSession();
    });

    vscode.debug.onDidTerminateDebugSession((e: vscode.DebugSession) => {
        if(sessionService == null)
            return;

        sessionService.captureSession();

        sessionService = null;
    });

    vscode.debug.onDidReceiveDebugSessionCustomEvent((e: vscode.DebugSessionCustomEvent) => {

    });
}

export function deactivate() {
}