import { UserCtx } from "@budibase/types"
import ensureTenantAppOwnership from "../ensureTenantAppOwnership"
import { context, Header, HTTPError } from "@budibase/backend-core"

function ctx(opts?: { appId: string }) {
  const ctx = {
    throw: (status: number, message: string) => {
      throw new HTTPError(message, status)
    },
    path: "",
    request: {
      headers: {},
    },
  } as unknown as UserCtx
  if (opts?.appId) {
    ctx.request.headers[Header.APP_ID] = opts.appId
  }
  return ctx
}

describe("Ensure Tenant Ownership Middleware", () => {
  const tenantId = "tenant1"
  const appId = `app_dev_${tenantId}_fce449c4d75b4e4a9c7a6980d82a3e22`

  it("calls next() when appId matches tenant ID", async () => {
    await context.doInTenant(tenantId, async () => {
      let called = false
      await ensureTenantAppOwnership(ctx({ appId }), () => {
        called = true
      })
      expect(called).toBe(true)
    })
  })

  it("throws when tenant appId does not match tenant ID", async () => {
    let called = false
    await expect(async () => {
      await context.doInTenant("tenant_2", async () => {
        await ensureTenantAppOwnership(ctx({ appId }), () => {
          called = true
        })
      })
    }).rejects.toThrow("Unauthorized")
    expect(called).toBe(false)
  })

  it("throws 400 when appId is missing", async () => {
    await expect(ensureTenantAppOwnership(ctx(), () => {})).rejects.toThrow(
      "appId must be provided"
    )
  })
})
