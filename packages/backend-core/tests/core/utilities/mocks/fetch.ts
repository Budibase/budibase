const mockFetch = jest.fn()

const enable = () => {
  jest.mock("node-fetch", () => mockFetch)
}

export default {
  ...mockFetch,
  enable,
}
