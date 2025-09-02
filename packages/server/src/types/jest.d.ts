declare global {
  namespace jest {
    interface Matchers<R> {
      toSatisfyApiSpec(): R
    }
  }
}

export {}
