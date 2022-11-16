const mockFetch = jest.fn()
jest.mock("node-fetch", () => mockFetch)

export default mockFetch
