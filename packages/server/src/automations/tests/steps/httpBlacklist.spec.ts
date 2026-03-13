import nock from "nock"
import { blacklist, setEnv as setCoreEnv } from "@budibase/backend-core"
import { HttpMethod, RequestType } from "@budibase/types"
import { run as discord } from "../../steps/discord"
import { run as make } from "../../steps/make"
import { run as n8n } from "../../steps/n8n"
import { run as outgoingWebhook } from "../../steps/outgoingWebhook"
import { run as slack } from "../../steps/slack"
import { run as zapier } from "../../steps/zapier"
import { setEnv as setServerEnv } from "../../../environment"

describe("automation step outbound blacklist", () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  it("should block localhost for all outbound webhook style steps", async () => {
    const restoreCoreEnv = setCoreEnv({ BLACKLIST_IPS: undefined })
    await blacklist.refreshBlacklist()

    try {
      const blockedUrl = "http://127.0.0.1:5984"

      const outgoingResult = await outgoingWebhook({
        inputs: {
          requestMethod: RequestType.GET,
          url: blockedUrl,
          requestBody: "",
          headers: {},
        },
      })
      expect(outgoingResult.success).toBe(false)
      expect(String(outgoingResult.response)).toContain(
        "Cannot connect to URL."
      )

      const zapierResult = await zapier({
        inputs: {
          url: blockedUrl,
          body: null,
        },
      })
      expect(zapierResult.success).toBe(false)
      expect(zapierResult.response).toBe("Cannot connect to URL.")

      const n8nResult = await n8n({
        inputs: {
          url: blockedUrl,
          method: HttpMethod.POST,
          authorization: "",
          body: { value: "{}" },
        },
      })
      expect(n8nResult.success).toBe(false)
      expect(n8nResult.response).toBe("Cannot connect to URL.")

      const slackResult = await slack({
        inputs: {
          url: blockedUrl,
          text: "test",
        },
      })
      expect(slackResult.success).toBe(false)
      expect(slackResult.response).toBe("Cannot connect to URL.")

      const discordResult = await discord({
        inputs: {
          url: blockedUrl,
          content: "test",
        },
      })
      expect(discordResult.success).toBe(false)
      expect(discordResult.response).toBe("Cannot connect to URL.")

      const makeResult = await make({
        inputs: {
          url: blockedUrl,
          body: { value: "{}" },
        },
      })
      expect(makeResult.success).toBe(false)
      expect(makeResult.response).toBe("Cannot connect to URL.")
    } finally {
      restoreCoreEnv()
      await blacklist.refreshBlacklist()
    }
  })

  it("should block redirects to localhost for all outbound webhook style steps", async () => {
    const restoreCoreEnv = setCoreEnv({ BLACKLIST_IPS: undefined })
    await blacklist.refreshBlacklist()

    const safeUrl = "http://8.8.8.8"
    const redirectPath = "/safe-redirect"
    const blockedUrl = "http://127.0.0.1:5984/target"

    nock(safeUrl).persist().get(redirectPath).reply(302, undefined, {
      location: blockedUrl,
    })
    nock(safeUrl).persist().post(redirectPath).reply(302, undefined, {
      location: blockedUrl,
    })

    // Vulnerable code would follow this and return success.
    nock("http://127.0.0.1:5984").persist().get("/target").reply(200, {
      ok: true,
    })

    try {
      const outgoingResult = await outgoingWebhook({
        inputs: {
          requestMethod: RequestType.GET,
          url: `${safeUrl}${redirectPath}`,
          requestBody: "",
          headers: {},
        },
      })
      expect(outgoingResult.success).toBe(false)
      expect(String(outgoingResult.response)).toContain(
        "Cannot connect to URL."
      )

      const zapierResult = await zapier({
        inputs: {
          url: `${safeUrl}${redirectPath}`,
          body: null,
        },
      })
      expect(zapierResult.success).toBe(false)
      expect(zapierResult.response).toBe("Cannot connect to URL.")

      const n8nResult = await n8n({
        inputs: {
          url: `${safeUrl}${redirectPath}`,
          method: HttpMethod.POST,
          authorization: "",
          body: { value: "{}" },
        },
      })
      expect(n8nResult.success).toBe(false)
      expect(n8nResult.response).toBe("Cannot connect to URL.")

      const slackResult = await slack({
        inputs: {
          url: `${safeUrl}${redirectPath}`,
          text: "test",
        },
      })
      expect(slackResult.success).toBe(false)
      expect(slackResult.response).toBe("Cannot connect to URL.")

      const discordResult = await discord({
        inputs: {
          url: `${safeUrl}${redirectPath}`,
          content: "test",
        },
      })
      expect(discordResult.success).toBe(false)
      expect(discordResult.response).toBe("Cannot connect to URL.")

      const makeResult = await make({
        inputs: {
          url: `${safeUrl}${redirectPath}`,
          body: { value: "{}" },
        },
      })
      expect(makeResult.success).toBe(false)
      expect(makeResult.response).toBe("Cannot connect to URL.")
    } finally {
      restoreCoreEnv()
      await blacklist.refreshBlacklist()
    }
  })

  it("should allow localhost requests in local development", async () => {
    const restoreCoreEnv = setCoreEnv({ BLACKLIST_IPS: undefined })
    const restoreServerEnv = setServerEnv({
      NODE_ENV: "development",
      JEST_WORKER_ID: "null",
    })
    await blacklist.refreshBlacklist()

    nock("http://127.0.0.1:5984").post("/").reply(200, { ok: true })

    try {
      const result = await zapier({
        inputs: {
          url: "http://127.0.0.1:5984",
          body: null,
        },
      })

      expect(result.success).toBe(true)
      expect(result.httpStatus).toBe(200)
      expect(result.response).toEqual({ ok: true })
    } finally {
      restoreServerEnv()
      restoreCoreEnv()
      await blacklist.refreshBlacklist()
    }
  })
})
