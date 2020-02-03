import {
  setupApphierarchy,
  basicAppHierarchyCreator_WithFields,
} from "./specHelpers"
import { userAuthFile, USERS_LOCK_FILE } from "../src/authApi/authCommon"
import { getLock } from "../src/common/lock"
import { getNewUserAuth } from "../src/authApi/getNewUser"
import { permission } from "../src/authApi/permissions"

describe("getNewUser", () => {
  it("should create correct fields", async () => {
    const { authApi } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user = authApi.getNewUser()
    expect(user.name).toBe("")
    expect(user.accessLevels).toEqual([])
    expect(user.enabled).toBe(true)
    expect(user.temporaryAccessId).toBe("")
  })
})

describe("getNewUser", () => {
  it("should create correct fields", async () => {
    const { app } = await setupApphierarchy(basicAppHierarchyCreator_WithFields)
    const userAuth = getNewUserAuth(app)()
    expect(userAuth.passwordHash).toBe("")
    expect(userAuth.temporaryAccessHash).toEqual("")
    expect(userAuth.temporaryAccessExpiryEpoch).toBe(0)
  })
})

describe("validateUsers", () => {
  it("should not return errors for valid user", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user = validUser(app, authApi)
    const errs = authApi.validateUser([user], user)
    expect(errs).toEqual([])
  })

  it("should have error when username is not set", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user = validUser(app, authApi)
    user.name = ""
    const errs = authApi.validateUser([user], user)
    expect(errs.length).toBe(1)
    expect(errs[0].field).toBe("name")
  })

  it("should have error when duplicate usernames", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user1 = validUser(app, authApi)
    const user2 = validUser(app, authApi)
    const errs = authApi.validateUser([user1, user2], user1)
    expect(errs.length).toBe(1)
    expect(errs[0].field).toBe("name")
  })

  it("should have error when no access levels", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user = validUser(app, authApi)
    user.accessLevels = []
    const errs = authApi.validateUser([user], user)
    expect(errs.length).toBe(1)
    expect(errs[0].field).toBe("accessLevels")
  })
})

describe("create and list users", () => {
  it("should create and load a valid user", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user = validUser(app, authApi)
    await authApi.createUser(user)
    const users = await authApi.getUsers()
    expect(users.length).toBe(1)
    expect(users[0].name).toBe(user.name)
  })

  it("should not save an invalid user", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user = validUser(app, authApi)
    user.name = ""
    let e
    try {
      await authApi.createUser(user)
    } catch (ex) {
      e = ex
    }
    expect(e).toBeDefined()
    const users = await authApi.getUsers()
    expect(users.length).toBe(0)
  })

  it("should not save when users file is locked", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user = validUser(app, authApi)
    await getLock(app, USERS_LOCK_FILE, 10000, 0, 0)
    let e
    try {
      await authApi.createUser(user)
    } catch (ex) {
      e = ex
    }
    expect(e).toBeDefined()
    const users = await authApi.getUsers()
    expect(users.length).toBe(0)
  })

  it("should create temporary access when no password supplied", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user = validUser(app, authApi)
    const returnedUser = await authApi.createUser(user)
    expect(returnedUser.tempCode.length).toBeGreaterThan(0)
    expect(returnedUser.temporaryAccessId.length).toBeGreaterThan(0)
  })

  it("should not store tempCode when temp access created", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user = validUser(app, authApi)
    await authApi.createUser(user)
    const storedUser = (await authApi.getUsers())[0]
    expect(storedUser.tempCode).toBeUndefined()
  })

  it("should create user auth file with password hash, when password supplied", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user = validUser(app, authApi)
    const returnedUser = await authApi.createUser(user, "password")
    expect(returnedUser.tempCode).toBeUndefined()
    expect(returnedUser.temporaryAccessId).toBeUndefined()

    const userAuth = await app.datastore.loadJson(userAuthFile(user.name))
    expect(userAuth.passwordHash.length).toBeGreaterThan(0)
  })

  it("should not create user when user with same name already exists", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user = validUser(app, authApi)
    await authApi.createUser(user)

    let e
    try {
      await authApi.createUser(user)
    } catch (ex) {
      e = ex
    }
    expect(e).toBeDefined()
    const users = await authApi.getUsers()
    expect(users.length).toBe(1)
  })

  it("create should throw error when user user does not have permission", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user = validUser(app, authApi)
    app.removePermission(permission.createUser.get())
    expect(authApi.createUser(user)).rejects.toThrow(/Unauthorized/)
  })

  it("create should not depend on having any other permissions", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    const user = validUser(app, authApi)
    app.withOnlyThisPermission(permission.createUser.get())
    await authApi.createUser(user)
  })

  it("list should throw error when user user does not have permission", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    app.removePermission(permission.listUsers.get())
    expect(authApi.getUsers()).rejects.toThrow(/Unauthorized/)
  })

  it("list should not depend on having any other permissions", async () => {
    const { authApi, app } = await setupApphierarchy(
      basicAppHierarchyCreator_WithFields
    )
    app.withOnlyThisPermission(permission.listUsers.get())
    await authApi.getUsers()
  })
})

const validUser = (app, authApi) => {
  const u = authApi.getNewUser(app)
  u.name = "bob"
  u.accessLevels = ["admin"]
  u.enabled = true
  return u
}
