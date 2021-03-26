import { get } from 'svelte/store'
import api from 'builderStore/api'

jest.mock('builderStore/api');

import { createDatasourcesStore } from "../datasources"

describe("Automation Data Object", () => {
  let store = createDatasourcesStore()

  beforeEach(() => {
    store.init()
  })

  it("Inits properly", () => {

    const value = get(store)
    expect(value).toEqual({ list: [], selected: null})
  })

  it("Fetch returns and updates store", async () => {
    api.get.mockReturnValueOnce({ json: () => 'some-cool-value'})

    store.fetch()

    
    
    expect(api.get).toBeCalledWith(`/api/datasources`)
    

    // expect(get(store)).toEqual({ list: [], selected: null})
  })
})
