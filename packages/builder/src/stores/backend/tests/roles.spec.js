import { get } from 'svelte/store'
import api from 'builderStore/api'

jest.mock('builderStore/api');

import { createRolesStore } from "../roles"
import { ROLES } from './fixtures/roles'

describe("Roles Store", () => {
  let store = createRolesStore()

  beforeEach( async() => {
    store = createRolesStore()
  })

  it("fetches roles from backend", async () => {
    api.get.mockReturnValue({ json: () => ROLES})
    await store.fetch()

    expect(api.get).toBeCalledWith("/api/roles")
    expect(get(store)).toEqual(ROLES)
  })

  it("deletes a role", async () => {
    api.get.mockReturnValue({ json: () => ROLES})
    await store.fetch()

    const {_id, _rev} = ROLES[0]
    api.delete.mockReturnValue({status: 200, message: `Role deleted.`})
    await store.delete(`/api/roles/${_id}/${_rev}`)

    expect(get(store)).toEqual(ROLES)
  })
})