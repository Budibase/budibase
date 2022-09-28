import workerFarm from "worker-farm"
import * as env from "../environment"

export const ThreadType = {
  QUERY: "query",
  AUTOMATION: "automation",
}

function typeToFile(type: any) {
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
  // have to use require here, to make it work with worker-farm
  return require.resolve(filename)
}

export class Thread {
  type: any
  count: any
  workers: any
  timeoutMs: any
  disableThreading: boolean

  static workerRefs: any[] = []

  constructor(type: any, opts: any = { timeoutMs: null, count: 1 }) {
    this.type = type
    this.count = opts.count ? opts.count : 1
    this.disableThreading = this.shouldDisableThreading()
    if (!this.disableThreading) {
      const workerOpts: any = {
        autoStart: true,
        maxConcurrentWorkers: this.count,
      }
      if (opts.timeoutMs) {
        this.timeoutMs = opts.timeoutMs
        workerOpts.maxCallTime = opts.timeoutMs
      }
      this.workers = workerFarm(workerOpts, typeToFile(type), ["execute"])
      Thread.workerRefs.push(this.workers)
    }
  }

  shouldDisableThreading(): boolean {
    return !!(
      env.isTest() ||
      env.DISABLE_THREADING ||
      this.count === 0 ||
      env.isInThread()
    )
  }

  run(data: any) {
    const timeout = this.timeoutMs
    return new Promise((resolve, reject) => {
      function fire(worker: any) {
        worker.execute(data, (err: any, response: any) => {
          if (err && err.type === "TimeoutError") {
            reject(
              new Error(`Query response time exceeded ${timeout}ms timeout.`)
            )
          } else if (err) {
            reject(err)
          } else {
            resolve(response)
          }
        })
      }
      // if in test then don't use threading
      if (this.disableThreading) {
        import(typeToFile(this.type)).then((thread: any) => {
          fire(thread)
        })
      } else {
        fire(this.workers)
      }
    })
  }

  static stopThreads() {
    return new Promise<void>(resolve => {
      if (Thread.workerRefs.length === 0) {
        resolve()
      }
      let count = 0
      function complete() {
        count++
        if (count >= Thread.workerRefs.length) {
          resolve()
        }
      }
      for (let worker of Thread.workerRefs) {
        workerFarm.end(worker, complete)
      }
      Thread.workerRefs = []
    })
  }

  static async shutdown() {
    await Thread.stopThreads()
    console.log("Threads shutdown")
  }
}
