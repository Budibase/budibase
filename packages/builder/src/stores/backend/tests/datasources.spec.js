import { get } from 'svelte/store'
import api from 'builderStore/api'

jest.mock('builderStore/api');

const SOME_DATASOURCE = [
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

const SAVE_DATASOURCE = {
    "type": "datasource",
    "name": "CoolDB",
    "source": "REST",
    "config": {
      "url": "localhost",
      "defaultHeaders": {}
    },
    "_id": "datasource_04b003a7b4a8428eadd3bb2f7eae0255",
    "_rev": "1-4e72002f1011e9392e655948469b7908"
  }

import { createDatasourcesStore } from "../datasources"
import { queries } from '../queries'

describe("Datasources Store", () => {
  let store = createDatasourcesStore()

  beforeEach(() => {
    api.get.mockReturnValueOnce({ json: () => SOME_DATASOURCE})
    store.init()
  })

  it("Inits properly", () => {
    const value = get(store)
    expect(value).toEqual({ list: [], selected: null})
  })

  it("fetches all the datasources and updates the store", async () => {

    await store.fetch()
    const value = get(store)
    expect(value).toEqual({ list: SOME_DATASOURCE, selected: null})  
  })

  it("selects a datasource", async () => {
    store.select(SOME_DATASOURCE._id)
    
    const value = get(store)
    expect(value.select).toEqual(SOME_DATASOURCE._id)  
  })

  it("resets the queries store when it a new datasource is selected", async () => {
    
    store.select(SOME_DATASOURCE._id)
    const queriesValue = get(queries)
    expect(queriesValue.selected).toEqual(null)  
  })

  it("saves the datasource, updates the store and returns status message", async () => {
    api.post.mockReturnValueOnce({ json: () => SAVE_DATASOURCE})    

    await store.save({
      name: 'CoolDB',
      source: 'REST',
      config: SOME_DATASOURCE[0].config

    })
    const value = await get(store)

    expect(value.list).toEqual(expect.arrayContaining([SAVE_DATASOURCE]))
  })
  it("deletes a datasource, updates the store and returns status message", async () => {
    api.delete.mockReturnValueOnce({status: 200, message: 'Datasource deleted.'})    

    await store.fetch()
    await store.delete(SOME_DATASOURCE[0])
    const value = await get(store)
    
    expect(value).toEqual({ list: [], selected: null})  
  })
})