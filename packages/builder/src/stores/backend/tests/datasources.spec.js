import { get } from 'svelte/store'
import api from 'builderStore/api'

jest.mock('builderStore/api');

const FETCH_RESPONSE = [
  {
    "type": "datasource",
    "name": "erterter",
    "source": "REST",
    "config": {
      "url": "localhost",
      "defaultHeaders": {}
    },
    "_id": "datasource_04b003a7b4a8428eadd3bb2f7eae0255",
    "_rev": "1-4e72002f1011e9392e655948469b7908"
  }
]

import { createDatasourcesStore } from "../datasources"

describe("Automation Data Object", () => {
  let store = createDatasourcesStore()

  beforeEach(() => {
    api.get.mockReturnValueOnce({ json: () => FETCH_RESPONSE})
    api.delete.mockReturnValueOnce({ json: () => ({status: 200, message: 'Datasource deleted.'})})    
    store.init()
  })

  it("Inits properly", () => {
    const value = get(store)
    expect(value).toEqual({ list: [], selected: null})
  })

  it("Fetch - returns and updates store", async () => {
    let value = get(store)
    expect(value).toEqual({ list: [], selected: null})
    
    await store.fetch()
    value = get(store)
    expect(api.get).toBeCalledWith(`/api/datasources`)
    expect(value).toEqual({ list: FETCH_RESPONSE, selected: null})  
  })
  it("Delete - calls delete endpoint, updates store and returns status", async () => {
    let value = get(store)
    const { _id, _rev } = FETCH_RESPONSE[0]
    await store.fetch()
    await store.delete(FETCH_RESPONSE[0])
    expect(api.delete).toBeCalledWith(`/api/datasources/${_id}/${_rev}`)
    value = await get(store)

    expect(value).toEqual({ list: [], selected: null})  
  })
})