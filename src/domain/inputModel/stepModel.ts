'use strict';

export enum CurrentCommandStep { StepOut, StepInto, StepOver };

export class StepModel {

    public CurrentCommandStep: string;
    public FileName: string;
    public LineNumber: number;
    public LineOfCode: string;
    public Namespace: string;
    public Type: string;
    public Method: string;
    public MethodSignature: string;
    public CharStart: number;
    public CharEnd: number;

    public static newStepModel() : StepModel {
        return <StepModel> {
            CurrentCommandStep: "",
            FileName: "",
            LineNumber: 0,
            LineOfCode: "",
            Namespace: "",
            Type: "",
            Method: "",
            MethodSignature: "",
            CharStart: 0,
            CharEnd: 0,
        };
    }
}