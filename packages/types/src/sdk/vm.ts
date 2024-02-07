export interface VM {
  cpuTime: bigint
  execute(code: string): string
}
