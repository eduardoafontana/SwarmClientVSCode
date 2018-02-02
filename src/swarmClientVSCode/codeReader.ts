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

    public static getMethod(filePath: string, lineNumber: number): string {
        let fileLines = readFileSync(filePath).toString().split('\n');

        lineNumber = lineNumber - 1;

        if(lineNumber > fileLines.length)
            return "Fail to get method, current line upper than file lines length.";

        for(let i = lineNumber; i >= 0; i--){
            if(fileLines[i].indexOf("class") >= 0)
                return "Fail to get method, class word found, no satisfied condition.";
            
            let words = fileLines[i].trim().split(" ");

            if(words.length == 0)
                continue;

            if(words[0] != "public" && words[0] != "protected" && words[0] != "internal" && words[0] != "private" && words[0] != "static")
                continue;
            
            if(words.length == 1)
                continue;

            let parameters1 = fileLines[i].trim().split("(");

            if(parameters1.length < 2)
                continue;

            let parameters2 = fileLines[i].trim().split(")");
            
            if(parameters2.length < 2)
                continue;

            return fileLines[i].trim();
        }

        return "Fail to get method, end of file, no satisfied condition.";
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

    public static getCharStart(filePath: string, lineNumber: number): number {
        let fileLines = readFileSync(filePath).toString().split('\n');

        let line = fileLines[lineNumber - 1];
        let emptySpaceCount = 0;

        for(let i = 0; i < line.length; i++){
            if(line[i] == " ")
                emptySpaceCount++;
            else
                break;
        }

        return emptySpaceCount + 1;
    }

    public static getCharEnd(filePath: string, lineNumber: number): number {
        let fileLines = readFileSync(filePath).toString().split('\n');

        return fileLines[lineNumber - 1].length;
    }
}