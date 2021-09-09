import { PluginFunc } from 'dayjs/esm'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs/esm' {
  export function updateLocale(localeName: String, customConfig: Object): any
}
