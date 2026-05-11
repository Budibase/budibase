import { cache, encryption } from "@budibase/backend-core"
import { generator, utils as testUtils } from "@budibase/backend-core/tests"
import { OAuth2CredentialsMethod, OAuth2GrantType } from "@budibase/types"
import nock from "nock"
import path from "path"
import { GenericContainer, Wait } from "testcontainers"
import tk from "timekeeper"
import sdk from "../../.."
import { startContainer } from "../../../../integrations/tests/utils"
import { KEYCLOAK_IMAGE } from "../../../../integrations/tests/utils/images"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { getToken, getTokenFromConfig } from "../utils"
import * as sharePointCredentials from "../../ai/knowledgeSources/sharepoint/credentials"

jest.mock("../../ai/knowledgeSources/sharepoint/credentials", () => ({
  getDelegatedOAuthCredential: jest.fn(),
}))

const config = new TestConfiguration()

const volumePath = path.resolve(__dirname, "docker-volume")

jest.setTimeout(90000)

describe("oauth2 utils", () => {
  let keycloakUrl: string

  beforeAll(async () => {
    await config.init()

    const ports = await startContainer(
      new GenericContainer(KEYCLOAK_IMAGE)
        .withName("keycloak_testcontainer")
        .withExposedPorts(8080)
        .withBindMounts([
          { source: volumePath, target: "/opt/keycloak/data/import/" },
        ])
        .withCommand(["start-dev", "--import-realm"])
        .withWaitStrategy(
          Wait.forLogMessage("Listening on: http://0.0.0.0:8080")
        )
        .withStartupTimeout(60000)
    )

    const port = ports.find(x => x.container === 8080)?.host
    if (!port) {
      throw new Error("Keycloak port not found")
    }

    keycloakUrl = `http://127.0.0.1:${port}`
  })

  describe.each(
    Object.values(OAuth2CredentialsMethod).map<
      [OAuth2CredentialsMethod, OAuth2GrantType]
    >(method => [method, OAuth2GrantType.CLIENT_CREDENTIALS])
  )("generateToken (in %s, grant type %s)", (method, grantType) => {
    it("successfully generates tokens", async () => {
      const response = await config.doInContext(
        config.devWorkspaceId,
        async () => {
          const oauthConfig = await sdk.oauth2.create({
            name: generator.guid(),
            url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
            clientId: "my-client",
            clientSecret: encryption.encrypt("my-secret"),
            method,
            grantType,
          })

          const response = await getToken(oauthConfig._id)
          return response
        }
      )

      expect(response).toEqual(expect.stringMatching(/^Bearer .+/))
    })

    it("uses cached value if available", async () => {
      const oauthConfig = await config.doInContext(config.devWorkspaceId, () =>
        sdk.oauth2.create({
          name: generator.guid(),
          url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
          clientId: "my-client",
          clientSecret: encryption.encrypt("my-secret"),
          method,
          grantType,
        })
      )

      const firstToken = await config.doInContext(config.devWorkspaceId, () =>
        getToken(oauthConfig._id)
      )
      const secondToken = await config.doInContext(config.devWorkspaceId, () =>
        getToken(oauthConfig._id)
      )

      expect(firstToken).toEqual(secondToken)
    })

    it("refetches value if cache expired", async () => {
      const oauthConfig = await config.doInContext(config.devWorkspaceId, () =>
        sdk.oauth2.create({
          name: generator.guid(),
          url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
          clientId: "my-client",
          clientSecret: encryption.encrypt("my-secret"),
          method,
          grantType,
        })
      )

      const firstToken = await config.doInContext(config.devWorkspaceId, () =>
        getToken(oauthConfig._id)
      )
      await config.doInContext(config.devWorkspaceId, () =>
        sdk.oauth2.cleanStoredToken(oauthConfig._id)
      )
      const secondToken = await config.doInContext(config.devWorkspaceId, () =>
        getToken(oauthConfig._id)
      )

      expect(firstToken).not.toEqual(secondToken)
    })

    it("handles wrong urls", async () => {
      await expect(
        config.doInContext(config.devWorkspaceId, async () => {
          const oauthConfig = await sdk.oauth2.create({
            name: generator.guid(),
            url: `${keycloakUrl}/realms/wrong/protocol/openid-connect/token`,
            clientId: "my-client",
            clientSecret: encryption.encrypt("my-secret"),
            method,
            grantType,
          })

          await getToken(oauthConfig._id)
        })
      ).rejects.toThrow("Error fetching oauth2 token: Not Found")
    })

    it("handles wrong client ids", async () => {
      await expect(
        config.doInContext(config.devWorkspaceId, async () => {
          const oauthConfig = await sdk.oauth2.create({
            name: generator.guid(),
            url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
            clientId: "wrong-client-id",
            clientSecret: encryption.encrypt("my-secret"),
            method,
            grantType,
          })

          await getToken(oauthConfig._id)
        })
      ).rejects.toThrow(
        "Error fetching oauth2 token: Invalid client or Invalid client credentials"
      )
    })

    it("handles wrong secrets", async () => {
      await expect(
        config.doInContext(config.devWorkspaceId, async () => {
          const oauthConfig = await sdk.oauth2.create({
            name: generator.guid(),
            url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
            clientId: "my-client",
            clientSecret: encryption.encrypt("wrong-secret"),
            method,
            grantType,
          })

          await getToken(oauthConfig._id)
        })
      ).rejects.toThrow(
        "Error fetching oauth2 token: Invalid client or Invalid client credentials"
      )
    })

    describe("track usages", () => {
      beforeAll(() => {
        tk.freeze(Date.now())
      })

      it("tracks usages on generation", async () => {
        const oauthConfig = await config.doInContext(
          config.devWorkspaceId,
          () =>
            sdk.oauth2.create({
              name: generator.guid(),
              url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
              clientId: "my-client",
              clientSecret: encryption.encrypt("my-secret"),
              method,
              grantType,
            })
        )

        await config.doInContext(config.devWorkspaceId, () =>
          getToken(oauthConfig._id)
        )
        await testUtils.queue.processMessages(
          cache.docWritethrough.DocWritethroughProcessor.queue.getBullQueue()
        )

        const usageLog = await config.doInContext(config.devWorkspaceId, () =>
          sdk.oauth2.getLastUsages([oauthConfig._id])
        )

        expect(usageLog[oauthConfig._id]).toEqual(Date.now())
      })

      it("does not track on failed usages", async () => {
        const oauthConfig = await config.doInContext(
          config.devWorkspaceId,
          () =>
            sdk.oauth2.create({
              name: generator.guid(),
              url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
              clientId: "wrong-client",
              clientSecret: encryption.encrypt("my-secret"),
              method,
              grantType,
            })
        )

        await expect(
          config.doInContext(config.devWorkspaceId, () =>
            getToken(oauthConfig._id)
          )
        ).rejects.toThrow()
        await testUtils.queue.processMessages(
          cache.docWritethrough.DocWritethroughProcessor.queue.getBullQueue()
        )

        const usageLog = await config.doInContext(config.devWorkspaceId, () =>
          sdk.oauth2.getLastUsages([oauthConfig._id])
        )

        expect(usageLog[oauthConfig._id]).toBeUndefined()
      })

      it("tracks usages between prod and dev, keeping always the latest", async () => {
        const oauthConfig = await config.doInContext(
          config.devWorkspaceId,
          () =>
            sdk.oauth2.create({
              name: generator.guid(),
              url: `${keycloakUrl}/realms/myrealm/protocol/openid-connect/token`,
              clientId: "my-client",
              clientSecret: encryption.encrypt("my-secret"),
              method,
              grantType,
            })
        )

        await config.doInContext(config.devWorkspaceId, () =>
          getToken(oauthConfig._id)
        )

        await config.publish()

        tk.travel(Date.now() + 100)
        await config.doInContext(config.prodWorkspaceId, () =>
          getToken(oauthConfig._id)
        )
        await testUtils.queue.processMessages(
          cache.docWritethrough.DocWritethroughProcessor.queue.getBullQueue()
        )

        for (const appId of [config.devWorkspaceId, config.prodWorkspaceId]) {
          const usageLog = await config.doInContext(appId, () =>
            sdk.oauth2.getLastUsages([oauthConfig._id])
          )

          expect(usageLog).toEqual({
            [oauthConfig._id]: Date.now(),
          })
        }
      })
    })
  })

  describe("delegated oauth", () => {
    it("uses refresh_token grant for delegated OAuth token refresh", async () => {
      const getDelegatedOAuthCredential = jest.mocked(
        sharePointCredentials.getDelegatedOAuthCredential
      )
      getDelegatedOAuthCredential.mockResolvedValue({
        refreshToken: "refresh-token",
      } as any)
      const tokenScope = nock("https://login.microsoftonline.com")
        .post("/common/oauth2/v2.0/token", (body: any) => {
          const params = new URLSearchParams(body)
          return (
            params.get("grant_type") === "refresh_token" &&
            params.get("refresh_token") === "refresh-token"
          )
        })
        .reply(200, {
          access_token: "access-token",
          token_type: "Bearer",
          expires_in: 3600,
        })

      await config.doInContext(config.devWorkspaceId, () =>
        getTokenFromConfig({
          _id: "datasource_1_auth_1",
          authType: "delegated_oauth",
          url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
          clientId: "client-id",
          clientSecret: encryption.encrypt("client-secret"),
          method: OAuth2CredentialsMethod.BODY,
          grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
        })
      )

      expect(getDelegatedOAuthCredential).toHaveBeenCalledWith(
        "datasource_1_auth_1"
      )
      expect(tokenScope.isDone()).toBe(true)
    })
  })
})
