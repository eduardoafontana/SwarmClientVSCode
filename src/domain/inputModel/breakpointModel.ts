'use strict';

export class BreakpointModel {

    public FileName: string;
    public FileLine: number;

    public static newBreakpointModel() : BreakpointModel {
        return <BreakpointModel> {
            FileName: "",
            FileLine: 0,
        };
    }
}