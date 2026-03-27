export type JobId = string | number

export interface BackoffOptions {
  type?: string
  delay?: number
}

export type Backoff = number | BackoffOptions

export interface RepeatOptions {
  cron?: string
  every?: number
  tz?: string
  endDate?: string | number | Date
}

export interface JobOptions {
  attempts?: number
  backoff?: Backoff
  delay?: number
  jobId?: JobId
  lifo?: boolean
  preventParsingData?: boolean
  priority?: number
  removeOnComplete?: boolean | number
  removeOnFail?: boolean | number
  repeat?: RepeatOptions
  stackTraceLimit?: number
  timeout?: number
}

export interface QueueSettings {
  maxStalledCount?: number
  lockDuration?: number
  lockRenewTime?: number
}

export interface QueueOptions {
  redis?: Record<string, any>
  settings?: QueueSettings
  defaultJobOptions?: JobOptions
  manualRepeatableJobs?: boolean
}

export interface JobInformation {
  id: string
  name: string
  key: string
  tz?: string
  endDate?: number
  cron?: string
  every?: number
  next: number
}

export type DoneCallback = (err?: Error | null, result?: any) => void

export interface Job<T = any> {
  id: JobId
  name?: string
  timestamp: number
  queue: Queue<T>
  data: T
  opts: JobOptions
  attemptsMade: number
  failedReason?: string
  discard: () => Promise<void>
  finished: () => Promise<any>
  remove: () => Promise<void>
}

export interface Queue<T = any> {
  name: string
  process(
    callback: (job: Job<T>, done?: DoneCallback) => Promise<void>
  ): Promise<void>
  process(
    concurrency: number,
    callback: (job: Job<T>, done?: DoneCallback) => Promise<void>
  ): Promise<void>
  add(data: T, opts?: JobOptions): Promise<Job<T>>
  close(doNotWaitJobs?: boolean): Promise<void>
  whenCurrentJobsFinished(): Promise<void>
  clean(grace: number, status: string): Promise<any[]>
  getJob(id: JobId): Promise<Job<T> | null>
  removeRepeatableByKey(id: string): Promise<void>
  removeJobs(pattern: string): Promise<void>
  getRepeatableJobs(): Promise<JobInformation[]>
  getWaiting(start?: number, end?: number): Promise<Job<T>[]>
  on(event: string, callback: (...args: any[]) => void): Queue<T>
  off(event: string, callback: (...args: any[]) => void): Queue<T>
  count(): Promise<number>
  getCompletedCount(): Promise<number>
  isReady(): Promise<any>
  pause(): Promise<void>
  resume(): Promise<void>
}
