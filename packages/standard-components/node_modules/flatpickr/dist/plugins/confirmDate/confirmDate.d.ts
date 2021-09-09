import { Plugin } from "../../types/options";
export interface Config {
    confirmIcon?: string;
    confirmText?: string;
    showAlways?: boolean;
    theme?: string;
}
declare function confirmDatePlugin(pluginConfig: Config): Plugin;
export default confirmDatePlugin;
