import { constants, context, encryption, roles } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { DocumentType, SEPARATOR, type SlackAppConfig } from "@budibase/types"
import sdk from "../../../../sdk"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

const SECRET_ENCODING_PREFIX = "bbai_enc::"

const slackJsonResponse = (body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })

describe("Slack app config routes", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  afterEach(() => {
    if (jest.isMockFunction(global.fetch)) {
      jest.mocked(global.fetch).mockRestore()
    }
  })

  it("allows workspace builders to manage the config", async () => {
    const builder = await config.createUser({
      roles: {
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
      builder: {
        global: false,
        apps: [config.getProdWorkspaceId()],
      },
      admin: { global: false },
    })

    jest.spyOn(global, "fetch").mockResolvedValue(
      slackJsonResponse({
        ok: true,
        token: "xoxe-rotated-config-token",
        refresh_token: "xoxe-rotated-refresh-token",
        exp: Math.floor(Date.now() / 1000) + 43200,
      })
    )

    await config.withUser(builder, async () => {
      let response = await config.api.ai.fetchSlackAppConfig()
      expect(response.configured).toBe(false)

      response = await config.api.ai.saveSlackAppConfig({
        configToken: "xoxe-test-token",
        refreshToken: "xoxe-test-refresh-token",
      })
      expect(response.configured).toBe(true)

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const persisted = await context
          .getWorkspaceDB()
          .get<SlackAppConfig>(
            `${DocumentType.SLACK_APP_CONFIG}${SEPARATOR}config`
          )
        expect(persisted.configToken).toStartWith(SECRET_ENCODING_PREFIX)
        expect(
          encryption.compare(
            "xoxe-rotated-config-token",
            persisted.configToken.slice(SECRET_ENCODING_PREFIX.length)
          )
        ).toBeTrue()
        expect(persisted.refreshToken).toStartWith(SECRET_ENCODING_PREFIX)
        expect(
          encryption.compare(
            "xoxe-rotated-refresh-token",
            persisted.refreshToken!.slice(SECRET_ENCODING_PREFIX.length)
          )
        ).toBeTrue()
      })

      response = await config.api.ai.deleteSlackAppConfig()
      expect(response.configured).toBe(false)
    })
  })

  it("denies users without builder access to the workspace", async () => {
    const user = await config.createUser({
      roles: {
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
      builder: { global: false, apps: ["app_another_workspace"] },
      admin: { global: false },
    })

    await config.withUser(user, async () => {
      await config.api.ai.fetchSlackAppConfig({ status: 403 })
      await config.api.ai.saveSlackAppConfig(
        {
          configToken: "xoxe-test-token",
          refreshToken: "xoxe-test-refresh-token",
        },
        { status: 403 }
      )
      await config.api.ai.deleteSlackAppConfig({ status: 403 })
    })
  })

  it("isolates Slack app configuration by workspace", async () => {
    const firstWorkspaceId = config.getDevWorkspaceId()
    const secondWorkspace = await config.api.workspace.create({
      name: structures.generator.word(),
    })

    jest.spyOn(global, "fetch").mockImplementation(async (_url, init) => {
      const refreshToken = (init?.body as URLSearchParams).get("refresh_token")
      return slackJsonResponse({
        ok: true,
        token: `${refreshToken}-rotated`,
        refresh_token: `${refreshToken}-next`,
        exp: Math.floor(Date.now() / 1000) + 43200,
      })
    })

    await config.api.ai.saveSlackAppConfig({
      configToken: "xoxe-first-token",
      refreshToken: "xoxe-first-refresh",
    })

    await config.withHeaders(
      { [constants.Header.WORKSPACE_ID]: secondWorkspace.appId },
      async () => {
        expect((await config.api.ai.fetchSlackAppConfig()).configured).toBe(
          false
        )
        await config.api.ai.saveSlackAppConfig({
          configToken: "xoxe-second-token",
          refreshToken: "xoxe-second-refresh",
        })
      }
    )

    await context.doInWorkspaceContext(firstWorkspaceId, async () => {
      expect(await sdk.ai.slackAppConfig.fetchConfigToken()).toEqual(
        "xoxe-first-refresh-rotated"
      )
    })
    await context.doInWorkspaceContext(secondWorkspace.appId, async () => {
      expect(await sdk.ai.slackAppConfig.fetchConfigToken()).toEqual(
        "xoxe-second-refresh-rotated"
      )
    })
  })

  it("rejects production workspace context", async () => {
    await config.withHeaders(
      { [constants.Header.WORKSPACE_ID]: config.getProdWorkspaceId() },
      async () => {
        await config.api.ai.fetchSlackAppConfig({ status: 400 })
      }
    )
  })
})
