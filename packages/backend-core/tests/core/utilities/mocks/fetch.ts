const mockFetch = jest.fn((url: any, opts: any) => {
  const fetch = jest.requireActual("node-fetch")
  const env = jest.requireActual("../../../../src/environment").default
  if (url.includes(env.COUCH_DB_URL)) {
    return fetch(url, opts)
  }
  return undefined
})

const enable = () => {
  jest.mock("node-fetch", () => mockFetch)
}

export default {
  ...mockFetch,
  enable,
}
