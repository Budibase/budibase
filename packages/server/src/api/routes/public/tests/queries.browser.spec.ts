import { generator } from "@budibase/backend-core/tests"
import { SourceName } from "@budibase/types"
import { createServer, type Server } from "http"
import type { AddressInfo } from "net"
import * as setup from "../../tests/utilities"

const browserE2e = process.env.BROWSER_E2E === "1" ? describe : describe.skip

browserE2e("public query search browser E2E", () => {
  const config = setup.getConfig()
  let bridge: Server

  beforeAll(async () => {
    await config.init()
  })

  afterAll(async () => {
    bridge?.closeAllConnections()
    await new Promise<void>(resolve => bridge?.close(() => resolve()))
    setup.afterAll()
  })

  it("redacts saved headers for a matching public query search", async () => {
    const datasource = await config.api.datasource.create({
      name: generator.guid(),
      type: "test",
      source: SourceName.REST,
      config: {},
    })
    const name = `browser credential probe ${generator.guid()}`
    await config.api.query.save({
      name,
      datasourceId: datasource._id!,
      parameters: [],
      fields: {
        method: "GET",
        path: "/repos",
        headers: {
          Authorization: "Bearer browser-canary",
          "X-Api-Key": "browser-api-key-canary",
        },
      },
      transformer: "",
      schema: {},
      readable: true,
      queryVerb: "read",
    })
    const apiKey = await config.generateApiKey()
    const appId = config.getDevWorkspaceId()
    const appPort = (config.server?.address() as AddressInfo).port
    const page = `<!doctype html><title>Query search browser E2E</title><main id="result">Running</main><script>
      const headers = {
        "Content-Type": "application/json",
        "x-budibase-api-key": ${JSON.stringify(apiKey)},
        "x-budibase-app-id": ${JSON.stringify(appId)}
      }
      const search = async name => {
        const response = await fetch("/api/public/v1/queries/search", {
          method: "POST", headers, body: JSON.stringify({ name })
        })
        return { status: response.status, body: await response.json() }
      }
      ;(async () => {
        let outcome
        try {
          const matching = await search(${JSON.stringify(name)})
          const missing = await search("missing query browser control")
          outcome = {
            matching: matching.status === 200 &&
              matching.body.data.length === 1 &&
              matching.body.data[0].name === ${JSON.stringify(name)} &&
              matching.body.data[0].fields.method === "GET" &&
              matching.body.data[0].fields.path === "/repos" &&
              !Object.hasOwn(matching.body.data[0].fields, "headers") &&
              !JSON.stringify(matching.body).includes("browser-canary") &&
              !JSON.stringify(matching.body).includes("browser-api-key-canary"),
            nonmatching: missing.status === 200 && missing.body.data.length === 0
          }
        } catch (error) {
          outcome = { matching: false, nonmatching: false, error: String(error) }
        }
        document.querySelector("#result").textContent = JSON.stringify(outcome)
        await fetch("/complete", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(outcome)
        })
      })()
    </script>`

    let complete: (value: { matching: boolean; nonmatching: boolean }) => void
    const result = new Promise<{ matching: boolean; nonmatching: boolean }>(
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
        (request.url !== "/api/public/v1/queries/search" ||
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
        `http://127.0.0.1:${appPort}${request.url}`,
        {
          method: request.method,
          headers: {
            "Content-Type": "application/json",
            "x-budibase-api-key": String(request.headers["x-budibase-api-key"]),
            "x-budibase-app-id": String(request.headers["x-budibase-app-id"]),
          },
          body,
        }
      )
      response.writeHead(upstream.status, { "Content-Type": "application/json" })
      response.end(await upstream.text())
    })
    await new Promise<void>(resolve => bridge.listen(4109, "127.0.0.1", resolve))

    expect(await result).toEqual({ matching: true, nonmatching: true })
  }, 120000)
})
