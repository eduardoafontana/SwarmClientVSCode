'use strict';

import { readFileSync, writeFile, writeFileSync, exists } from 'fs';

export class RepositoryLog {

    private sessionFile : string;

    public generateIdentifier() : void {
        let identifier = new Date().toISOString().replace(/-/g, '').replace(/:/g, '').replace(/\./g, '').replace(/T/g, '').replace(/Z/g, '');
        
        this.sessionFile = "C:\\SwarmData\\VSCode\\session-" + identifier + ".txt";
    }

    private writeOutput(jsonObject : string) : void {
        writeFileSync(this.sessionFile, jsonObject);
    }

    public save(pObject : object) : void {
        if(pObject == null)
            return;

        if(pObject == undefined)
            return;

        this.writeOutput(JSON.stringify(pObject, null, 2));
    }
}