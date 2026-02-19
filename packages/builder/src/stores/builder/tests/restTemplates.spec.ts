import { describe, it, expect, beforeEach } from "vitest"

import { RestTemplatesStore } from "../restTemplates"

describe("RestTemplatesStore", () => {
  let store: RestTemplatesStore

  beforeEach(() => {
    store = new RestTemplatesStore()
  })

  describe("getByName", () => {
    it("returns undefined for undefined/empty name", () => {
      expect(store.getByName(undefined)).toBeUndefined()
      expect(store.getByName("")).toBeUndefined()
    })

    it("finds a top-level template by name", () => {
      const result = store.getByName("Slack Web API")
      expect(result).toBeDefined()
      expect(result?.name).toBe("Slack Web API")
    })

    it("finds a grouped template by name and includes group icon", () => {
      const result = store.getByName("Sites")
      expect(result).toBeDefined()
      expect(result?.name).toBe("Sites")
      expect(result?.icon).toBeDefined()
    })

    it("resolves SharePoint alias 'SharePoint Sites' to 'Sites'", () => {
      const result = store.getByName("SharePoint Sites")
      expect(result).toBeDefined()
      expect(result?.name).toBe("Sites")
    })

    it("resolves SharePoint alias 'SharePoint Drives' to 'Drives'", () => {
      const result = store.getByName("SharePoint Drives")
      expect(result).toBeDefined()
      expect(result?.name).toBe("Drives")
    })

    it("resolves SharePoint alias 'SharePoint Shares' to 'Shares'", () => {
      const result = store.getByName("SharePoint Shares")
      expect(result).toBeDefined()
      expect(result?.name).toBe("Shares")
    })

    it("returns undefined for unknown name", () => {
      expect(store.getByName("NonExistentTemplate")).toBeUndefined()
    })
  })

  describe("getById", () => {
    it("finds a top-level template by id", () => {
      const result = store.getById("slack-web-api")
      expect(result).toBeDefined()
      expect(result?.name).toBe("Slack Web API")
    })

    it("finds a grouped template by full prefixed id", () => {
      const result = store.getById("microsoft-sharepoint-sites")
      expect(result).toBeDefined()
      expect(result?.name).toBe("Sites")
    })

    it("finds a grouped template using groupName prefix", () => {
      const result = store.getById("sites", "Microsoft SharePoint")
      expect(result).toBeDefined()
      expect(result?.name).toBe("Sites")
    })

    it("returns undefined for unknown id", () => {
      expect(store.getById("nonexistent")).toBeUndefined()
    })
  })

  describe("get", () => {
    it("returns undefined for undefined/empty input", () => {
      expect(store.get(undefined)).toBeUndefined()
      expect(store.get("" as any)).toBeUndefined()
    })

    it("resolves by id", () => {
      const result = store.get("slack-web-api" as any)
      expect(result).toBeDefined()
      expect(result?.name).toBe("Slack Web API")
    })

    it("falls back to name lookup when id not found", () => {
      const result = store.get("Slack Web API" as any)
      expect(result).toBeDefined()
      expect(result?.name).toBe("Slack Web API")
    })

    it("resolves legacy SharePoint aliases via name fallback", () => {
      const result = store.get("SharePoint Sites" as any)
      expect(result).toBeDefined()
      expect(result?.name).toBe("Sites")
    })

    it("returns undefined for completely unknown input", () => {
      expect(store.get("totally-unknown" as any)).toBeUndefined()
    })
  })
})
