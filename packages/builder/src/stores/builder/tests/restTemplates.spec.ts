import { describe, it, expect, beforeEach } from "vitest"

import {
  RestTemplatesStore,
  MICROSOFT_SHAREPOINT_NAME_ALIASES,
} from "../restTemplates"

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
      const template = store.templates[0]
      const result = store.getByName(template.name)
      expect(result).toBeDefined()
      expect(result?.name).toBe(template.name)
    })

    it("finds a grouped template by name and includes group icon", () => {
      const group = store.templateGroups[0]
      const template = group.templates[0]
      const result = store.getByName(template.name)
      expect(result).toBeDefined()
      expect(result?.name).toBe(template.name)
      expect(result?.icon).toBeDefined()
    })

    it.each(Object.entries(MICROSOFT_SHAREPOINT_NAME_ALIASES))(
      "resolves SharePoint alias '%s' to '%s'",
      (alias, expected) => {
        const result = store.getByName(alias)
        expect(result).toBeDefined()
        expect(result?.name).toBe(expected)
      }
    )

    it("returns undefined for unknown name", () => {
      expect(store.getByName("NonExistentTemplate")).toBeUndefined()
    })
  })

  describe("getById", () => {
    it("finds a top-level template by id", () => {
      const template = store.templates[0]
      const result = store.getById(template.id)
      expect(result).toBeDefined()
      expect(result?.name).toBe(template.name)
    })

    it("finds a grouped template by full prefixed id", () => {
      const group = store.templateGroups[0]
      const template = group.templates[0]
      // Grouped template ids are stored with the group slug already prefixed
      const result = store.getById(template.id)
      expect(result).toBeDefined()
      expect(result?.name).toBe(template.name)
    })

    it("finds a grouped template using groupName prefix", () => {
      const group = store.templateGroups[0]
      const template = group.templates[0]
      const result = store.getById(template.id, group.name)
      expect(result).toBeDefined()
      expect(result?.name).toBe(template.name)
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
      const template = store.templates[0]
      const result = store.get(template.id as any)
      expect(result).toBeDefined()
      expect(result?.name).toBe(template.name)
    })

    it("falls back to name lookup when id not found", () => {
      const template = store.templates[0]
      const result = store.get(template.name as any)
      expect(result).toBeDefined()
      expect(result?.name).toBe(template.name)
    })

    it("resolves legacy SharePoint aliases via name fallback", () => {
      const [alias, expected] = Object.entries(
        MICROSOFT_SHAREPOINT_NAME_ALIASES
      )[0]
      const result = store.get(alias as any)
      expect(result).toBeDefined()
      expect(result?.name).toBe(expected)
    })

    it("returns undefined for completely unknown input", () => {
      expect(store.get("totally-unknown" as any)).toBeUndefined()
    })
  })
})
