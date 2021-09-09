import { Plugin } from "../types/options";
export interface Config {
    moment: Function;
}
declare function momentPlugin(config: Config): Plugin;
export default momentPlugin;
