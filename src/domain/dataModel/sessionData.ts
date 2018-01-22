'use strict';

import { BreakpointData } from './breakpointData';
import { EventData } from './eventData';

export class SessionData {

    public Identifier: string;
    public Label: string;
    public Description: string;
    public Purpose: string;
    public Started: Date;
    public Finished: Date;

    public Breakpoints: BreakpointData[];
    public Events: EventData[];
    public PathNodes: string[];

    public Task: {};
    public Developer: {};

    public static newSessionData() : SessionData {
        return <SessionData> {
            Identifier: "",
            Label: "",
            Description: "",
            Purpose: "",
            Started: new Date('01 January 0 00:00:00 UTC'),
            Finished: new Date('01 January 0 00:00:00 UTC'),
        
            Breakpoints: [],
            Events: [],
            PathNodes: [],
        
            Task: {},
            Developer: {},
        };
    }

/*  TODO: review other types and elements later.
    public List<BreakpointData> Breakpoints { get; set; } = new List<BreakpointData>();
    public List<EventData> Events { get; set; } = new List<EventData>();
    public List<PathNodeData> PathNodes { get; set; } = new List<PathNodeData>();

    public TaskData Task { get; set; }
    public DeveloperData Developer { get; set; } 
    */

    /*
        "Identifier": "627874f6-eae3-404f-8b8f-0c576cf1d9e8",
        "Label": "TODO",
        "Description": "TODO",
        "Purpose": "TODO",
        "Started": "2017-12-18T21:48:14.4093135-02:00",
        "Finished": "2017-12-18T21:48:34.8672767-02:00",
        "Breakpoints": [
        "Events": [
        "PathNodes": [
        "Task": { Project
        "Developer": {
    */
}