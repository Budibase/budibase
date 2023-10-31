export interface Upload {
  size: number
  name: string
  url: string
  extension: string
  key: string
}

export type ProcessAttachmentResponse = Upload[]
