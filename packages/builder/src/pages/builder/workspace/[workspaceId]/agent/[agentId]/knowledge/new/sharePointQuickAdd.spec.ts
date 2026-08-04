import {
  MICROSOFT_SHAREPOINT_REST_TEMPLATE_ID,
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  RestAuthType,
  SourceName,
  type Datasource,
  type UIIntegration,
} from "@budibase/types"
import { describe, expect, it, vi } from "vitest"
import {
  buildSharePointConnectionConfig,
  saveSharePointQuickDatasource,
  SHAREPOINT_CONNECTION_NAME,
} from "./sharePointQuickAdd"

describe("SharePoint quick add", () => {
  it("builds the fixed Graph client credentials configuration", () => {
    const config = buildSharePointConnectionConfig({
      credentials: {
        tenantId: " tenant-id ",
        clientId: " client-id ",
        clientSecret: " client-secret ",
      },
      authConfigId: "auth-id",
    })

    expect(SHAREPOINT_CONNECTION_NAME).toBe("Microsoft SharePoint")
    expect(MICROSOFT_SHAREPOINT_REST_TEMPLATE_ID).toBe("microsoft-sharepoint")
    expect(config).toEqual({
      url: "https://graph.microsoft.com",
      defaultHeaders: {},
      defaultQueryParameters: {},
      staticVariables: {},
      rejectUnauthorized: true,
      downloadImages: true,
      authConfigs: [
        {
          _id: "auth-id",
          name: "Client credentials",
          type: RestAuthType.OAUTH2,
          url: "https://login.microsoftonline.com/tenant-id/oauth2/v2.0/token",
          clientId: "client-id",
          clientSecret: "client-secret",
          method: OAuth2CredentialsMethod.BODY,
          grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
          scope: "https://graph.microsoft.com/.default",
        },
      ],
    })
  })

  it("encodes the tenant ID before adding it to the token URL", () => {
    const config = buildSharePointConnectionConfig({
      credentials: {
        tenantId: "tenant/example.com",
        clientId: "client-id",
        clientSecret: "client-secret",
      },
      authConfigId: "auth-id",
    })

    expect(config.authConfigs?.[0]).toMatchObject({
      url: "https://login.microsoftonline.com/tenant%2Fexample.com/oauth2/v2.0/token",
    })
  })

  it("creates a new SharePoint datasource on the first attempt", async () => {
    const integration = {
      name: SourceName.REST,
      friendlyName: "REST API",
    } as UIIntegration
    const createdDatasource: Datasource = {
      _id: "datasource-id",
      type: "datasource",
      source: SourceName.REST,
    }
    const createDatasource = vi.fn(async () => createdDatasource)
    const updateDatasource = vi.fn()

    const result = await saveSharePointQuickDatasource({
      credentials: {
        tenantId: "tenant-id",
        clientId: "client-id",
        clientSecret: "client-secret",
      },
      authConfigId: "auth-id",
      integration,
      createDatasource,
      updateDatasource,
    })

    expect(updateDatasource).not.toHaveBeenCalled()
    expect(createDatasource).toHaveBeenCalledWith(
      expect.objectContaining({
        integration,
        name: SHAREPOINT_CONNECTION_NAME,
        restTemplateId: MICROSOFT_SHAREPOINT_REST_TEMPLATE_ID,
      })
    )
    expect(result).toBe(createdDatasource)
  })

  it("updates the existing datasource when retrying", async () => {
    const credentials = {
      tenantId: "tenant-id",
      clientId: "updated-client-id",
      clientSecret: "updated-client-secret",
    }
    const integration = {
      name: SourceName.REST,
      friendlyName: "REST API",
    } as UIIntegration
    const existingDatasource: Datasource = {
      _id: "datasource-id",
      _rev: "1-test",
      type: "datasource",
      source: SourceName.REST,
      name: SHAREPOINT_CONNECTION_NAME,
      restTemplateId: MICROSOFT_SHAREPOINT_REST_TEMPLATE_ID,
      config: {},
    }
    const createDatasource = vi.fn()
    const updateDatasource = vi.fn(async ({ datasource }) => datasource)

    const result = await saveSharePointQuickDatasource({
      credentials,
      authConfigId: "auth-id",
      integration,
      existingDatasource,
      createDatasource,
      updateDatasource,
    })

    expect(createDatasource).not.toHaveBeenCalled()
    expect(updateDatasource).toHaveBeenCalledOnce()
    expect(result).toMatchObject({
      _id: "datasource-id",
      config: {
        authConfigs: [
          {
            _id: "auth-id",
            clientId: "updated-client-id",
            clientSecret: "updated-client-secret",
          },
        ],
      },
    })
  })
})
