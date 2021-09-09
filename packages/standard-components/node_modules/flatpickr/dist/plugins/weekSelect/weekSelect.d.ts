import { Plugin } from "../../types/options";
export declare type PlusWeeks = {
    weekStartDay: Date;
    weekEndDay: Date;
};
declare function weekSelectPlugin(): Plugin<PlusWeeks>;
export default weekSelectPlugin;
