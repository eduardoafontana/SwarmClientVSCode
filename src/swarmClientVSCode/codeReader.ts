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
}