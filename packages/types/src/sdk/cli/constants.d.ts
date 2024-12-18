import { Event } from "../events";
export declare enum CommandWord {
    BACKUPS = "backups",
    HOSTING = "hosting",
    ANALYTICS = "analytics",
    HELP = "help",
    PLUGIN = "plugins"
}
export declare enum InitType {
    QUICK = "quick",
    DIGITAL_OCEAN = "do"
}
export declare const AnalyticsEvent: {
    OptOut: string;
    OptIn: string;
    SelfHostInit: string;
    PluginInit: Event;
};
