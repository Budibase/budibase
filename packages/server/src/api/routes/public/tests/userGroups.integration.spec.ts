import type { Server } from "http"
import { cache, context, events, sessions, users } from "@budibase/backend-core"
import { mocks, structures } from "@budibase/backend-core/tests"
import { constants, db as proDb } from "@budibase/pro"
import { Feature, type User } from "@budibase/types"
import environment from "../../../../environment"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    events: { ...core.events, processors: { ...core.events.processors } },
  }
})

describe("public user memberships through the worker", () => {
  const config = new TestConfiguration()
  const originalWorkerUrl = environment.WORKER_URL
  let worker: Server
  let admin: User

  beforeAll(async () => {
    const workerEnvironment: {
      default: { PORT: string }
    } = require("@budibase/worker/src/environment")
    workerEnvironment.default.PORT = "0"
    const initializeProcessors = events.processors.init
    const initializeProcessorsSpy = jest.spyOn(events.processors, "init")
    // Event processors are the final step of worker startup.
    const processorsInitialized = new Promise<void>(resolve => {
      initializeProcessorsSpy.mockImplementationOnce((...args) => {
        const initialized = initializeProcessors(...args)
        resolve(initialized)
        return initialized
      })
    })
    const workerModule: {
      default: Server
    } = require("@budibase/worker/src/index")
    worker = workerModule.default
    try {
      await processorsInitialized
    } finally {
      initializeProcessorsSpy.mockRestore()
    }
    const address = worker.address()
    if (!address || typeof address === "string") {
      throw new Error("Worker did not bind to a TCP port")
    }
    environment.WORKER_URL = `http://127.0.0.1:${address.port}`
    await config.init()
  })

  afterAll(async () => {
    environment.WORKER_URL = originalWorkerUrl
    config.end()
    await new Promise<void>((resolve, reject) => {
      worker.close(error => (error ? reject(error) : resolve()))
    })
  })

  beforeEach(async () => {
    mocks.licenses.useUnlimited({
      features: [Feature.EXPANDED_PUBLIC_API, Feature.USER_GROUPS],
    })
    admin = await config.globalUser({
      admin: { global: true },
      builder: { global: true },
    })
    config.user = admin
  })

  it("persists creation, replacement, omission, and removal across both services", async () => {
    const first = await config.createGroup()
    const second = await config.createGroup()
    const created = await config.api.public.user.create({
      email: structures.email(),
      password: "password123!",
      roles: {},
      userGroups: [first._id!],
    })
    const retrieved = await config.api.public.user.find(created._id!)
    const replaced = await config.api.public.user.update({
      ...retrieved,
      userGroups: [second._id!],
    })
    const { userGroups: _userGroups, ...withoutMemberships } = replaced
    const preserved = await config.api.public.user.update({
      ...withoutMemberships,
      firstName: "Updated",
    })
    await config.api.public.user.update({ ...preserved, userGroups: [] })
    const saved = await config.doInTenant(() => users.getById(created._id!))

    expect(retrieved.userGroups).toEqual([first._id])
    expect(replaced.userGroups).toEqual([second._id])
    expect(preserved.userGroups).toEqual([second._id])
    expect(saved).toMatchObject({ firstName: "Updated", userGroups: [] })
  })

  it("revokes cached group permissions after public API removal", async () => {
    const group = await config.createGroup()
    const user = await config.api.public.user.create({
      email: structures.email(),
      password: "password123!",
      roles: {},
      userGroups: [group._id!],
    })
    await sessions.createASession(user._id!, {
      sessionId: config.sessionIdForUser(user._id!),
      tenantId: config.getTenantId(),
      csrfToken: config.csrfToken,
      email: user.email,
    })
    const visibleBefore = await config.withUser(user, () =>
      config.api.workspace.fetch()
    )
    await config.api.public.user.update({ ...user, userGroups: [] })
    const visibleAfter = await config.withUser(user, () =>
      config.api.workspace.fetch()
    )
    const refreshed = await config.doInTenant(() =>
      cache.user.getUser({ userId: user._id! })
    )

    expect(visibleBefore.map(app => app.appId)).toContain(
      config.getProdWorkspaceId()
    )
    expect(visibleAfter).toEqual([])
    expect(refreshed.roles[config.getProdWorkspaceId()]).toBeUndefined()
    expect(refreshed.userGroups).toEqual([])
  })

  it.each([
    { name: "cloud free", license: constants.licenses.CLOUD_FREE_LICENSE },
    { name: "self-hosted free", license: constants.licenses.SELF_FREE_LICENSE },
    {
      name: "groups only",
      license: {
        ...constants.licenses.UNLIMITED_LICENSE,
        features: [Feature.USER_GROUPS],
      },
    },
    {
      name: "expanded API only",
      license: {
        ...constants.licenses.UNLIMITED_LICENSE,
        features: [Feature.EXPANDED_PUBLIC_API],
      },
    },
  ])(
    "allows unchanged memberships but blocks membership changes with a $name license",
    async ({ license }) => {
      const group = await config.createGroup()
      const replacement = await config.createGroup()
      const existing = await config.api.public.user.create({
        email: structures.email(),
        password: "password123!",
        roles: {},
        userGroups: [group._id!],
      })
      const ungrouped = await config.api.public.user.create({
        email: structures.email(),
        password: "password123!",
        roles: {},
        userGroups: [],
      })
      const rejectedEmail = structures.email()
      mocks.licenses.useLicense(license)

      await config.api.public.user.create(
        {
          email: rejectedEmail,
          password: "password123!",
          roles: {},
          userGroups: [group._id!],
        },
        { status: 400 }
      )
      for (const userGroups of [[replacement._id!], []]) {
        await config.api.public.user.update(
          { ...existing, firstName: "Rejected", userGroups },
          { status: 400 }
        )
      }

      for (const target of [existing, ungrouped]) {
        const retrieved = await config.api.public.user.find(target._id!)
        await config.api.public.user.update({
          ...retrieved,
          firstName: "Updated",
        })
      }
      const saved = await config.doInTenant(() => users.getById(existing._id!))
      const savedUngrouped = await config.doInTenant(() =>
        users.getById(ungrouped._id!)
      )
      const rejected = await config.doInTenant(() =>
        users.getGlobalUserByEmail(rejectedEmail)
      )
      expect(saved.userGroups).toEqual([group._id])
      expect(saved.firstName).toBe("Updated")
      expect(savedUngrouped).toMatchObject({
        firstName: "Updated",
        userGroups: [],
      })
      expect(rejected).toBeUndefined()
    }
  )

  it("preserves memberships when an unlicensed update only changes their order", async () => {
    const first = await config.createGroup()
    const second = await config.createGroup()
    const created = await config.api.public.user.create({
      email: structures.email(),
      password: "password123!",
      roles: {},
      userGroups: [first._id!, second._id!],
    })
    mocks.licenses.useLicense(constants.licenses.CLOUD_FREE_LICENSE)

    await config.api.public.user.update({
      ...created,
      firstName: "Updated",
      userGroups: [second._id!, first._id!],
    })

    const saved = await config.doInTenant(() => users.getById(created._id!))
    expect(saved).toMatchObject({
      firstName: "Updated",
      userGroups: [first._id, second._id],
    })
  })

  it("rejects a non-admin API key without changing memberships", async () => {
    const group = await config.createGroup()
    const target = await config.globalUser({
      builder: { global: false },
      admin: { global: false },
    })
    const builder = await config.globalUser({
      builder: { global: true },
      admin: { global: false },
    })

    await config.withUser(builder, () =>
      config.api.public.user.update(
        { ...target, userGroups: [group._id!] },
        { status: 403 }
      )
    )

    const saved = await config.doInTenant(() => users.getById(target._id!))
    expect(saved.userGroups || []).toEqual([])
  })

  it("rejects a group from another tenant without changing the user", async () => {
    const target = await config.globalUser()
    const foreign = await context.doInTenant(structures.tenant.id(), () =>
      proDb.groups.save({
        ...structures.userGroups.userGroup(),
        _id: proDb.groups.generateUserGroupID(),
        roles: {},
      })
    )

    await config.api.public.user.update(
      { ...target, firstName: "Rejected", userGroups: [foreign.id] },
      { status: 404 }
    )

    const saved = await config.doInTenant(() => users.getById(target._id!))
    expect(saved.firstName).toBe(target.firstName)
    expect(saved.userGroups || []).toEqual([])
  })
})
