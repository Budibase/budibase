export class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.httpStatusCode = 400
  }
}

export class UnauthorisedError extends Error {
  constructor(message) {
    super(message)
    this.httpStatusCode = 401
  }
}

export class ForbiddenError extends Error {
  constructor(message) {
    super(message)
    this.httpStatusCode = 403
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.httpStatusCode = 404
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message)
    this.httpStatusCode = 409
  }
}
