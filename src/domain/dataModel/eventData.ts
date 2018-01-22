'use strict';

export enum EventKind
{
    StepOut,
    StepInto,
    StepOver,
    Suspend,
    Resume,
    BreakpointAdd,
    BreakpointChange,
    BreakpointRemove,
    SuspendBreakpoint,
    InspectVariable,
    ModifyVariable,

    BreakpointHitted
};

export class EventData {

    public EventKind : string;
    public Detail : string;
    public Namespace : string;
    public Type : string;
    public TypeFullPath : string;
    public Method : string;
    public MethodKey : string;
    public MethodSignature : string;
    public CharStart : number;
    public CharEnd : number;
    public LineNumber : number;
    public LineOfCode : string;
    public Created : Date;

    public static newEventData() : EventData {
        return <EventData> {
            EventKind: "",
            Detail: "",
            Namespace: "",
            Type: "",
            TypeFullPath: "",
            Method: "",
            MethodKey: "",
            MethodSignature: "",
            CharStart: 0,
            CharEnd: 0,
            LineNumber: 0,
            LineOfCode: "",
            Created: new Date('01 January 0 00:00:00 UTC')
        };
    }
}