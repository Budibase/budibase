import { get } from 'svelte/store'
import api from 'builderStore/api'

jest.mock('builderStore/api');

import { SOME_TABLES } from './fixtures/tables'

import { createViewsStore } from "../views"

describe("Tables Store", () => {
  let store = createViewsStore()

  beforeEach(async () => {
    api.get.mockReturnValue({ json: () => SOME_TABLES})
    await store.init()
  })

  it("Initialises correctly", async () => {
    expect(get(store)).toEqual({ list: SOME_TABLES, selected: {}, draft: {}})
  })
})