'use strict';

import * as vscode from 'vscode';
import { listeners } from 'cluster';
import { VsdbgFileLog } from './vsdbgFileLog';

var vsdbgFileLog: VsdbgFileLog = null;

export function activate(context: vscode.ExtensionContext) {

    vscode.debug.onDidStartDebugSession((e: vscode.DebugSession) => {
        vsdbgFileLog = new VsdbgFileLog();
        vsdbgFileLog.processFileLog();
    });

    vscode.debug.onDidChangeActiveDebugSession((e: vscode.DebugSession) => {
        if(vsdbgFileLog == null)
            return;

        vsdbgFileLog.processFileLog();
    });

    vscode.debug.onDidTerminateDebugSession((e: vscode.DebugSession) => {
        if(vsdbgFileLog == null)
            return;

        vsdbgFileLog.processFileLog();

        vsdbgFileLog = null;
    });

    vscode.debug.onDidReceiveDebugSessionCustomEvent((e: vscode.DebugSessionCustomEvent) => {

    });
}

export function deactivate() {
}