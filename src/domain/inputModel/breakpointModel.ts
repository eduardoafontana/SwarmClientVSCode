'use strict';

export class BreakpointModel {

    public FileName: string;
    public LineNumber: number;
    public LineOfCode: string;
    public Namespace: string;
    public Type: string;
    public Method: string;
    public CharStart: number;
    public CharEnd: number;

    public static newBreakpointModel() : BreakpointModel {
        return <BreakpointModel> {
            FileName: "",
            LineNumber: 0,
            LineOfCode: "",
            Namespace: "",
            Type: "",
            Method: "",
            CharStart: 0,
            CharEnd: 0
        };
    }
}