const workerFarm = require("worker-farm")

const ThreadType = {
  QUERY: "query",
  AUTOMATION: "automation",
}

function typeToFile(type) {
  let filename = null
  switch (type) {
    case ThreadType.QUERY:
      filename = "./query"
      break
    case ThreadType.AUTOMATION:
      filename = "./automation"
      break
    default:
      throw "Unknown thread type"
  }
  return require.resolve(filename)
}

class Thread {
  constructor(type, opts = { timeoutMs: null, count: 1 }) {
    const workerOpts = {
      autoStart: true,
      maxConcurrentWorkers: opts.count ? opts.count : 1,
    }
    if (opts.timeoutMs) {
      workerOpts.maxCallTime = opts.timeoutMs
    }
    this.workers = workerFarm(workerOpts, typeToFile(type))
  }

  run(data) {
    return new Promise((resolve, reject) => {
      this.workers(data, (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    })
  }
}

module.exports.Thread = Thread
module.exports.ThreadType = ThreadType
