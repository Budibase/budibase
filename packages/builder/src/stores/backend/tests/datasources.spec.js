import { get } from 'svelte/store'
import { createDatasourcesStore } from "../datasources"

const mockApi = {
  post: () => ({}),
  get: () => ({}),
  patch: () => ({}),
  delete: () => ({}),
  put: () => ({}),
}


describe("Automation Data Object", () => {
  let store

  beforeEach(() => {
    store = createDatasourcesStore(mockApi)
  })

  it("Inits properly", () => {
    const value = get(store)
    expect(value).toBe(true)
  })
})
