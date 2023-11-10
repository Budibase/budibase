import { Response } from "node-fetch"

// boilerplate to allow TS updates to the global scope
export {}

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveStatusCode(code: number): R
    }
  }
}

// Expect extensions
expect.extend({
  toHaveStatusCode(received: Response, code: number) {
    const pass = received.status === code
    return {
      message: () => `expected ${received.status} to match status code ${code}`,
      pass,
    }
  },
})
