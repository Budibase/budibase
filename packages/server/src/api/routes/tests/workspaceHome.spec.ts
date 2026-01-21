import { Header, roles } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import tk from "timekeeper"

import * as setup from "./utilities"

describe("/workspace/home/metrics", () => {
  const config = setup.getConfig()
  const request = setup.getRequest()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    setup.afterAll()
  })

  beforeEach(async () => {
    tk.reset()
    await config.newTenant()
  })

  afterEach(() => {
    tk.reset()
  })

  it("returns user access count for the workspace", async () => {
    const prodWorkspaceId = config.getProdWorkspaceId()

    const initial = await request
      .get("/api/workspace/home/metrics")
      .set(config.defaultHeaders())
      .expect(200)

    await config.createUser({
      roles: { [prodWorkspaceId]: roles.BUILTIN_ROLE_IDS.BASIC },
      builder: { global: false },
      admin: { global: false },
    })
    await config.createUser({
      roles: { [prodWorkspaceId]: roles.BUILTIN_ROLE_IDS.BASIC },
      builder: { global: false },
      admin: { global: false },
    })
    await config.createUser({
      roles: { [prodWorkspaceId]: roles.BUILTIN_ROLE_IDS.BASIC },
      builder: { global: false },
      admin: { global: false },
    })

    const res = await request
      .get("/api/workspace/home/metrics")
      .set(config.defaultHeaders())
      .expect(200)

    expect(res.body.totalUsers).toEqual(initial.body.totalUsers + 3)
  })

  it("returns automation runs from quotas for the current quota month", async () => {
    tk.freeze(new Date(2026, 0, 20, 12, 0, 0, 0))

    await config.withProdApp(async () => {
      await quotas.addAutomation(async () => undefined, {
        automationId: "au_test",
      })
      await quotas.addAutomation(async () => undefined, {
        automationId: "au_test",
      })
    })

    const res = await request
      .get("/api/workspace/home/metrics")
      .set(config.defaultHeaders())
      .expect(200)

    expect(res.body.automationRunsThisMonth).toEqual(2)
    expect(res.body.agentActionsThisMonth).toEqual(0)

    expect(res.body.periodStart).toEqual(
      new Date(2026, 0, 1, 0, 0, 0, 0).toISOString()
    )
    expect(res.body.periodEnd).toEqual(
      new Date(2026, 1, 1, 0, 0, 0, 0).toISOString()
    )
  })

  it("returns 400 if workspace context is missing", async () => {
    const headers = config.defaultHeaders()
    delete (headers as any)[Header.APP_ID]

    await request.get("/api/workspace/home/metrics").set(headers).expect(400)
  })
})
