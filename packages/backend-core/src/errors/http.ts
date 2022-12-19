import { GenericError } from "./generic"

export class HTTPError extends GenericError {
  status: number

  constructor(
    message: string,
    httpStatus: number,
    code = "http",
    type = "generic"
  ) {
    super(message, code, type)
    this.status = httpStatus
  }
}
