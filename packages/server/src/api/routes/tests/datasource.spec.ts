import { cache, context, events } from "@budibase/backend-core"
import sdk from "../../../sdk"
import { getCachedVariable } from "../../../threads/utils"
import * as setup from "./utilities"
import { allowUndefined, checkBuilderEndpoint } from "./utilities/TestFunctions"

import { generator } from "@budibase/backend-core/tests"
import {
  BBReferenceFieldSubType,
  Datasource,
  FieldSchema,
  FieldType,
  JsonFieldSubType,
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  PASSWORD_REPLACEMENT,
  RelationshipType,
  RestAuthType,
  SourceName,
  SupportedSqlTypes,
  Table,
  TableSchema,
} from "@budibase/types"
import { Knex } from "knex"
import nock from "nock"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../integrations/tests/utils"
import { tableForDatasource } from "../../../tests/utilities/structures"

describe("/datasources", () => {
  const config = setup.getConfig()
  let datasource: Datasource

  beforeAll(async () => {
    await config.init()
  })
  afterAll(setup.afterAll)

  beforeEach(async () => {
    datasource = await config.api.datasource.create({
      type: "datasource",
      name: "Test",
      source: SourceName.POSTGRES,
      config: {},
    })
    jest.clearAllMocks()
    nock.cleanAll()
  })

  describe("create", () => {
    it("should create a new datasource", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "Test",
        source: SourceName.POSTGRES,
        config: {},
      })
      expect(ds.name).toEqual("Test")
      expect(events.datasource.created).toHaveBeenCalledTimes(1)
    })

    it("should fail if the datasource is invalid", async () => {
      await config.api.datasource.create(
        {
          name: "Test",
          type: "test",
          source: "invalid" as SourceName,
          config: {},
        },
        {
          status: 500,
          body: {
            message: 'No datasource implementation found called: "invalid"',
          },
        }
      )
    })

    it("can create a REST datasource with multiple auth configs", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: generator.guid(),
        source: SourceName.REST,
        config: {
          authConfigs: [
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
        },
      })

      expect(ds.config!.authConfigs).toHaveLength(2)
      expect(ds.config!.authConfigs[0].type).toBe(RestAuthType.BASIC)
      expect(ds.config!.authConfigs[1].type).toBe(RestAuthType.BEARER)
    })

    it("can create a REST datasource with default headers, query params, and static variables", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: generator.guid(),
        source: SourceName.REST,
        config: {
          defaultHeaders: { "X-Custom": "value" },
          defaultQueryParameters: { format: "json" },
          staticVariables: { baseId: "123" },
        },
      })

      expect(ds.config!.defaultHeaders).toEqual({ "X-Custom": "value" })
      expect(ds.config!.defaultQueryParameters).toEqual({ format: "json" })
      expect(ds.config!.staticVariables).toEqual({ baseId: "123" })
    })
  })

  describe("dynamic variables", () => {
    it("should invalidate changed or removed variables", async () => {
      nock("http://www.example.com")
        .get("/")
        .reply(200, [{ value: "test" }])
        .get("/?test=test")
        .reply(200, [{ value: 1 }])

      let datasource = await config.api.datasource.create({
        type: "datasource",
        name: "Rest",
        source: SourceName.REST,
        config: {},
      })

      const query = await config.api.query.save({
        datasourceId: datasource._id!,
        fields: {
          path: "www.example.com",
        },
        parameters: [],
        transformer: null,
        queryVerb: "read",
        name: datasource.name!,
        schema: {},
        readable: true,
      })

      datasource = await config.api.datasource.update({
        ...datasource,
        config: {
          dynamicVariables: [
            {
              queryId: query._id,
              name: "variable3",
              value: "{{ data.0.[value] }}",
            },
          ],
        },
      })

      // preview once to cache variables
      await config.api.query.preview({
        fields: {
          path: "www.example.com",
          queryString: "test={{ variable3 }}",
        },
        datasourceId: datasource._id!,
        parameters: [],
        transformer: null,
        queryVerb: "read",
        name: datasource.name!,
        schema: {},
        readable: true,
      })

      // check variables in cache
      let contents = await getCachedVariable(query._id!, "variable3")
      expect(contents.rows.length).toEqual(1)

      // update the datasource to remove the variables
      datasource.config!.dynamicVariables = []
      await config.api.datasource.update(datasource)

      // check variables no longer in cache
      contents = await getCachedVariable(query._id!, "variable3")
      expect(contents).toBe(null)
    })
  })

  describe("restTemplateId (with restTemplate accommodation)", () => {
    it("should save a datasource with restTemplateId", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "Test REST",
        source: SourceName.REST,
        config: {},
        restTemplateId: "attio",
      })
      expect(ds.restTemplateId).toBe("attio")
    })

    it("should still read datasources that only have the legacy restTemplate field", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "Legacy REST",
        source: SourceName.REST,
        config: {},
        restTemplate: "Attio" as any,
      })

      const fetched = await config.api.datasource.get(ds._id!)
      expect(fetched.restTemplate).toBe("Attio")
      expect(fetched.restTemplateId).toBeUndefined()
    })

    it("should read datasources that have both restTemplate and restTemplateId", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "Both Fields REST",
        source: SourceName.REST,
        config: {},
        restTemplate: "Attio" as any,
        restTemplateId: "attio",
      })

      const fetched = await config.api.datasource.get(ds._id!)
      expect(fetched.restTemplate).toBe("Attio")
      expect(fetched.restTemplateId).toBe("attio")
    })

    it("should return restTemplateId when updating a REST datasource", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "REST with template",
        source: SourceName.REST,
        config: {},
        restTemplateId: "attio",
      })

      const updated = await config.api.datasource.update({
        ...ds,
        name: "Updated REST",
      })

      expect(updated.restTemplateId).toBe("attio")
      expect(updated.name).toBe("Updated REST")
    })

    it("should handle updating a legacy datasource without losing restTemplate", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "Legacy Only",
        source: SourceName.REST,
        config: {},
        restTemplate: "Attio" as any,
      })

      const updated = await config.api.datasource.update({
        ...ds,
        name: "Updated Legacy",
      })

      expect(updated.restTemplate).toBe("Attio")
      expect(updated.name).toBe("Updated Legacy")
    })

    it("should handle SharePoint template name migration scenarios", async () => {
      // Legacy datasources stored "SharePoint Sites" as restTemplate.
      // Templates were renamed to just "Sites" within "Microsoft SharePoint"
      // group, so the name would sluggify to "microsoft-sharepoint-sites".
      const legacy = await config.api.datasource.create({
        type: "datasource",
        name: "SharePoint Legacy",
        source: SourceName.REST,
        config: {},
        restTemplate: "SharePoint Sites" as any,
      })

      const fetchedLegacy = await config.api.datasource.get(legacy._id!)
      expect(fetchedLegacy.restTemplate).toBe("SharePoint Sites")
      expect(fetchedLegacy.restTemplateId).toBeUndefined()

      // Migrated datasource has both old name and new id
      const migrated = await config.api.datasource.create({
        type: "datasource",
        name: "SharePoint Migrated",
        source: SourceName.REST,
        config: {},
        restTemplate: "SharePoint Sites" as any,
        restTemplateId: "microsoft-sharepoint-sites",
      })

      const fetchedMigrated = await config.api.datasource.get(migrated._id!)
      expect(fetchedMigrated.restTemplate).toBe("SharePoint Sites")
      // This represents
      expect(fetchedMigrated.restTemplateId).toBe("microsoft-sharepoint-sites")

      const fresh = await config.api.datasource.create({
        type: "datasource",
        name: "SharePoint New",
        source: SourceName.REST,
        config: {},
        restTemplateId: "microsoft-sharepoint-drives",
      })

      const fetchedFresh = await config.api.datasource.get(fresh._id!)
      expect(fetchedFresh.restTemplateId).toBe("microsoft-sharepoint-drives")
      expect(fetchedFresh.restTemplate).toBeUndefined()
    })
  })

  describe("auth config secret scrubbing", () => {
    it("scrubs basic auth password in create response", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "REST scrub basic",
        source: SourceName.REST,
        config: {
          authConfigs: [
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
        },
      })

      expect(ds.config!.authConfigs[0].config.password).toBe(
        PASSWORD_REPLACEMENT
      )
      expect(ds.config!.authConfigs[0].config.username).toBe("testuser")
    })

    it("scrubs bearer token in create response", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "REST scrub bearer",
        source: SourceName.REST,
        config: {
          authConfigs: [
            {
              _id: generator.guid(),
              name: "Bearer Auth",
              type: RestAuthType.BEARER,
              config: {
                token: "my-secret-token",
              },
            },
          ],
        },
      })

      expect(ds.config!.authConfigs[0].config.token).toBe(PASSWORD_REPLACEMENT)
    })

    it("scrubs basic auth password in get response", async () => {
      const created = await config.api.datasource.create({
        type: "datasource",
        name: "REST scrub get basic",
        source: SourceName.REST,
        config: {
          authConfigs: [
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
        },
      })

      const fetched = await config.api.datasource.get(created._id!)
      expect(fetched.config!.authConfigs[0].config.password).toBe(
        PASSWORD_REPLACEMENT
      )
    })

    it("preserves env var references instead of scrubbing them", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "REST env vars",
        source: SourceName.REST,
        config: {
          authConfigs: [
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
        },
      })

      expect(ds.config!.authConfigs[0].config.password).toBe(
        "{{ env.PASSWORD }}"
      )
      expect(ds.config!.authConfigs[0].config.username).toBe(
        "{{ env.USERNAME }}"
      )
    })
  })

  describe("auth config password preservation", () => {
    it("should preserve basic auth password when updating with PASSWORD_REPLACEMENT and matching _id", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "REST with auth",
        source: SourceName.REST,
        config: {
          authConfigs: [
            {
              _id: "auth1",
              name: "My Basic Auth",
              type: RestAuthType.BASIC,
              config: {
                username: "user",
                password: "realpassword123",
              },
            },
          ],
        },
      })

      const fetched = await config.api.datasource.get(ds._id!)
      expect(fetched.config!.authConfigs[0].config.password).toBe(
        PASSWORD_REPLACEMENT
      )

      const updated = await config.api.datasource.update({
        ...fetched,
        name: "Updated name",
      })

      const actual = await context.doInWorkspaceContext(
        config.getDevWorkspaceId(),
        async () => sdk.datasources.get(updated._id!)
      )
      expect(actual!.config!.authConfigs[0].config.password).toBe(
        "realpassword123"
      )
    })

    it("should preserve password when auth config name changes but _id stays the same", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "REST rename auth",
        source: SourceName.REST,
        config: {
          authConfigs: [
            {
              _id: "auth1",
              name: "Original Name",
              type: RestAuthType.BASIC,
              config: {
                username: "user",
                password: "secretpass",
              },
            },
          ],
        },
      })

      const fetched = await config.api.datasource.get(ds._id!)
      fetched.config!.authConfigs[0].name = "Renamed Auth"

      await config.api.datasource.update(fetched)

      const actual = await context.doInWorkspaceContext(
        config.getDevWorkspaceId(),
        async () => sdk.datasources.get(ds._id!)
      )
      expect(actual!.config!.authConfigs[0].name).toBe("Renamed Auth")
      expect(actual!.config!.authConfigs[0].config.password).toBe("secretpass")
    })

    it("should preserve bearer token when PASSWORD_REPLACEMENT is sent back", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "REST bearer preservation",
        source: SourceName.REST,
        config: {
          authConfigs: [
            {
              _id: "auth1",
              name: "Bearer Auth",
              type: RestAuthType.BEARER,
              config: {
                token: "my-secret-token",
              },
            },
          ],
        },
      })

      const fetched = await config.api.datasource.get(ds._id!)
      expect(fetched.config!.authConfigs[0].config.token).toBe(
        PASSWORD_REPLACEMENT
      )

      await config.api.datasource.update(fetched)

      const actual = await context.doInWorkspaceContext(
        config.getDevWorkspaceId(),
        async () => sdk.datasources.get(ds._id!)
      )
      expect(actual!.config!.authConfigs[0].config.token).toBe(
        "my-secret-token"
      )
    })

    it("should use new value when a real password is sent instead of PASSWORD_REPLACEMENT", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "REST new password",
        source: SourceName.REST,
        config: {
          authConfigs: [
            {
              _id: "auth1",
              name: "Basic Auth",
              type: RestAuthType.BASIC,
              config: {
                username: "user",
                password: "original-password",
              },
            },
          ],
        },
      })

      await config.api.datasource.update({
        ...ds,
        config: {
          authConfigs: [
            {
              _id: "auth1",
              name: "Basic Auth",
              type: RestAuthType.BASIC,
              config: {
                username: "user",
                password: "brand-new-password",
              },
            },
          ],
        },
      })

      const actual = await context.doInWorkspaceContext(
        config.getDevWorkspaceId(),
        async () => sdk.datasources.get(ds._id!)
      )
      expect(actual!.config!.authConfigs[0].config.password).toBe(
        "brand-new-password"
      )
    })

    it("should not preserve password when auth config _id does not match", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: "REST new auth",
        source: SourceName.REST,
        config: {
          authConfigs: [
            {
              _id: "auth1",
              name: "Old Auth",
              type: RestAuthType.BASIC,
              config: {
                username: "user",
                password: "oldpassword",
              },
            },
          ],
        },
      })

      await config.api.datasource.update({
        ...ds,
        config: {
          authConfigs: [
            {
              _id: "auth2",
              name: "New Auth",
              type: RestAuthType.BASIC,
              config: {
                username: "newuser",
                password: "newpassword",
              },
            },
          ],
        },
      })

      const actual = await context.doInWorkspaceContext(
        config.getDevWorkspaceId(),
        async () => sdk.datasources.get(ds._id!)
      )
      expect(actual!.config!.authConfigs[0].config.password).toBe("newpassword")
    })
  })

  describe("OAuth2 auth config scrubbing", () => {
    const makeOAuth2AuthConfig = (overrides?: object) => ({
      _id: generator.guid(),
      name: "OAuth2 Auth",
      type: RestAuthType.OAUTH2,
      url: "https://auth.example.com/token",
      clientId: "my-client-id",
      clientSecret: "my-client-secret",
      method: OAuth2CredentialsMethod.BODY,
      grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
      ...overrides,
    })

    it("scrubs OAuth2 clientSecret in create response", async () => {
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: generator.guid(),
        source: SourceName.REST,
        config: { authConfigs: [makeOAuth2AuthConfig()] },
      })

      expect(ds.config!.authConfigs[0].clientSecret).toBe(PASSWORD_REPLACEMENT)
      expect(ds.config!.authConfigs[0].clientId).toBe("my-client-id")
    })

    it("scrubs OAuth2 clientSecret in get response", async () => {
      const created = await config.api.datasource.create({
        type: "datasource",
        name: generator.guid(),
        source: SourceName.REST,
        config: { authConfigs: [makeOAuth2AuthConfig()] },
      })

      const fetched = await config.api.datasource.get(created._id!)
      expect(fetched.config!.authConfigs[0].clientSecret).toBe(
        PASSWORD_REPLACEMENT
      )
    })

    it("preserves OAuth2 clientSecret when PASSWORD_REPLACEMENT is sent back on update", async () => {
      const authId = generator.guid()
      const ds = await config.api.datasource.create({
        type: "datasource",
        name: generator.guid(),
        source: SourceName.REST,
        config: { authConfigs: [makeOAuth2AuthConfig({ _id: authId })] },
      })

      const fetched = await config.api.datasource.get(ds._id!)
      expect(fetched.config!.authConfigs[0].clientSecret).toBe(
        PASSWORD_REPLACEMENT
      )

      await config.api.datasource.update({ ...fetched, name: "Updated" })

      const actual = await context.doInWorkspaceContext(
        config.getDevWorkspaceId(),
        async () => sdk.datasources.get(ds._id!)
      )
      expect(actual!.config!.authConfigs[0].clientSecret).toBe(
        "my-client-secret"
      )
    })
  })

  describe("OAuth2 token cache cleanup", () => {
    const makeOAuth2Datasource = async () => {
      return config.api.datasource.create({
        type: "datasource",
        name: generator.guid(),
        source: SourceName.REST,
        config: {
          authConfigs: [
            {
              _id: "oauth2-auth-1",
              name: "OAuth2 Auth",
              type: RestAuthType.OAUTH2,
              url: "https://auth.example.com/token",
              clientId: "my-client-id",
              clientSecret: "my-client-secret",
              method: "header",
              grantType: "client_credentials",
            },
          ],
        },
      })
    }

    it("clears OAuth2 token cache on datasource update", async () => {
      const ds = await makeOAuth2Datasource()
      const cacheKey = cache.CacheKey.OAUTH2_TOKEN("oauth2-auth-1")

      await config.doInTenant(async () => {
        await cache.store(cacheKey, "Bearer mock-token", 3600)
        expect(await cache.get(cacheKey)).toBe("Bearer mock-token")
      })

      await config.api.datasource.update({ ...ds, name: "Updated" })

      await config.doInTenant(async () => {
        expect(await cache.get(cacheKey)).toBeNull()
      })
    })

    it("clears OAuth2 token cache on datasource delete", async () => {
      const ds = await makeOAuth2Datasource()
      const cacheKey = cache.CacheKey.OAUTH2_TOKEN("oauth2-auth-1")

      await config.doInTenant(async () => {
        await cache.store(cacheKey, "Bearer mock-token", 3600)
        expect(await cache.get(cacheKey)).toBe("Bearer mock-token")
      })

      await config.api.datasource.delete(ds)

      await config.doInTenant(async () => {
        expect(await cache.get(cacheKey)).toBeNull()
      })
    })
  })

  describe("permissions", () => {
    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/datasources`,
      })
    })

    it("should apply authorization to delete endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/datasources/${datasource._id}/${datasource._rev}`,
      })
    })
  })
})

const descriptions = datasourceDescribe({
  plus: true,
  exclude: [DatabaseName.SQS],
})

if (descriptions.length) {
  describe.each(descriptions)(
    "$dbName",
    ({ config, dsProvider, isOracle, isMSSQL }) => {
      let datasource: Datasource
      let rawDatasource: Datasource
      let client: Knex

      beforeEach(async () => {
        const ds = await dsProvider()
        rawDatasource = ds.rawDatasource!
        datasource = ds.datasource!
        client = ds.client!

        jest.clearAllMocks()
        nock.cleanAll()
      })

      describe("get", () => {
        it("should be able to get a datasource", async () => {
          const ds = await config.api.datasource.get(datasource._id!)
          expect(ds).toEqual({
            config: expect.any(Object),
            plus: datasource.plus,
            usesEnvironmentVariables: false,
            source: datasource.source,
            isSQL: true,
            type: "datasource_plus",
            _id: datasource._id,
            _rev: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          })
        })

        it("should not return database password", async () => {
          const ds = await config.api.datasource.get(datasource._id!)
          expect(ds.config!.password).toBe("--secret-value--")
        })
      })

      describe("list", () => {
        it("returns all the datasources", async () => {
          const datasources = await config.api.datasource.fetch()
          expect(datasources).toContainEqual(
            expect.objectContaining(datasource)
          )
        })
      })

      describe("put", () => {
        it("should update an existing datasource", async () => {
          const newName = generator.guid()
          datasource.name = newName
          const updatedDs = await config.api.datasource.update(datasource)
          expect(updatedDs.name).toEqual(newName)
          expect(events.datasource.updated).toHaveBeenCalledTimes(1)
        })

        it("should not overwrite database password with --secret-value--", async () => {
          const password = await context.doInWorkspaceContext(
            config.getDevWorkspaceId(),
            async () => {
              const ds = await sdk.datasources.get(datasource._id!)
              return ds.config!.password
            }
          )

          expect(password).not.toBe("--secret-value--")

          const ds = await config.api.datasource.get(datasource._id!)
          expect(ds.config!.password).toBe("--secret-value--")

          await config.api.datasource.update(
            await config.api.datasource.get(datasource._id!)
          )

          const newPassword = await context.doInWorkspaceContext(
            config.getDevWorkspaceId(),
            async () => {
              const ds = await sdk.datasources.get(datasource._id!)
              return ds.config!.password
            }
          )

          expect(newPassword).not.toBe("--secret-value--")
          expect(newPassword).toBe(password)
        })
      })

      describe("destroy", () => {
        it("deletes queries for the datasource after deletion and returns a success message", async () => {
          await config.api.query.save({
            datasourceId: datasource._id!,
            name: "Test Query",
            parameters: [],
            fields: {},
            schema: {},
            queryVerb: "read",
            transformer: null,
            readable: true,
          })

          await config.api.datasource.delete(datasource)
          const datasources = await config.api.datasource.fetch()
          expect(datasources).not.toContainEqual(
            expect.objectContaining(datasource)
          )
          expect(events.datasource.deleted).toHaveBeenCalledTimes(1)
        })
      })

      describe("schema", () => {
        it("fetching schema will not drop tables or columns", async () => {
          const datasourceId = datasource!._id!

          const simpleTable = await config.api.table.save(
            tableForDatasource(datasource, {
              name: "simple",
              schema: {
                name: {
                  name: "name",
                  type: FieldType.STRING,
                },
              },
            })
          )

          const stringName = "string"
          const fullSchema: {
            [type in SupportedSqlTypes]: FieldSchema & { type: type }
          } = {
            [FieldType.STRING]: {
              name: stringName,
              type: FieldType.STRING,
            },
            [FieldType.LONGFORM]: {
              name: "longform",
              type: FieldType.LONGFORM,
            },
            [FieldType.OPTIONS]: {
              name: "options",
              type: FieldType.OPTIONS,
              constraints: {
                presence: {
                  allowEmpty: false,
                },
                inclusion: ["1", "2", "3"],
              },
            },
            [FieldType.NUMBER]: {
              name: "number",
              type: FieldType.NUMBER,
            },
            [FieldType.BOOLEAN]: {
              name: "boolean",
              type: FieldType.BOOLEAN,
            },
            [FieldType.ARRAY]: {
              name: "array",
              type: FieldType.ARRAY,
              constraints: {
                type: JsonFieldSubType.ARRAY,
                inclusion: [],
              },
            },
            [FieldType.DATETIME]: {
              name: "datetime",
              type: FieldType.DATETIME,
              dateOnly: true,
              timeOnly: false,
            },
            [FieldType.LINK]: {
              name: "link",
              type: FieldType.LINK,
              tableId: simpleTable._id!,
              relationshipType: RelationshipType.ONE_TO_MANY,
              fieldName: "link",
            },
            [FieldType.FORMULA]: {
              name: "formula",
              type: FieldType.FORMULA,
              formula: "any formula",
            },
            [FieldType.BARCODEQR]: {
              name: "barcodeqr",
              type: FieldType.BARCODEQR,
            },
            [FieldType.BIGINT]: {
              name: "bigint",
              type: FieldType.BIGINT,
            },
            [FieldType.BB_REFERENCE]: {
              name: "bb_reference",
              type: FieldType.BB_REFERENCE,
              subtype: BBReferenceFieldSubType.USER,
            },
            [FieldType.BB_REFERENCE_SINGLE]: {
              name: "bb_reference_single",
              type: FieldType.BB_REFERENCE_SINGLE,
              subtype: BBReferenceFieldSubType.USER,
            },
          }

          await config.api.table.save(
            tableForDatasource(datasource, {
              name: "full",
              schema: fullSchema,
            })
          )

          const persisted = await config.api.datasource.get(datasourceId)
          await config.api.datasource.fetchSchema({ datasourceId })

          const updated = await config.api.datasource.get(datasourceId)
          const expected: Datasource = {
            ...persisted,
            entities:
              persisted?.entities &&
              Object.entries(persisted.entities).reduce<Record<string, Table>>(
                (acc, [tableName, table]) => {
                  acc[tableName] = expect.objectContaining({
                    ...table,
                    primaryDisplay: expect.not.stringMatching(
                      new RegExp(`^${table.primaryDisplay || ""}$`)
                    ),
                    schema: Object.entries(table.schema).reduce<TableSchema>(
                      (acc, [fieldName, field]) => {
                        acc[fieldName] = {
                          ...field,
                          externalType: allowUndefined(expect.any(String)),
                          constraints: allowUndefined(expect.any(Object)),
                          autocolumn: allowUndefined(expect.any(Boolean)),
                        }
                        return acc
                      },
                      {}
                    ),
                  })
                  return acc
                },
                {}
              ),

            _rev: expect.any(String),
            updatedAt: expect.any(String),
          }
          expect(updated).toEqual(expected)
        })

        !isOracle &&
          !isMSSQL &&
          it("can fetch options columns with a large number of options", async () => {
            const enumOptions = new Array(1000)
              .fill(0)
              .map((_, i) => i.toString())
              .toSorted()
            await client.schema.createTable("options", table => {
              table.increments("id").primary()
              table.enum("enum", enumOptions, {
                useNative: true,
                enumName: "enum",
              })
            })

            const resp = await config.api.datasource.fetchSchema({
              datasourceId: datasource._id!,
            })
            expect(resp.errors).toEqual({})

            const table = resp.datasource.entities!.options
            expect(
              table.schema.enum.constraints!.inclusion!.toSorted()
            ).toEqual(enumOptions)
          })

        !isOracle &&
          !isMSSQL &&
          it("can fetch options with commas in them", async () => {
            const enumOptions = [
              "Lincoln, Abraham",
              "Washington, George",
              "Fred",
              "Bob",
            ].toSorted()
            await client.schema.createTable("options", table => {
              table.increments("id").primary()
              table.enum("enum", enumOptions, {
                useNative: true,
                enumName: "enum",
              })
            })

            const resp = await config.api.datasource.fetchSchema({
              datasourceId: datasource._id!,
            })
            expect(resp.errors).toEqual({})

            const table = resp.datasource.entities!.options
            expect(
              table.schema.enum.constraints!.inclusion!.toSorted()
            ).toEqual(enumOptions)
          })

        !isOracle &&
          !isMSSQL &&
          it("can fetch options that may include other type names", async () => {
            const enumOptions = [
              "int",
              "bigint",
              "float",
              "numeric",
              "json",
              "map",
            ].toSorted()

            await client.schema.createTable("options", table => {
              table.increments("id").primary()
              table.enum("enum", enumOptions, {
                useNative: true,
                enumName: "enum",
              })
            })

            const resp = await config.api.datasource.fetchSchema({
              datasourceId: datasource._id!,
            })

            expect(resp.errors).toEqual({})

            const table = resp.datasource.entities!.options
            expect(
              table.schema.enum.constraints!.inclusion!.toSorted()
            ).toEqual(enumOptions)
          })
      })

      describe("verify", () => {
        it("should be able to verify the connection", async () => {
          await config.api.datasource.verify(
            {
              datasource: rawDatasource,
            },
            {
              body: {
                connected: true,
              },
            }
          )
        })

        it("should state an invalid datasource cannot connect", async () => {
          await config.api.datasource.verify(
            {
              datasource: {
                ...rawDatasource,
                config: {
                  ...rawDatasource.config,
                  password: "wrongpassword",
                },
              },
            },
            {
              body: {
                connected: false,
                error: /.*/, // error message differs between databases
              },
            }
          )
        })
      })

      describe("info", () => {
        it("should fetch information about a datasource with a single table", async () => {
          const existingTableNames = (
            await config.api.datasource.info(datasource)
          ).tableNames

          const tableName = generator.guid()
          await client.schema.createTable(tableName, table => {
            table.increments("id").primary()
            table.string("name")
          })

          const info = await config.api.datasource.info(datasource)
          expect(info.tableNames).toEqual(
            expect.arrayContaining([tableName, ...existingTableNames])
          )
          expect(info.tableNames).toHaveLength(existingTableNames.length + 1)
        })

        it("should fetch information about a datasource with multiple tables", async () => {
          const existingTableNames = (
            await config.api.datasource.info(datasource)
          ).tableNames

          const tableNames = [
            generator.guid(),
            generator.guid(),
            generator.guid(),
            generator.guid(),
          ]
          for (const tableName of tableNames) {
            await client.schema.createTable(tableName, table => {
              table.increments("id").primary()
              table.string("name")
            })
          }

          const info = await config.api.datasource.info(datasource)
          expect(info.tableNames).toEqual(
            expect.arrayContaining([...tableNames, ...existingTableNames])
          )
          expect(info.tableNames).toHaveLength(
            existingTableNames.length + tableNames.length
          )
        })
      })
    }
  )
}
