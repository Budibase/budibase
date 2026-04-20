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
      const template = store.templates.find(t => !t.templates?.length)!
      const result = store.getByName(template.name)
      expect(result).toBeDefined()
      expect(result?.name).toBe(template.name)
    })

    it("finds a child template by name and includes icon", () => {
      const collection = store.templates.find(t => t.templates?.length)!
      const child = collection.templates![0]
      const result = store.getByName(child.name)
      expect(result).toBeDefined()
      expect(result?.name).toBe(child.name)
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
      const template = store.templates.find(t => !t.templates?.length)!
      const result = store.getById(template.id)
      expect(result).toBeDefined()
      expect(result?.name).toBe(template.name)
    })

    it("finds a collection by id", () => {
      const collection = store.templates.find(t => t.templates?.length)!
      const result = store.getById(collection.id)
      expect(result).toBeDefined()
      expect(result?.name).toBe(collection.name)
    })

    it("resolves a child id to its parent collection", () => {
      const collection = store.templates.find(t => t.templates?.length)!
      const child = collection.templates![0]
      const result = store.getById(child.id)
      expect(result).toBeDefined()
      expect(result?.id).toBe(collection.id)
    })

    it("resolves child id to parent even when group name prefix is passed", () => {
      const collection = store.templates.find(t => t.templates?.length)!
      const child = collection.templates![0]
      // groupName prefix path: slugify(groupName) + "-" + id is tried first.
      // Since child.id already includes the prefix, passing the collection name
      // should still resolve via the plain id fallback.
      const result = store.getById(child.id, collection.name)
      expect(result).toBeDefined()
      expect(result?.id).toBe(collection.id)
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
      const template = store.templates.find(t => !t.templates?.length)!
      const result = store.get(template.id as any)
      expect(result).toBeDefined()
      expect(result?.name).toBe(template.name)
    })

    it("falls back to name lookup when id not found", () => {
      const template = store.templates.find(t => !t.templates?.length)!
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
