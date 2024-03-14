export interface VM {
  execute(code: string): any
  withContext<T>(context: Record<string, any>, executeWithContext: () => T): T
  close(): void
}
