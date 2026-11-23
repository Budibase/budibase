import { context } from "@budibase/backend-core"
import { mocks as featureMocks } from "@budibase/backend-core/tests"
import { sdk as proSdk } from "@budibase/pro"
import { SSOProviderType } from "@budibase/types"
import { createServer, type Server } from "http"
import type { AddressInfo } from "net"
import { TestConfiguration, structures } from "../../../../tests"

const browserE2e = process.env.BROWSER_E2E === "1" ? describe : describe.skip

browserE2e("group user search browser E2E", () => {
  const config = new TestConfiguration()
  let bridge: Server

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    bridge?.closeAllConnections()
    await new Promise<void>(resolve => bridge?.close(() => resolve()))
    await config.afterAll()
  })

  it("hides SSO tokens from an app-scoped Builder", async () => {
    featureMocks.licenses.useUnlimited()
    featureMocks.licenses.useGroups()
    const group = await config.doInTenant(() =>
      proSdk.groups.save(structures.groups.UserGroup())
    )
    const target = await config.createUser({ userGroups: [group.id] })
    await config.doInTenant(() =>
      context.getGlobalDB().put({
        ...target,
        provider: "example-oidc",
        providerType: SSOProviderType.OIDC,
        oauth2: {
          accessToken: "browser-access-canary",
          refreshToken: "browser-refresh-canary",
        },
      })
    )
    const builder = await config.createUser({
      builder: { global: false, apps: ["app_builder_workspace"] },
      admin: { global: false },
    })
    await config.login(builder)
    const authHeaders = config.defaultHeaders()
    const workerPort = (config.server.address() as AddressInfo).port
    const page = `<!doctype html><title>Group user search browser E2E</title><main id="result">Running</main><script>
      ;(async () => {
        let outcome
        try {
          const response = await fetch("/api/global/users/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupIds: [${JSON.stringify(group.id)}] })
          })
          const body = await response.json()
          const user = body.data?.[0]
          outcome = {
            userReturned: response.status === 200 && body.data.length === 1 &&
              user.email === ${JSON.stringify(target.email)},
            tokensHidden: !JSON.stringify(body).includes("browser-access-canary") &&
              !JSON.stringify(body).includes("browser-refresh-canary") &&
              !Object.hasOwn(user, "oauth2") &&
              !Object.hasOwn(user, "provider") &&
              !Object.hasOwn(user, "providerType")
          }
        } catch (error) {
          outcome = { userReturned: false, tokensHidden: false, error: String(error) }
        }
        document.querySelector("#result").textContent = JSON.stringify(outcome)
        await fetch("/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(outcome)
        })
      })()
    </script>`

    let complete: (value: { userReturned: boolean; tokensHidden: boolean }) => void
    const result = new Promise<{ userReturned: boolean; tokensHidden: boolean }>(
      resolve => {
        complete = resolve
      }
    )
    bridge = createServer(async (request, response) => {
      if (request.url === "/") {
        response.writeHead(200, { "Content-Type": "text/html" })
        response.end(page)
        return
      }
      if (
        request.url !== "/complete" &&
        (request.url !== "/api/global/users/search" ||
          request.method !== "POST")
      ) {
        response.writeHead(404)
        response.end()
        return
      }
      const chunks: Buffer[] = []
      for await (const chunk of request) {
        chunks.push(chunk)
      }
      const body = Buffer.concat(chunks).toString()
      if (request.url === "/complete") {
        complete(JSON.parse(body))
        response.writeHead(204)
        response.end()
        return
      }
      const upstream = await fetch(
        `http://127.0.0.1:${workerPort}${request.url}`,
        {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body,
        }
      )
      response.writeHead(upstream.status, { "Content-Type": "application/json" })
      response.end(await upstream.text())
    })
    await new Promise<void>(resolve => bridge.listen(4110, "127.0.0.1", resolve))

    expect(await result).toEqual({ userReturned: true, tokensHidden: true })
  }, 120000)
})
