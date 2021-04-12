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
    api.get.mockReturnValueOnce({ json: () => ROLES})
    await store.fetch()
    
    api.delete.mockReturnValue({status: 200, message: `Role deleted.`})
    
    const updatedRoles = [...ROLES.slice(1)]
    await store.delete(ROLES[0])

    expect(get(store)).toEqual(updatedRoles)
  })
})