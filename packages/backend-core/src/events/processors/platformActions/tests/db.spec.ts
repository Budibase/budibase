import * as dbCore from "../../../../db"
import { structures } from "../../../../../tests"
import * as context from "../../../../context"
import { getActionsDB, getActionsDbName } from "../db"

describe("getActionsDbName", () => {
  it("prefixes a single-tenant prod workspace ID", () => {
    const workspaceId = dbCore.generateWorkspaceID()

    expect(getActionsDbName(workspaceId)).toBe(`actions_${workspaceId}`)
  })

  it("prefixes a multi-tenant prod workspace ID", () => {
    const workspaceId = dbCore.generateWorkspaceID(structures.tenant.id())

    expect(getActionsDbName(workspaceId)).toBe(`actions_${workspaceId}`)
  })

  it("normalizes a dev workspace ID to its prod equivalent", () => {
    const prodWorkspaceId = dbCore.generateWorkspaceID(structures.tenant.id())
    const devWorkspaceId = dbCore.getDevWorkspaceID(prodWorkspaceId)

    expect(getActionsDbName(devWorkspaceId)).toBe(
      getActionsDbName(prodWorkspaceId)
    )
  })

  it("is stable for the same workspace across calls", () => {
    const workspaceId = dbCore.generateWorkspaceID(structures.tenant.id())

    expect(getActionsDbName(workspaceId)).toBe(getActionsDbName(workspaceId))
  })
})

describe("getActionsDB", () => {
  it("resolves the same DB name whether called from prod or dev context", async () => {
    const prodWorkspaceId = dbCore.generateWorkspaceID(structures.tenant.id())
    const devWorkspaceId = dbCore.getDevWorkspaceID(prodWorkspaceId)
    const expectedName = getActionsDbName(prodWorkspaceId)

    const nameFromProd = await context.doInWorkspaceContext(
      prodWorkspaceId,
      async () => getActionsDB().name
    )
    const nameFromDev = await context.doInWorkspaceContext(
      devWorkspaceId,
      async () => getActionsDB().name
    )

    expect(nameFromProd).toBe(expectedName)
    expect(nameFromDev).toBe(expectedName)
  })

  it("throws when there is no workspace in context", async () => {
    expect(() => getActionsDB()).toThrow(
      "Unable to retrieve actions DB - no workspace ID."
    )
  })
})
