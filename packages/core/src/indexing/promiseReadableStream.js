// adapted from https://github.com/dex4er/js-promise-readable
// thanks :)

export const promiseReadableStream = stream => {
  let _errored

  const _errorHandler = err => {
    _errored = err
  }

  stream.on("error", _errorHandler)

  const read = size => {
    return new Promise((resolve, reject) => {
      if (_errored) {
        const err = _errored
        _errored = undefined
        return reject(err)
      }

      if (!stream.readable || stream.closed || stream.destroyed) {
        return resolve()
      }

      const readableHandler = () => {
        const chunk = stream.read(size)

        if (chunk) {
          removeListeners()
          resolve(chunk)
        }
      }

      const closeHandler = () => {
        removeListeners()
        resolve()
      }

      const endHandler = () => {
        removeListeners()
        resolve()
      }

      const errorHandler = err => {
        _errored = undefined
        removeListeners()
        reject(err)
      }

      const removeListeners = () => {
        stream.removeListener("close", closeHandler)
        stream.removeListener("error", errorHandler)
        stream.removeListener("end", endHandler)
        stream.removeListener("readable", readableHandler)
      }

      stream.on("close", closeHandler)
      stream.on("end", endHandler)
      stream.on("error", errorHandler)
      stream.on("readable", readableHandler)

      readableHandler()
    })
  }

  const destroy = () => {
    if (stream) {
      if (_errorHandler) {
        stream.removeListener("error", _errorHandler)
      }
      if (typeof stream.destroy === "function") {
        stream.destroy()
      }
    }
  }

  return { read, destroy, stream }
}

export default promiseReadableStream
