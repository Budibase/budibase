// adapted from https://github.com/dex4er/js-promise-writable
// Thank you :)
export const promiseWriteableStream = stream => {
  let _errored

  const _errorHandler = err => {
    _errored = err
  }

  stream.on("error", _errorHandler)

  const write = chunk => {
    let rejected = false

    return new Promise((resolve, reject) => {
      if (_errored) {
        const err = _errored
        _errored = undefined
        return reject(err)
      }

      if (!stream.writable || stream.closed || stream.destroyed) {
        return reject(new Error("write after end"))
      }

      const writeErrorHandler = err => {
        _errored = undefined
        rejected = true
        reject(err)
      }

      stream.once("error", writeErrorHandler)

      const canWrite = stream.write(chunk)

      stream.removeListener("error", writeErrorHandler)

      if (canWrite) {
        if (!rejected) {
          resolve(chunk.length)
        }
      } else {
        const errorHandler = err => {
          _errored = undefined
          removeListeners()
          reject(err)
        }

        const drainHandler = () => {
          removeListeners()
          resolve(chunk.length)
        }

        const closeHandler = () => {
          removeListeners()
          resolve(chunk.length)
        }

        const finishHandler = () => {
          removeListeners()
          resolve(chunk.length)
        }

        const removeListeners = () => {
          stream.removeListener("close", closeHandler)
          stream.removeListener("drain", drainHandler)
          stream.removeListener("error", errorHandler)
          stream.removeListener("finish", finishHandler)
        }

        stream.on("close", closeHandler)
        stream.on("drain", drainHandler)
        stream.on("error", errorHandler)
        stream.on("finish", finishHandler)
      }
    })
  }

  const end = () => {
    return new Promise((resolve, reject) => {
      if (_errored) {
        const err = _errored
        _errored = undefined
        return reject(err)
      }

      if (!stream.writable || stream.closed || stream.destroyed) {
        return resolve()
      }

      const finishHandler = () => {
        removeListeners()
        resolve()
      }

      const errorHandler = err => {
        _errored = undefined
        removeListeners()
        reject(err)
      }

      const removeListeners = () => {
        stream.removeListener("error", errorHandler)
        stream.removeListener("finish", finishHandler)
      }

      stream.on("finish", finishHandler)
      stream.on("error", errorHandler)

      stream.end()
    })
  }

  return { write, end }
}

export default promiseWriteableStream
