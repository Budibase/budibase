import { Plugin } from "../types/options";
export interface MinMaxTime {
    minTime?: string;
    maxTime?: string;
}
export interface Config {
    table?: Record<string, MinMaxTime>;
    getTimeLimits?: (date: Date) => MinMaxTime;
    tableDateFormat?: string;
}
export interface State {
    formatDate: (date: Date, f: string) => string;
    tableDateFormat: string;
    defaults: MinMaxTime;
}
declare function minMaxTimePlugin(config?: Config): Plugin;
export default minMaxTimePlugin;
