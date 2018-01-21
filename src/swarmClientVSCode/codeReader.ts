'use strict';

import { readFileSync, writeFile, exists, watch } from 'fs';

export class CodeReader {

    public static getNamespace(filePath : string) : string {
        let fileLines = readFileSync(filePath).toString().split('\n');

        let namespaceLine = fileLines.filter(line => line.indexOf("namespace") >= 0)[0];

        if(namespaceLine == undefined)
            return "Fail to get namespace, namespace word not found.";

        try
        {
            let namespaceWordPosition = namespaceLine.indexOf("namespace");
            return namespaceLine.substr(namespaceWordPosition + 9, namespaceLine.length - (namespaceWordPosition + 9)).trim();
        }
        catch
        {
            return "Fatal error to get namespace in file.";
        }
    }

    public static getType(filePath: string): string {
        let fileLines = readFileSync(filePath).toString().split('\n');

        let classLine = fileLines.filter(line => line.indexOf("class") >= 0)[0];

        if(classLine == undefined)
            return "Fail to get class, class word not found.";

        try
        {
            let classWordPosition = classLine.indexOf("class");
            return classLine.substr(classWordPosition + 5, classLine.length - (classWordPosition + 5)).trim();
        }
        catch
        {
            return "Fatal error to get class in file.";
        }
    }

    public static getCurrentLine(filePath: string, lineNumber: number): string {
        let fileLines = readFileSync(filePath).toString().split('\n');

        try
        {
            return fileLines[lineNumber - 1].trim();//-1 because starts from zero, but in vscode starts from one.
        }
        catch
        {
            return "Fatal error to get line code in file.";
        }
    }
}