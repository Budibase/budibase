import type { Logger } from "chat"
import env from "../../../environment"

type ChatLogLevel = "debug" | "info" | "warn" | "error"

const formatMessage = (component: string, message: string) =>
  `[${component}] ${message}`

const noop = () => {}

const isChatLoggerEnabled = () => !!env.CHAT_SDK_LOGGER

export const createChatLogger = (component = "chat-sdk"): Logger => {
  if (!isChatLoggerEnabled()) {
    return {
      child: childPrefix => createChatLogger(`${component}:${childPrefix}`),
      debug: noop,
      info: noop,
      warn: noop,
      error: noop,
    }
  }

  const log =
    (level: ChatLogLevel) =>
    (message: string, ...args: unknown[]) => {
      const formatted = formatMessage(component, message)
      if (level === "info") {
        console.log(formatted, ...args)
        return
      }
      console[level](formatted, ...args)
    }

  return {
    child: childPrefix => createChatLogger(`${component}:${childPrefix}`),
    debug: log("debug"),
    info: log("info"),
    warn: log("warn"),
    error: log("error"),
  }
}
