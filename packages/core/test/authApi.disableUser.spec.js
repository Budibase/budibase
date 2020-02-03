import {
  setupApphierarchy,
  validUser,
  basicAppHierarchyCreator_WithFields,
} from "./specHelpers"
import {
  parseTemporaryCode,
  USERS_LOCK_FILE,
  USERS_LIST_FILE,
  getUserByName,
} from "../src/authApi/authCommon"
import { $ } from "../src/common"
import { getLock } from "../src/common/lock"
import { permission } from "../src/authApi/permissions"

describe("authApi > enableUser", () => {
  it("should enable a user when disabled", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const u = await validUser(app, authApi, "firstpassword", false)
    await authApi.enableUser(u.name)
    const loadedUser = await getUser(app, authApi, u.name)
    expect(loadedUser.enabled).toBe(true)
  })

  it("should do nothing when user already enabled", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const u = await validUser(app, authApi, "firstpassword", true)
    await authApi.enableUser(u.name)
    const loadedUser = await getUser(app, authApi, u.name)
    expect(loadedUser.enabled).toBe(true)
  })

  it("should throw en error when user does not exist", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const u = await validUser(app, authApi, "firstpassword", false)
    let ex
    try {
      await authApi.enableUser("nobody")
    } catch (e) {
      ex = e
    }
    expect(ex).toBeDefined()
  })

  it("should throw en error when users file is locked", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const u = await validUser(app, authApi, "firstpassword", false)
    await getLock(app, USERS_LOCK_FILE, 10000, 0, 0)
    let ex
    try {
      await authApi.enableUser(u.name)
    } catch (e) {
      ex = e
    }
    expect(ex).toBeDefined()
  })

  it("should throw error when user user does not have permission", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const u = await validUser(app, authApi, "firstpassword", false)
    app.removePermission(permission.enableDisableUser.get())
    expect(authApi.enableUser(u)).rejects.toThrow(/Unauthorized/)
  })

  it("should not depend on having any other permissions", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const u = await validUser(app, authApi, "firstpassword", false)
    app.withOnlyThisPermission(permission.enableDisableUser.get())
    await authApi.enableUser(u.name)
  })
})

describe("authApi > disableUser", () => {
  it("should disable a user when enabled", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const u = await validUser(app, authApi, "firstpassword", true)
    await authApi.disableUser(u.name)
    const loadedUser = await getUser(app, authApi, u.name)
    expect(loadedUser.enabled).toBe(false)
  })

  it("should do nothing when user already enabled", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const u = await validUser(app, authApi, "firstpassword", false)
    await authApi.disableUser(u.name)
    const loadedUser = await getUser(app, authApi, u.name)
    expect(loadedUser.enabled).toBe(false)
  })

  it("should throw en error when user does not exist", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const u = await validUser(app, authApi, "firstpassword", false)
    let ex
    try {
      await authApi.disableUser("nobody")
    } catch (e) {
      ex = e
    }
    expect(ex).toBeDefined()
  })

  it("should throw en error when users file is locked", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const u = await validUser(app, authApi, "firstpassword", false)
    await getLock(app, USERS_LOCK_FILE, 10000, 0, 0)
    let ex
    try {
      await authApi.disableUser(u.name)
    } catch (e) {
      ex = e
    }
    expect(ex).toBeDefined()
  })

  it("should throw error when user user does not have permission", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const u = await validUser(app, authApi, "firstpassword", false)
    app.removePermission(permission.enableDisableUser.get())
    expect(authApi.disableUser(u)).rejects.toThrow(/Unauthorized/)
  })

  it("should not depend on having any other permissions", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const u = await validUser(app, authApi, "firstpassword", false)
    app.withOnlyThisPermission(permission.enableDisableUser.get())
    await authApi.disableUser(u.name)
  })
})

const getUser = async (app, authApi, userName) =>
  $(await app.datastore.loadJson(USERS_LIST_FILE), [
    users => getUserByName(users, userName),
  ])
