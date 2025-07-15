import { BudibaseError } from "./BudibaseError"

// Custom Jest matchers for better error reporting
expect.extend({
  async toBudibaseSucceed(received: Promise<any>) {
    try {
      await received
      return {
        pass: true,
        message: () => "Expected Budibase API call to fail, but it succeeded",
      }
    } catch (error) {
      if (error instanceof BudibaseError) {
        return {
          pass: false,
          message: () => error.message,
        }
      }
      
      return {
        pass: false,
        message: () => `Expected Budibase API call to succeed, but got error: ${error}`,
      }
    }
  },
})

// TypeScript declaration for the custom matcher
declare global {
  namespace jest {
    interface Matchers<R> {
      toBudibaseSucceed(): Promise<R>
    }
  }
}