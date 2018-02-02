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
    public Method: string;//TODO: new, review it on SwarmVS2015/2017

    public AddedSequential : number;//TODO: new, review it on SwarmVS2015/2017 or not register in jSon data/file/webservice.
    public RemovedSequencial : number;//TODO: new, review it on SwarmVS2015/2017 or not register in jSon data/file/webservice.

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
            Method: "",

            AddedSequential: 0,
            RemovedSequencial: 0,
        };
    }
}