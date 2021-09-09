import { PluginFunc } from 'dayjs/esm'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs/esm' {
    interface Dayjs {
        set(argument: object): Dayjs
        add(argument: object): Dayjs
        subtract(argument: object): Dayjs
    }
}
