export interface RagProcessInput {
  buffer: Buffer
  filename?: string
  mimetype?: string
}

export interface RagFileProcessor {
  process(input: RagProcessInput): Promise<string[]>
}
