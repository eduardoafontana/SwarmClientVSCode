'use strict';

export enum BreakpointOrigin { AddedBeforeDebug, AddedDuringDebug };

export enum BreakpointKind { Line, Conditional, Exception };

export class BreakpointData {

    public BreakpointKind: string;
    public Namespace: string;
    public Type: string;
    public LineNumber: number;
    public LineOfCode: string;
    public Origin: string;
    public Created: Date;
    public FileName: string;//TODO: new, review it on SwarmVS2015/2017

    public static newBreakpointData() : BreakpointData {
        return <BreakpointData> {
            BreakpointKind: "",
            Namespace: "",
            Type: "",
            LineNumber: 0,
            LineOfCode: "",
            Origin: "",
            Created: new Date('01 January 0 00:00:00 UTC'),
            FileName: "",
        };
    }

    /*
      "BreakpointKind": "Line",
      "Namespace": "ConsoleApp1",
      "Type": "Adress",
      "LineNumber": 22,s
      "LineOfCode": "return String.Format(\"{0} : {1}\", Number, Street);",
      "Origin": "AddedBeforeDebug",
      "Created": "2017-12-20T19:14:00.8705589-02:00"
    */
}