import { QuotaUsageType, StaticQuotaName } from "@budibase/types"
import { createServer, type Server } from "http"
import { DBTestConfiguration, mocks } from "../../../../tests"
import { CLOUD_FREE_LICENSE } from "../../../constants/licenses"
import * as db from "../../../db"
import * as quotas from "../quotas"
import _ from "lodash"

const browserE2e = process.env.BROWSER_E2E === "1" ? describe : describe.skip

browserE2e("quota reservation browser E2E", () => {
  const config = new DBTestConfiguration()
  let bridge: Server

  afterAll(async () => {
    bridge?.closeAllConnections()
    await new Promise<void>(resolve => bridge?.close(() => resolve()))
  })

  it("admits only one browser request for the last quota slot", async () => {
    config.newTenant()
    const license = _.cloneDeep(CLOUD_FREE_LICENSE)
    license.quotas.usage.static.rows.value = 1
    mocks.licenses.useLicense(license)

    let callbacksStarted = 0
    let notifySecondCallback: () => void = () => {}
    const secondCallback = new Promise<void>(resolve => {
      notifySecondCallback = resolve
    })
    const page = `<!doctype html><title>Quota browser E2E</title><main id="result">Running</main><script>
      ;(async () => {
        let outcome
        try {
          const requests = await Promise.all([
            fetch("/create", { method: "POST" }),
            fetch("/create", { method: "POST" })
          ])
          const usage = await (await fetch("/usage")).json()
          outcome = {
            oneCreated: requests.filter(response => response.status === 200).length === 1,
            oneRejected: requests.filter(response => response.status === 429).length === 1,
            usageIsOne: usage.total === 1 && usage.callbacksStarted === 1
          }
        } catch (error) {
          outcome = { oneCreated: false, oneRejected: false, usageIsOne: false,
            error: String(error) }
        }
        document.querySelector("#result").textContent = JSON.stringify(outcome)
        await fetch("/complete", { method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(outcome) })
      })()
    </script>`
    let complete: (value: {
      oneCreated: boolean
      oneRejected: boolean
      usageIsOne: boolean
    }) => void
    const result = new Promise<{
      oneCreated: boolean
      oneRejected: boolean
      usageIsOne: boolean
    }>(resolve => {
      complete = resolve
    })

    bridge = createServer(async (request, response) => {
      if (request.url === "/") {
        response.writeHead(200, { "Content-Type": "text/html" })
        response.end(page)
        return
      }
      if (request.url === "/complete" && request.method === "POST") {
        const chunks: Buffer[] = []
        for await (const chunk of request) {
          chunks.push(chunk)
        }
        complete(JSON.parse(Buffer.concat(chunks).toString()))
        response.writeHead(204)
        response.end()
        return
      }
      if (request.url === "/usage" && request.method === "GET") {
        const usage = await config.doInWorkspace(() =>
          db.quotas.getCurrentUsageValues(
            QuotaUsageType.STATIC,
            StaticQuotaName.ROWS
          )
        )
        response.writeHead(200, { "Content-Type": "application/json" })
        response.end(JSON.stringify({ total: usage.total, callbacksStarted }))
        return
      }
      if (request.url === "/create" && request.method === "POST") {
        try {
          await config.doInWorkspace(() =>
            quotas.increment(StaticQuotaName.ROWS, QuotaUsageType.STATIC, {
              fn: async () => {
                callbacksStarted += 1
                if (callbacksStarted === 1) {
                  await Promise.race([
                    secondCallback,
                    new Promise<void>(resolve => setTimeout(resolve, 100)),
                  ])
                } else {
                  notifySecondCallback()
                }
                return "created"
              },
            })
          )
          response.writeHead(200)
        } catch {
          response.writeHead(429)
        }
        response.end()
        return
      }
      response.writeHead(404)
      response.end()
    })
    await new Promise<void>(resolve => bridge.listen(4111, "127.0.0.1", resolve))

    expect(await result).toEqual({
      oneCreated: true,
      oneRejected: true,
      usageIsOne: true,
    })
  }, 120000)
})
