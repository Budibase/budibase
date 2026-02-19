import {
  CreateWorkspaceConnectionRequest,
  PASSWORD_REPLACEMENT,
  RestAuthType,
  WorkspaceConnectionType,
  ApiKeyLocation,
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  DocumentType,
  BasicRestAuthConfig,
} from "@budibase/types"
import * as setup from "./utilities"
import { generator } from "@budibase/backend-core/tests"
import sdk from "../../../sdk"
import { context, cache } from "@budibase/backend-core"

describe("/workspace/connections", () => {
  const config = setup.getConfig()

  afterAll(() => {
    setup.afterAll()
  })

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  function makeBasicAuthConnection(
    overrides?: Partial<CreateWorkspaceConnectionRequest>
  ): CreateWorkspaceConnectionRequest {
    return {
      name: generator.guid(),
      type: WorkspaceConnectionType.WORKSPACE_CONNECTION,
      baseUrl: "https://api.example.com",
      auth: [
        {
          _id: generator.guid(),
          name: "Basic Auth",
          type: RestAuthType.BASIC,
          config: {
            username: "testuser",
            password: "testpassword",
          },
        },
      ],
      props: {},
      ...overrides,
    }
  }

  function makeBearerAuthConnection(
    overrides?: Partial<CreateWorkspaceConnectionRequest>
  ): CreateWorkspaceConnectionRequest {
    return {
      name: generator.guid(),
      type: WorkspaceConnectionType.WORKSPACE_CONNECTION,
      baseUrl: "https://api.example.com",
      auth: [
        {
          _id: generator.guid(),
          name: "Bearer Auth",
          type: RestAuthType.BEARER,
          config: {
            token: "my-secret-token",
          },
        },
      ],
      props: {},
      ...overrides,
    }
  }

  function makeApiKeyAuthConnection(
    overrides?: Partial<CreateWorkspaceConnectionRequest>
  ): CreateWorkspaceConnectionRequest {
    return {
      name: generator.guid(),
      type: WorkspaceConnectionType.WORKSPACE_CONNECTION,
      baseUrl: "https://api.example.com",
      auth: [
        {
          _id: generator.guid(),
          name: "API Key Auth",
          type: "apiKey" as const,
          config: {
            location: ApiKeyLocation.HEADER,
            key: "X-API-Key",
            value: "my-secret-api-key",
          },
        },
      ],
      props: {},
      ...overrides,
    }
  }

  function makeOAuth2AuthConnection(
    overrides?: Partial<CreateWorkspaceConnectionRequest>
  ): CreateWorkspaceConnectionRequest {
    return {
      name: generator.guid(),
      type: WorkspaceConnectionType.WORKSPACE_CONNECTION,
      baseUrl: "https://api.example.com",
      auth: [
        {
          _id: generator.guid(),
          name: "OAuth2 Auth",
          type: "oauth2" as const,
          url: "https://auth.example.com/token",
          clientId: "my-client-id",
          clientSecret: "my-client-secret",
          method: OAuth2CredentialsMethod.BODY,
          grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
        },
      ],
      props: {},
      ...overrides,
    }
  }

  describe("create", () => {
    it("can create a connection with basic auth", async () => {
      const body = makeBasicAuthConnection()
      const result = await config.api.workspaceConnection.create(body)

      expect(result.connection._id).toBeDefined()
      expect(result.connection._rev).toBeDefined()
      expect(result.connection.name).toBe(body.name)
      expect(result.connection.baseUrl).toBe(body.baseUrl)
    })

    it("can create a connection with bearer auth", async () => {
      const body = makeBearerAuthConnection()
      const result = await config.api.workspaceConnection.create(body)

      expect(result.connection.name).toBe(body.name)
      expect(result.connection.auth).toHaveLength(1)
      expect(result.connection.auth[0].type).toBe(RestAuthType.BEARER)
    })

    it("can create a connection with API key auth", async () => {
      const body = makeApiKeyAuthConnection()
      const result = await config.api.workspaceConnection.create(body)

      expect(result.connection.name).toBe(body.name)
      expect(result.connection.auth).toHaveLength(1)
      expect(result.connection.auth[0].type).toBe("apiKey")
    })

    it("can create a connection with OAuth2 auth", async () => {
      const body = makeOAuth2AuthConnection()
      const result = await config.api.workspaceConnection.create(body)

      expect(result.connection.name).toBe(body.name)
      expect(result.connection.auth).toHaveLength(1)
      expect(result.connection.auth[0].type).toBe("oauth2")
    })

    it("can create a connection with multiple auth configs", async () => {
      const body = makeBasicAuthConnection({
        auth: [
          {
            _id: generator.guid(),
            name: "Basic",
            type: RestAuthType.BASIC,
            config: { username: "user", password: "pass" },
          },
          {
            _id: generator.guid(),
            name: "Bearer",
            type: RestAuthType.BEARER,
            config: { token: "tok" },
          },
        ],
      })
      const result = await config.api.workspaceConnection.create(body)

      expect(result.connection.auth).toHaveLength(2)
    })

    it("can create a connection with props", async () => {
      const body = makeBasicAuthConnection({
        props: {
          headers: { "X-Custom": "value" },
          query: { format: "json" },
          staticVariables: { baseId: "123" },
        },
      })
      const result = await config.api.workspaceConnection.create(body)

      expect(result.connection.props).toEqual(body.props)
    })
  })

  describe("fetch", () => {
    it("returns empty when no connections exist", async () => {
      const response = await config.api.workspaceConnection.fetch()
      expect(response.connections).toEqual([])
    })

    it("returns all created connections", async () => {
      await config.api.workspaceConnection.create(makeBasicAuthConnection())
      await config.api.workspaceConnection.create(makeBearerAuthConnection())

      const response = await config.api.workspaceConnection.fetch()
      expect(response.connections).toHaveLength(2)
    })
  })

  describe("update", () => {
    it("can update a connection", async () => {
      const body = makeBasicAuthConnection()
      const created = await config.api.workspaceConnection.create(body)

      const updated = await config.api.workspaceConnection.update({
        ...body,
        _id: created.connection._id!,
        _rev: created.connection._rev!,
        name: "Updated Name",
      })

      expect(updated.connection.name).toBe("Updated Name")
    })

    it("returns 404 when connection does not exist", async () => {
      const body = makeBasicAuthConnection()
      await config.api.workspaceConnection.update(
        {
          ...body,
          _id: `${DocumentType.WORKSPACE_CONNECTION}_nonexistent`,
          _rev: "1-abc",
        },
        { status: 404 }
      )
    })

    it("returns 400 when path id does not match body id", async () => {
      const body = makeBasicAuthConnection()
      const created = await config.api.workspaceConnection.create(body)

      // Send PUT to the real connection URL but with a different _id in body
      await config
        .getRequest()!
        .put(`/api/workspace/connections/${created.connection._id!}`)
        .set(config.defaultHeaders())
        .send({
          ...body,
          _id: "different_id",
          _rev: created.connection._rev!,
        })
        .expect(400)
    })
  })

  describe("delete", () => {
    it("can delete a connection", async () => {
      const created = await config.api.workspaceConnection.create(
        makeBasicAuthConnection()
      )

      await config.api.workspaceConnection.remove(
        created.connection._id!,
        created.connection._rev!
      )

      const response = await config.api.workspaceConnection.fetch()
      expect(response.connections).toHaveLength(0)
    })

    it("returns 404 when connection does not exist", async () => {
      await config.api.workspaceConnection.remove("nonexistent", "1-abc", {
        status: 404,
      })
    })
  })

  describe("secret scrubbing", () => {
    it("scrubs basic auth password in response", async () => {
      const result = await config.api.workspaceConnection.create(
        makeBasicAuthConnection()
      )

      const auth = result.connection.auth[0] as any
      expect(auth.config.password).toBe(PASSWORD_REPLACEMENT)
      expect(auth.config.username).toBe("testuser")
    })

    it("scrubs bearer token in response", async () => {
      const result = await config.api.workspaceConnection.create(
        makeBearerAuthConnection()
      )

      const auth = result.connection.auth[0] as any
      expect(auth.config.token).toBe(PASSWORD_REPLACEMENT)
    })

    it("scrubs API key value in response", async () => {
      const result = await config.api.workspaceConnection.create(
        makeApiKeyAuthConnection()
      )

      const auth = result.connection.auth[0] as any
      expect(auth.config.value).toBe(PASSWORD_REPLACEMENT)
      expect(auth.config.key).toBe("X-API-Key")
      expect(auth.config.location).toBe(ApiKeyLocation.HEADER)
    })

    it("scrubs OAuth2 clientSecret in response", async () => {
      const result = await config.api.workspaceConnection.create(
        makeOAuth2AuthConnection()
      )

      const auth = result.connection.auth[0] as any
      expect(auth.clientSecret).toBe(PASSWORD_REPLACEMENT)
      expect(auth.clientId).toBe("my-client-id")
    })

    it("preserves env var references instead of scrubbing them", async () => {
      const body = makeBasicAuthConnection({
        auth: [
          {
            _id: generator.guid(),
            name: "Env Auth",
            type: RestAuthType.BASIC,
            config: {
              username: "{{ env.USERNAME }}",
              password: "{{ env.PASSWORD }}",
            },
          },
        ],
      })
      const result = await config.api.workspaceConnection.create(body)

      const auth = result.connection.auth[0] as any
      expect(auth.config.password).toBe("{{ env.PASSWORD }}")
      expect(auth.config.username).toBe("{{ env.USERNAME }}")
    })
  })

  describe("secret preservation on update", () => {
    it("preserves basic auth password when PASSWORD_REPLACEMENT is sent back", async () => {
      const body = makeBasicAuthConnection()
      const basicAuth = body.auth[0] as BasicRestAuthConfig
      await config.api.workspaceConnection.create(body)

      // Fetch returns scrubbed password, should never expose creds
      const fetched = await config.api.workspaceConnection.fetch()
      const conn = fetched.connections[0]
      const auth = conn.auth[0] as any
      expect(auth.config.password).toBe(PASSWORD_REPLACEMENT)

      // Update with the scrubbed response
      await config.api.workspaceConnection.update({
        ...body,
        _id: conn._id!,
        _rev: conn._rev!,
        name: "Updated",
        auth: [
          {
            ...basicAuth,
            config: {
              ...basicAuth.config,
              password: PASSWORD_REPLACEMENT,
            },
          },
        ] as any,
      })

      // Verify the real password is preserved in the DB
      const actual = await context.doInWorkspaceContext(
        config.getDevWorkspaceId(),
        async () => sdk.connections.get(conn._id!)
      )
      expect((actual!.auth[0] as any).config.password).toBe("testpassword")
    })

    it("preserves bearer token when PASSWORD_REPLACEMENT is sent back", async () => {
      const body = makeBearerAuthConnection()
      await config.api.workspaceConnection.create(body)

      const fetched = await config.api.workspaceConnection.fetch()
      const conn = fetched.connections[0]

      await config.api.workspaceConnection.update({
        ...body,
        _id: conn._id!,
        _rev: conn._rev!,
        auth: [
          {
            ...body.auth[0],
            config: { token: PASSWORD_REPLACEMENT },
          },
        ] as any,
      })

      const actual = await context.doInWorkspaceContext(
        config.getDevWorkspaceId(),
        async () => sdk.connections.get(conn._id!)
      )
      expect((actual!.auth[0] as any).config.token).toBe("my-secret-token")
    })

    it("preserves API key value when PASSWORD_REPLACEMENT is sent back", async () => {
      const body = makeApiKeyAuthConnection()
      await config.api.workspaceConnection.create(body)

      const fetched = await config.api.workspaceConnection.fetch()
      const conn = fetched.connections[0]

      await config.api.workspaceConnection.update({
        ...body,
        _id: conn._id!,
        _rev: conn._rev!,
        auth: [
          {
            ...body.auth[0],
            config: {
              ...(body.auth[0] as any).config,
              value: PASSWORD_REPLACEMENT,
            },
          },
        ] as any,
      })

      const actual = await context.doInWorkspaceContext(
        config.getDevWorkspaceId(),
        async () => sdk.connections.get(conn._id!)
      )
      expect((actual!.auth[0] as any).config.value).toBe("my-secret-api-key")
    })

    it("preserves OAuth2 clientSecret when PASSWORD_REPLACEMENT is sent back", async () => {
      const body = makeOAuth2AuthConnection()
      await config.api.workspaceConnection.create(body)

      const fetched = await config.api.workspaceConnection.fetch()
      const conn = fetched.connections[0]

      await config.api.workspaceConnection.update({
        ...body,
        _id: conn._id!,
        _rev: conn._rev!,
        auth: [
          {
            ...body.auth[0],
            clientSecret: PASSWORD_REPLACEMENT,
          },
        ] as any,
      })

      const actual = await context.doInWorkspaceContext(
        config.getDevWorkspaceId(),
        async () => sdk.connections.get(conn._id!)
      )
      expect((actual!.auth[0] as any).clientSecret).toBe("my-client-secret")
    })

    it("uses new value when a real password is sent instead of PASSWORD_REPLACEMENT", async () => {
      const body = makeBasicAuthConnection()
      const basicAuth = body.auth[0] as BasicRestAuthConfig
      await config.api.workspaceConnection.create(body)

      const fetched = await config.api.workspaceConnection.fetch()
      const conn = fetched.connections[0]

      await config.api.workspaceConnection.update({
        ...body,
        _id: conn._id!,
        _rev: conn._rev!,
        auth: [
          {
            ...basicAuth,
            config: {
              ...basicAuth.config,
              password: "brand-new-password",
            },
          },
        ] as any,
      })

      const actual = await context.doInWorkspaceContext(
        config.getDevWorkspaceId(),
        async () => sdk.connections.get(conn._id!)
      )
      expect((actual!.auth[0] as any).config.password).toBe(
        "brand-new-password"
      )
    })

    it("does not preserve secret when auth config _id does not match", async () => {
      const body = makeBasicAuthConnection()
      await config.api.workspaceConnection.create(body)

      const fetched = await config.api.workspaceConnection.fetch()
      const conn = fetched.connections[0]

      await config.api.workspaceConnection.update({
        ...body,
        _id: conn._id!,
        _rev: conn._rev!,
        auth: [
          {
            _id: "completely-different-id",
            name: "New Auth",
            type: RestAuthType.BASIC,
            config: {
              username: "newuser",
              password: "newpassword",
            },
          },
        ],
      })

      const actual = await context.doInWorkspaceContext(
        config.getDevWorkspaceId(),
        async () => sdk.connections.get(conn._id!)
      )
      expect((actual!.auth[0] as any).config.password).toBe("newpassword")
    })
  })

  describe("cache cleanup", () => {
    it("clears OAuth2 token cache on update", async () => {
      const body = makeOAuth2AuthConnection()
      const created = await config.api.workspaceConnection.create(body)
      const conn = created.connection

      const cacheKey = cache.CacheKey.OAUTH2_TOKEN(conn._id!)

      await config.doInTenant(async () => {
        cache.store(cacheKey, "Bearer mock-token", 3600)
        const cached = await cache.get(cacheKey)
        expect(cached).toBe("Bearer mock-token")
      })

      await config.api.workspaceConnection.update({
        ...body,
        _id: conn._id!,
        _rev: conn._rev!,
        name: "Updated",
      })

      const tokenAfterUpdate = await config.doInTenant(() =>
        cache.get(cacheKey)
      )
      expect(tokenAfterUpdate).toBeNull()
    })

    it("clears OAuth2 token cache on delete", async () => {
      const body = makeOAuth2AuthConnection()
      const created = await config.api.workspaceConnection.create(body)
      const conn = created.connection

      const cacheKey = cache.CacheKey.OAUTH2_TOKEN(conn._id!)

      await config.doInTenant(async () => {
        cache.store(cacheKey, "Bearer mock-token", 3600)
        const cached = await cache.get(cacheKey)
        expect(cached).toBe("Bearer mock-token")
      })

      await config.api.workspaceConnection.remove(conn._id!, conn._rev!)

      const tokenAfterDelete = await config.doInTenant(() =>
        cache.get(cacheKey)
      )
      expect(tokenAfterDelete).toBeNull()
    })
  })

  describe("validation", () => {
    it("rejects missing name", async () => {
      const body = makeBasicAuthConnection()
      delete (body as any).name
      await config.api.workspaceConnection.create(body, { status: 400 })
    })

    it("rejects missing auth array", async () => {
      const body = makeBasicAuthConnection()
      delete (body as any).auth
      await config.api.workspaceConnection.create(body, { status: 400 })
    })

    it("rejects missing props", async () => {
      const body = makeBasicAuthConnection()
      delete (body as any).props
      await config.api.workspaceConnection.create(body, { status: 400 })
    })

    it("rejects invalid auth type", async () => {
      const body = makeBasicAuthConnection({
        auth: [
          {
            _id: generator.guid(),
            name: "Bad Auth",
            type: "invalid" as any,
            config: { username: "u", password: "p" },
          } as any,
        ],
      })
      await config.api.workspaceConnection.create(body, { status: 400 })
    })

    it("rejects invalid connection type", async () => {
      const body = makeBasicAuthConnection({
        type: "invalid" as any,
      })
      await config.api.workspaceConnection.create(body, { status: 400 })
    })
  })
})
