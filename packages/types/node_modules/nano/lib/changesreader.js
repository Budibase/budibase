const EventEmitter = require('events').EventEmitter
const AbortController = global.AbortController || require('node-abort-controller').AbortController
const stream = require('stream')
const EVENT_BATCH = 'batch'
const EVENT_CHANGE = 'change'
const EVENT_SEQ = 'seq'
const EVENT_ERROR = 'error'

// streaming line breaker
const liner = () => {
  const liner = new stream.Transform({ objectMode: true })

  liner._transform = function (chunk, encoding, done) {
    let data = chunk.toString('utf8')
    if (this._lastLineData) {
      data = this._lastLineData + data
      this._lastLineData = null
    }

    const lines = data.split(/\s*\n/)
    this._lastLineData = lines.splice(lines.length - 1, 1)[0]
    lines.forEach(this.push.bind(this))
    done()
  }

  liner._flush = function (done) {
    this.push(this._lastLineData)
    this._lastLineData = null
    done()
  }

  return liner
}

// streaming change processor
const changeProcessor = (ee, batchSize) => {
  const changeProcessor = new stream.Transform({ objectMode: true })
  const buffer = []
  changeProcessor.lastSeq = '0'

  changeProcessor._transform = function (chunk, encoding, done) {
    // remove last char from string
    if (chunk[chunk.length - 1] === ',') {
      chunk = chunk.slice(0, -1)
    }

    try {
      const j = JSON.parse(chunk)
      buffer.push(j)
      if (buffer.length >= batchSize) {
        ee.emit(EVENT_BATCH, buffer.splice(0, batchSize))
      }
      done()
    } catch (e) {
      // look for last_seq
      const match = chunk.match(/"last_seq":(.+?)[},]/)
      if (match) {
        changeProcessor.lastSeq = JSON.parse(match[1])
      }
      done()
    }
  }

  changeProcessor._flush = function (done) {
    if (buffer.length > 0) {
      ee.emit(EVENT_BATCH, buffer.splice(0, buffer.length))
    }
    done()
  }

  return changeProcessor
}

/**
 * Monitors the changes feed (after calling .start()/.get()) and emits events
 *  - EVENT_CHANGE - per change
 *  - EVENT_BATCH - per batch of changes
 *  - EVENT_SEQ - per change of sequence number
 *  - EVENT_ERROR - per 4xx error (except 429)
 *
 * @param {String} db - Name of the database.
 * @param {Function} request - Nano.relax
 */
class ChangesReader {
  // constructor
  constructor (db, request) {
    this.db = db
    this.setDefaults()
    this.request = request
  }

  // set defaults
  setDefaults () {
    this.ee = new EventEmitter()
    this.batchSize = 100
    this.fastChanges = false
    this.since = 'now'
    this.includeDocs = false
    this.timeout = 60000
    this.started = false
    this.wait = false
    this.stopOnEmptyChanges = false // whether to stop polling if we get an empty set of changes back
    this.continue = true // whether to poll again
    this.qs = {} // extra querystring parameters
    this.selector = null
    this.paused = false
    this.abortController = null
  }

  pause () {
    this.paused = true
  }

  resume () {
    this.paused = false
  }

  // prevent another poll happening
  stop () {
    this.continue = false
    if (this.abortController) {
      this.abortController.abort()
    }
  }

  // sleep, promise style
  async sleep (t) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, t)
    })
  }

  // called to start listening to the changes feed. The opts object can contain:
  // - batchSize - the number of records to return per HTTP request
  // - since - the the sequence token to start from (defaults to 'now')
  start (opts) {
    const self = this

    // if we're already listening for changes
    if (self.started) {
      // return the existing event emitter
      return self.ee
    }
    self.started = true

    // handle overidden defaults
    opts = opts || {}
    Object.assign(self, opts)

    // the work function is async and runs in the background
    // with a big do/while loop
    let delay = 0
    const work = async () => {
      do {
        if (!self.paused) {
          self.abortController = new AbortController()
          // formulate changes feed longpoll HTTP request
          const req = {
            method: 'post',
            db: self.db,
            path: '_changes',
            signal: self.abortController.signal,
            qs: {
              feed: 'longpoll',
              timeout: self.timeout,
              since: self.since,
              limit: self.batchSize,
              include_docs: self.includeDocs
            },
            body: {}
          }
          if (self.fastChanges) {
            req.qs.seq_interval = self.batchSize
          }
          if (self.selector) {
            req.qs.filter = '_selector'
            req.body.selector = self.selector
          }
          Object.assign(req.qs, opts.qs)

          // make HTTP request to get up to batchSize changes from the feed
          try {
            const data = await self.request(req)
            self.abortController = null
            delay = 0

            // update the since state
            if (data && data.last_seq && data.last_seq !== self.since) {
              self.since = data.last_seq
              self.ee.emit(EVENT_SEQ, self.since)
            }

            // stop on empty batch
            if (self.stopOnEmptyChanges && data && typeof data.results !== 'undefined' && data.results.length === 0) {
              self.continue = false
            }

            // if we have data
            if (data && data.results && data.results.length > 0) {
              // emit EVENT_CHANGE events
              for (const i in data.results) {
                self.ee.emit(EVENT_CHANGE, data.results[i])
              }

              // in 'wait' mode, we need to wait until the user calls .resume()
              if (self.wait) {
                // so call pause() to prevent further API calls until .resume() is called
                self.pause()
              }

              // emit EVENT_BATCH event
              self.ee.emit(EVENT_BATCH, data.results)
            }
          } catch (err) {
            // error (wrong password, bad since value etc)
            // if the error is fatal
            if (err && err.statusCode && err.statusCode >= 400 && err.statusCode !== 429 && err.statusCode < 500) {
              self.continue = false
            } else {
              // don't immediately retry on error - exponential back-off
              delay = delay ? Math.min(60000, delay * 2) : 5000 // up to and no more than one minute
            }

            self.ee.emit(EVENT_ERROR, err)
          }
        }

        // if in pause mode, wait 100ms before checking again
        if (self.paused && delay === 0) {
          delay = 100
        }

        // delay before next request?
        if (self.continue && delay > 0) {
          await self.sleep(delay)
        }
      } while (self.continue)

      // reset
      self.ee.emit('end', self.since)
      self.setDefaults()
    }
    work()

    // return the event emitter to the caller
    return self.ee
  }

  // called to start listening to the changes feed for a finite number of changes. The opts object can contain:
  // - batchSize - the number of records to return per HTTP request
  // - since - the sequence token to start from (defaults to 'now')
  get (opts) {
    this.stopOnEmptyChanges = true
    return this.start(opts)
  }

  // called to spool through changes to "now" in one long HTTP request
  spool (opts) {
    const self = this
    self.setDefaults()
    opts = opts || {}
    Object.assign(self, opts)
    const req = {
      method: 'post',
      db: self.db,
      path: '_changes',
      qs: {
        since: self.since,
        include_docs: self.includeDocs,
        seq_interval: self.batchSize
      },
      stream: true,
      body: {}
    }
    if (self.selector) {
      req.qs.filter = '_selector'
      req.body.selector = self.selector
    }
    const lin = liner()
    const cp = changeProcessor(self.ee, self.batchSize)
    self.request(req)
      .pipe(lin)
      .pipe(cp)
      .on('finish', (lastSeq) => {
        // the 'end' event was triggering before the last data event
        setTimeout(() => {
          self.ee.emit('end', cp.lastSeq)
        }, 10)
      })
      .on(EVENT_ERROR, (e) => {
        self.ee.emit(EVENT_ERROR, e)
      })

    return self.ee
  }
}

module.exports = ChangesReader
