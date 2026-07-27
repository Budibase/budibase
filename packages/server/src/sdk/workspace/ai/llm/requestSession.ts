import { AsyncLocalStorage } from "async_hooks"

const requestSessionStorage = new AsyncLocalStorage<string>()

export const getLiteLLMSessionId = () => requestSessionStorage.getStore()

export const withLiteLLMSessionId = <T>(
  sessionId: string,
  fn: () => T | Promise<T>
): Promise<T> => Promise.resolve(requestSessionStorage.run(sessionId, fn))
