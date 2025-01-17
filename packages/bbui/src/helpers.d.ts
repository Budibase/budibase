declare module "./helpers" {
  export const cloneDeep: <T>(obj: T) => T
  export const copyToClipboard: (value: any) => Promise<void>
}
