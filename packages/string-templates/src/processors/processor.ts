export abstract class Processor {
  abstract process(output: string, match: string, opts?: any): string
}
