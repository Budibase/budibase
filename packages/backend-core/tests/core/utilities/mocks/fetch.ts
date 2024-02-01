import { vi } from "vitest"

const mockFetch = vi.fn(async (url: any, opts: any) => {
  const fetch = await vi.importActual("node-fetch")
  const env = (await vi.importActual("../../../../src/environment")).default
  // @ts-ignore
  if (url.includes(env.COUCH_DB_URL) || url.includes("raw.github")) {
    // @ts-ignore
    return fetch(url, opts)
  }
  return undefined
})

const enable = () => {
  vi.mock("node-fetch", () => mockFetch)
}

export default {
  ...mockFetch,
  enable,
}
