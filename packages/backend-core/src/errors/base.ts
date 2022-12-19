export class BudibaseError extends Error {
  code: string
  type: string

  constructor(message: string, code: string, type: string) {
    super(message)
    this.code = code
    this.type = type
  }
}
