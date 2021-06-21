import { get } from 'svelte/store'
import api from 'builderStore/api'

jest.mock('builderStore/api');

import { SOME_QUERY, SAVE_QUERY_RESPONSE } from './fixtures/queries'

import { createQueriesStore } from "../queries"
import { datasources } from '../datasources'

describe("Queries Store", () => {
  let store = createQueriesStore()

  beforeEach(async () => {
    api.get.mockReturnValue({ json: () => [SOME_QUERY]})
    await store.init()
  })

  it("Initialises correctly", async () => {
    api.get.mockReturnValue({ json: () => [SOME_QUERY]})
  
    await store.init()
    expect(get(store)).toEqual({ list: [SOME_QUERY], selected: null})
  })

  it("fetches all the queries", async () => {
    api.get.mockReturnValue({ json: () => [SOME_QUERY]})

    await store.fetch()
    expect(get(store)).toEqual({ list: [SOME_QUERY], selected: null})  
  })

  it("saves the query, updates the store and returns status message", async () => {
    api.post.mockReturnValue({ json: () => SAVE_QUERY_RESPONSE})    

    await store.select(SOME_QUERY.datasourceId, SOME_QUERY)

    expect(get(store).list).toEqual(expect.arrayContaining([SOME_QUERY]))
  })
  it("deletes a query, updates the store and returns status message", async () => {
    
    api.delete.mockReturnValue({status: 200, message: `Query deleted.`})  
    
    await store.delete(SOME_QUERY)
    expect(get(store)).toEqual({ list: [], selected: null})  
  })
})