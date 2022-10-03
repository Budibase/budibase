import { BudibaseError } from "./base"

export class GenericError extends BudibaseError {
  constructor(message: string, code: string, type: string) {
    super(message, code, type ? type : "generic")
  }
}
