import workerFarm, { Workers, FarmOptions } from "worker-farm"
import env from "../environment"
import { AutomationJob } from "@budibase/types"
import { QueryEvent } from "./definitions"

export enum ThreadType {
  QUERY = "query",
  AUTOMATION = "automation",
}

function typeToFile(type: ThreadType) {
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
  type: ThreadType
  count: number
  workers?: Workers
  timeoutMs?: number
  disableThreading: boolean

  static workerRefs: workerFarm.Workers[] = []

  constructor(
    type: ThreadType,
    opts: { count?: number; timeoutMs?: number | null } = {
      timeoutMs: null,
      count: 1,
    }
  ) {
    this.type = type
    this.count = opts.count ? opts.count : 1
    this.disableThreading = this.shouldDisableThreading()
    if (!this.disableThreading) {
      console.log(
        `[${env.FORKED_PROCESS_NAME}] initialising worker farm type=${type}`
      )
      const workerOpts: FarmOptions = {
        autoStart: true,
        maxConcurrentWorkers: this.count,
        workerOptions: {
          env: {
            ...process.env,
            FORKED_PROCESS: "1",
            FORKED_PROCESS_NAME: type,
          },
          execArgv: process.execArgv.some(arg =>
            arg.startsWith("--enable-source-maps")
          )
            ? ["--enable-source-maps"]
            : undefined,
        },
      }
      if (opts.timeoutMs) {
        this.timeoutMs = opts.timeoutMs
        workerOpts.maxCallTime = opts.timeoutMs
      }

      this.workers = workerFarm(workerOpts, typeToFile(type), ["execute"])
      Thread.workerRefs.push(this.workers)
    } else {
      console.log(
        `[${env.FORKED_PROCESS_NAME}] skipping worker farm type=${type}`
      )
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

  run<T>(job: AutomationJob | QueryEvent): Promise<T> {
    const timeout = this.timeoutMs
    return new Promise((resolve, reject) => {
      function fire(worker: any) {
        worker.execute(job, (err: any, response: T) => {
          if (err && err.type === "TimeoutError") {
            reject(new Error(`Thread timeout exceeded ${timeout}ms timeout.`))
          } else if (err) {
            reject(err)
          } else {
            resolve(response)
          }
        })
      }
      // if in test then don't use threading
      if (this.disableThreading) {
        import(typeToFile(this.type)).then(thread => {
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
