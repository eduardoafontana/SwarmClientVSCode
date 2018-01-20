'use strict';

import { readFileSync, writeFile, exists } from 'fs';

export class RepositoryLog {

    private identifier : string;
    private sessionFile = "C:\\SwarmData\\VSCode\\session-" + this.identifier + ".txt";

    public generateIdentifier() : void {
        this.identifier = new Date().toISOString().replace(/-/g, '').replace(/:/g, '').replace(/\./g, '').replace(/T/g, '').replace(/Z/g, '');
    }

    private writeOutput(jsonObject : string) : void {
        writeFile(this.sessionFile, jsonObject, (err) => {
            if (err) {
                console.error(err);
                return;
            };
        }); 
    }

    public save(pObject : object) : void {
        if(pObject == null)
            return;

        if(pObject == undefined)
            return;

        this.writeOutput(JSON.stringify(pObject, null, 2));
    }
}