class BudibaseError extends Error {
  constructor(message, type, code) {
    super(message)
    this.type = type
    this.code = code
  }
}

module.exports = {
  BudibaseError,
}
