'use strict';

import * as vscode from 'vscode';
import { listeners } from 'cluster';
import { VsdbgFileLog } from './vsdbgFileLog';

var vsdbgFileLog: VsdbgFileLog = null;

export function activate(context: vscode.ExtensionContext) {

    vscode.debug.onDidStartDebugSession((e: vscode.DebugSession) => {
        vsdbgFileLog = new VsdbgFileLog();

        vsdbgFileLog.processFileLog(["launch"]);
        
        vsdbgFileLog.initMonitoringFileLog();
    });

    vscode.debug.onDidChangeActiveDebugSession((e: vscode.DebugSession) => {

    });

    vscode.debug.onDidReceiveDebugSessionCustomEvent((e: vscode.DebugSessionCustomEvent) => {

    });

    vscode.debug.onDidTerminateDebugSession((e: vscode.DebugSession) => {
        if(vsdbgFileLog == null)
            return;

        vsdbgFileLog.processFileLog(["setBreakpoints", "breakpointHitted", "registerSteps"]);
        vsdbgFileLog.processFileLog(["disconnect"]);

        vsdbgFileLog = null;
    });
}

export function deactivate() {
}