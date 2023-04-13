export enum LogLevel {
  TRACE = "trace",
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

const LOG_INDEX: { [key in LogLevel]: number } = {
  [LogLevel.TRACE]: 1,
  [LogLevel.DEBUG]: 2,
  [LogLevel.INFO]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
}

const setIndex = LOG_INDEX[process.env.LOG_LEVEL as LogLevel]

if (setIndex > LOG_INDEX.trace) {
  global.console.trace = jest.fn()
}

if (setIndex > LOG_INDEX.debug) {
  global.console.debug = jest.fn()
}

if (setIndex > LOG_INDEX.info) {
  global.console.info = jest.fn()
  global.console.log = jest.fn()
}

if (setIndex > LOG_INDEX.warn) {
  global.console.warn = jest.fn()
}
