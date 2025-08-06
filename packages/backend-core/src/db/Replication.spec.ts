import { DocumentType } from "@budibase/types"
import { DesignDocuments } from "../constants"
import Replication from "./Replication"

const mockSourceDb = {
  replicate: {
    to: jest.fn(),
  },
  name: "source_db",
}

const mockTargetDb = {
  destroy: jest.fn(),
  name: "target_db",
}

jest.mock("./couch", () => ({
  getPouchDB: jest.fn((name: string) =>
    name === mockSourceDb.name ? mockSourceDb : mockTargetDb
  ),
}))

describe("Replication", () => {
  describe("appReplicateOpts", () => {
    it("should skip migrations document when not a creation", () => {
      const replication = new Replication({
        source: `${DocumentType.APP_DEV}_source`,
        target: `${DocumentType.APP}_target`,
      })

      const opts = replication.appReplicateOpts({})

      const migrationsDoc = {
        _id: DesignDocuments.MIGRATIONS,
        type: "migration",
      }

      // Should default to false (skip migrations)
      expect((opts.filter as Function)(migrationsDoc, {})).toBe(false)
    })

    it("should skip migrations document when isCreation is set to false", () => {
      const replication = new Replication({
        source: `${DocumentType.APP_DEV}_source`,
        target: `${DocumentType.APP}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: false })

      const migrationsDoc = {
        _id: DesignDocuments.MIGRATIONS,
        type: "migration",
      }

      expect((opts.filter as Function)(migrationsDoc, {})).toBe(false)
      expect(opts).not.toHaveProperty("isCreation")
    })

    it("should include migrations document on creation", () => {
      const replication = new Replication({
        source: `${DocumentType.APP_DEV}_source`,
        target: `${DocumentType.APP}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: true })

      const migrationsDoc = {
        _id: DesignDocuments.MIGRATIONS,
        type: "migration",
      }

      expect((opts.filter as Function)(migrationsDoc, {})).toBe(true)
      expect(opts).not.toHaveProperty("isCreation")
    })

    it("should always replicate deleted documents", () => {
      const replication = new Replication({
        source: `${DocumentType.APP_DEV}_source`,
        target: `${DocumentType.APP}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: false })

      const deletedDoc = {
        _id: "some_doc",
        _deleted: true,
      }

      expect((opts.filter as Function)(deletedDoc, {})).toBe(true)
    })

    it("should filter out automation logs", () => {
      const replication = new Replication({
        source: `${DocumentType.APP_DEV}_source`,
        target: `${DocumentType.APP}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: true })

      const automationLogDoc = {
        _id: `${DocumentType.AUTOMATION_LOG}_123`,
        type: "automation_log",
      }

      expect((opts.filter as Function)(automationLogDoc, {})).toBe(false)
    })

    it("should filter out app metadata", () => {
      const replication = new Replication({
        source: `${DocumentType.APP_DEV}_source`,
        target: `${DocumentType.APP}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: true })

      const appMetadataDoc = {
        _id: DocumentType.APP_METADATA,
        type: "app_metadata",
      }

      expect((opts.filter as Function)(appMetadataDoc, {})).toBe(false)
    })

    it("should filter out design documents when replicating to dev", () => {
      const replication = new Replication({
        source: `${DocumentType.APP}_source`,
        target: `${DocumentType.APP_DEV}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: true })

      const designDoc = {
        _id: "_design/database",
        type: "design_doc",
      }

      expect((opts.filter as Function)(designDoc, {})).toBe(false)
    })

    it("should include design documents when replicating to production", () => {
      const replication = new Replication({
        source: `${DocumentType.APP_DEV}_source`,
        target: `${DocumentType.APP}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: true })

      const designDoc = {
        _id: "_design/database",
        type: "design_doc",
      }

      expect((opts.filter as Function)(designDoc, {})).toBe(true)
    })

    it("should use custom filter when provided", () => {
      const customFilter = jest.fn().mockReturnValue(false)

      const replication = new Replication({
        source: `${DocumentType.APP_DEV}_source`,
        target: `${DocumentType.APP}_target`,
      })

      const opts = replication.appReplicateOpts({
        isCreation: true,
        filter: customFilter,
      })

      const regularDoc = {
        _id: "regular_doc",
        type: "regular",
      }

      const result = (opts.filter as Function)(regularDoc, {})

      expect(customFilter).toHaveBeenCalledWith(regularDoc, {})
      expect(result).toBe(false)
    })

    it("should return opts unchanged when filter is string", () => {
      const replication = new Replication({
        source: `${DocumentType.APP_DEV}_source`,
        target: `${DocumentType.APP}_target`,
      })

      const inputOpts = {
        filter: "design/myfilter",
        isCreation: true,
      }

      const opts = replication.appReplicateOpts(inputOpts)

      expect(opts).toBe(inputOpts)
    })
  })
})
