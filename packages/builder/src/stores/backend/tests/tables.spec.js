import { get } from 'svelte/store'
import api from 'builderStore/api'

jest.mock('builderStore/api');

import { SOME_TABLES, SAVE_TABLES_RESPONSE, A_TABLE } from './fixtures/tables'

import { createTablesStore } from "../tables"
import { views } from '../views'

describe("Tables Store", () => {
  let store = createTablesStore()

  beforeEach(async () => {
    api.get.mockReturnValue({ json: () => SOME_TABLES})
    await store.init()
  })

  it("Initialises correctly", async () => {
    expect(get(store)).toEqual({ list: SOME_TABLES, selected: {}, draft: {}})
  })

  it("fetches all the tables", async () => {
    api.get.mockReturnValue({ json: () => SOME_TABLES})

    await store.fetch()
    expect(get(store)).toEqual({ list: SOME_TABLES, selected: {}, draft: {}})  
  })

  it("selects a table", async () => {
    const tableToSelect = SOME_TABLES[0]
    await store.select(tableToSelect)
  
    expect(get(store).selected).toEqual(tableToSelect) 
    expect(get(store).draft).toEqual(tableToSelect) 
  })

  it("selecting without a param resets the selected property", async () => {
    await store.select()
  
    expect(get(store).draft).toEqual({}) 
  })

  it("selecting a table updates the view store", async () => {
    const tableToSelect = SOME_TABLES[0]
    await store.select(tableToSelect)
  
    expect(get(store).selected).toEqual(tableToSelect) 
    expect(get(views).selected).toEqual({ name: `all_${tableToSelect._id}` })
  })

  it("saving a table also selects it", async () => {
    api.post.mockReturnValue({ json: () => SAVE_TABLES_RESPONSE})    

    await store.save(A_TABLE)

    expect(get(store).selected).toEqual(SAVE_TABLES_RESPONSE) 
  })

  it("saving the table returns a response", async () => {
    api.post.mockReturnValue({ json: () => SAVE_TABLES_RESPONSE})    

    const response = await store.save(A_TABLE)

    expect(response).toEqual(SAVE_TABLES_RESPONSE) 
  })
  it("deleting a table removes it from the store", async () => {
    api.delete.mockReturnValue({status: 200, message: `Table deleted.`})  
    
    await store.delete(A_TABLE)
    expect(get(store).list).toEqual(expect.not.arrayContaining([A_TABLE]))  
  })

  // TODO: Write tests for saving and deleting fields
})