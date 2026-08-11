import { it, expect, describe } from "vitest"
import { createValidatedConfigStore } from "./validatedConfig"
import { DatasourceFieldType, SourceName } from "@budibase/types"
import { get } from "svelte/store"

describe("validatedConfig store", () => {
  const mockIntegration = {
    name: SourceName.SQL_SERVER,
    docs: "https://example.com/docs",
    description: "SQL Server integration",
    friendlyName: "SQL Server",
    query: {},
    datasource: {
      server: {
        type: DatasourceFieldType.STRING,
        required: true,
        display: "Server",
      },
      port: {
        type: DatasourceFieldType.NUMBER,
        required: false,
        display: "Port",
        default: 1433,
      },
      authType: {
        type: DatasourceFieldType.SELECT,
        display: "Auth Type",
        config: {
          options: ["Azure Active Directory", "NTLM"],
        },
      },
      adConfig: {
        type: DatasourceFieldType.FIELD_GROUP,
        display: "Configure Active Directory",
        hidden: "'{{authType}}' !== 'Azure Active Directory'",
        config: {
          openByDefault: true,
          nestedFields: true,
        },
        fields: {
          clientId: {
            type: DatasourceFieldType.STRING,
            required: true,
            display: "Client ID",
          },
          clientSecret: {
            type: DatasourceFieldType.PASSWORD,
            required: true,
            display: "Client Secret",
          },
          tenantId: {
            type: DatasourceFieldType.STRING,
            required: true,
            display: "Tenant ID",
          },
        },
      },
    },
  }

  const mockConfig = {
    server: "localhost",
    port: 1433,
    authType: "Azure Active Directory",
    adConfig: {
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      tenantId: "test-tenant-id",
    },
  }

  describe("store creation", () => {
    it("creates store with initial config", () => {
      const store = createValidatedConfigStore(mockIntegration, mockConfig)
      const storeValue = get(store)

      expect(storeValue.config).toEqual(mockConfig)
      expect(storeValue.validatedConfig).toHaveLength(4) // server, port, authType, adConfig (visible when authType is Azure AD)
    })

    it("handles empty config", () => {
      const store = createValidatedConfigStore(mockIntegration, {})
      const storeValue = get(store)

      expect(storeValue.config).toEqual({})
      expect(storeValue.validatedConfig).toHaveLength(3)
    })
  })

  describe("field group handling", () => {
    it("processes nested field groups correctly", () => {
      const store = createValidatedConfigStore(mockIntegration, mockConfig)
      const storeValue = get(store)

      const adConfigField = storeValue.validatedConfig.find(
        field => field.key === "adConfig"
      )
      expect(adConfigField).toBeDefined()
      expect(adConfigField?.type).toBe(DatasourceFieldType.FIELD_GROUP)

      const adConfigValue = adConfigField?.value as any[]
      expect(adConfigValue).toHaveLength(3)
      expect(adConfigValue.map(f => f.key)).toEqual([
        "clientId",
        "clientSecret",
        "tenantId",
      ])
      expect(adConfigValue[0].value).toBe("test-client-id")
      expect(adConfigValue[1].value).toBe("test-client-secret")
      expect(adConfigValue[2].value).toBe("test-tenant-id")
    })

    it("handles missing nested config gracefully", () => {
      const configWithoutNested = {
        server: "localhost",
        port: 1433,
        authType: "Azure Active Directory",
      }

      const store = createValidatedConfigStore(
        mockIntegration,
        configWithoutNested
      )
      const storeValue = get(store)

      const adConfigField = storeValue.validatedConfig.find(
        field => field.key === "adConfig"
      )
      const adConfigValue = adConfigField?.value as any[]

      expect(adConfigValue).toHaveLength(3)
      expect(adConfigValue.every(f => f.value === undefined)).toBe(true)
    })
  })

  describe("hidden field handling", () => {
    it("shows field when condition is met", () => {
      const store = createValidatedConfigStore(mockIntegration, mockConfig)
      const storeValue = get(store)

      const adConfigField = storeValue.validatedConfig.find(
        field => field.key === "adConfig"
      )
      expect(adConfigField).toBeDefined()
    })

    it("hides field when condition is not met", () => {
      const configWithDifferentAuth = {
        ...mockConfig,
        authType: "NTLM",
      }

      const store = createValidatedConfigStore(
        mockIntegration,
        configWithDifferentAuth
      )
      const storeValue = get(store)

      const adConfigField = storeValue.validatedConfig.find(
        field => field.key === "adConfig"
      )
      expect(adConfigField).toBeUndefined()
    })
  })

  describe("updateFieldValue", () => {
    it("updates simple field value", async () => {
      const store = createValidatedConfigStore(mockIntegration, mockConfig)

      await store.updateFieldValue("server", "newserver" as any)

      const storeValue = get(store)
      expect(storeValue.config.server).toBe("newserver")
    })

    it("updates nested field group values", async () => {
      const store = createValidatedConfigStore(mockIntegration, mockConfig)

      const newAdConfig = [
        { key: "clientId", value: "new-client-id" },
        { key: "clientSecret", value: "new-client-secret" },
        { key: "tenantId", value: "new-tenant-id" },
      ]

      await store.updateFieldValue("adConfig", newAdConfig)

      const storeValue = get(store)
      expect(storeValue.config.adConfig).toEqual({
        clientId: "new-client-id",
        clientSecret: "new-client-secret",
        tenantId: "new-tenant-id",
      })
    })
  })

  describe("validation", () => {
    it("does not validate by default", async () => {
      const store = createValidatedConfigStore(mockIntegration, {})

      const storeValue = get(store)
      expect(storeValue.errors).toEqual({})
    })

    it("handles validation errors", async () => {
      const store = createValidatedConfigStore(mockIntegration, {})

      await store.updateFieldValue("server", undefined)

      const storeValue = get(store)
      expect(storeValue.errors).toEqual({
        server: "Server is a required field",
      })
    })

    it("calls validate after field updates", async () => {
      const store = createValidatedConfigStore(mockIntegration, mockConfig)

      await store.updateFieldValue("server", undefined)
      await store.updateFieldValue("server", "newserver")

      const storeValue = get(store)
      expect(storeValue.config.server).toBe("newserver")
    })
  })

  describe("markFieldActive", () => {
    it("marks individual field as active", async () => {
      const store = createValidatedConfigStore(mockIntegration, {
        ...mockConfig,
        server: "",
      })

      await store.markFieldActive("server")

      const storeValue = get(store)
      expect(storeValue.errors).toEqual({
        server: "Server is a required field",
      })
    })

    it("can mark the same field multiple times", async () => {
      const store = createValidatedConfigStore(mockIntegration, {
        ...mockConfig,
        server: "",
        adConfig: {
          ...mockConfig.adConfig,
          clientId: "",
        },
      })

      await store.markFieldActive("server")
      expect(get(store).errors).toEqual({
        server: "Server is a required field",
      })

      await store.markFieldActive("adConfig.clientId")
      expect(get(store).errors).toEqual({
        server: "Server is a required field",
        "adConfig.clientId": "Client ID is a required field",
      })

      await store.markFieldActive("server")
      expect(get(store).errors).toEqual({
        server: "Server is a required field",
        "adConfig.clientId": "Client ID is a required field",
      })
    })
  })

  describe("markAllFieldsActive", () => {
    it("marks all fields as active", async () => {
      const store = createValidatedConfigStore(mockIntegration, {
        authType: "Azure Active Directory",
      })

      await store.markAllFieldsActive()

      const storeValue = get(store)
      expect(storeValue.errors).toEqual({
        server: "Server is a required field",
        "adConfig.clientId": "Client ID is a required field",
        "adConfig.clientSecret": "Client Secret is a required field",
        "adConfig.tenantId": "Tenant ID is a required field",
      })
    })

    it("marks all fields as active, respecting hidden nested fields", async () => {
      const store = createValidatedConfigStore(mockIntegration, {
        authType: "",
      })

      await store.markAllFieldsActive()

      const storeValue = get(store)
      expect(storeValue.errors).toEqual({
        server: "Server is a required field",
      })
    })
  })

  describe("preventSubmit logic", () => {
    it("does not prevent submit by default", () => {
      const store = createValidatedConfigStore(mockIntegration, {})
      const storeValue = get(store)

      expect(storeValue.preventSubmit).toBe(false)
    })

    it("prevents submit when there are errors", async () => {
      const store = createValidatedConfigStore(mockIntegration, mockConfig)

      await store.updateFieldValue("server", "")

      const storeValue = get(store)
      expect(storeValue.preventSubmit).toBe(true)
    })

    it("does not prevent submit when there are errors are fixed", async () => {
      const store = createValidatedConfigStore(mockIntegration, mockConfig)

      await store.updateFieldValue("server", "")
      expect(get(store).preventSubmit).toBe(true)

      await store.updateFieldValue("server", "any")
      expect(get(store).preventSubmit).toBe(false)
    })
  })
})
