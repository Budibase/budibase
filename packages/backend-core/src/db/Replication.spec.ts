import { DocumentType } from "@budibase/types"
import { DesignDocuments } from "../constants"
import Replication from "./Replication"

const mockSourceDb = {
  replicate: {
    to: jest.fn(),
  },
  name: "source_db",
  get: jest.fn(),
}

const mockTargetDb = {
  destroy: jest.fn(),
  name: "target_db",
  get: jest.fn(),
  remove: jest.fn(),
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
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
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
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
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
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
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
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
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
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
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
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: true })

      const appMetadataDoc = {
        _id: DocumentType.WORKSPACE_METADATA,
        type: "app_metadata",
      }

      expect((opts.filter as Function)(appMetadataDoc, {})).toBe(false)
    })

    it("should skip auto column state docs when replicating to production after creation", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: false })

      const autoColumnStateDoc = {
        _id: `${DocumentType.AUTO_COLUMN_STATE}_tableId`,
        type: "auto_column_state",
      }

      expect((opts.filter as Function)(autoColumnStateDoc, {})).toBe(false)
    })

    it("should include auto column state docs when creating production workspace", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: true })

      const autoColumnStateDoc = {
        _id: `${DocumentType.AUTO_COLUMN_STATE}_tableId`,
        type: "auto_column_state",
      }

      expect((opts.filter as Function)(autoColumnStateDoc, {})).toBe(true)
    })

    it("should include auto column state docs when replicating to dev", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE}_source`,
        target: `${DocumentType.WORKSPACE_DEV}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: false })

      const autoColumnStateDoc = {
        _id: `${DocumentType.AUTO_COLUMN_STATE}_tableId`,
        type: "auto_column_state",
      }

      expect((opts.filter as Function)(autoColumnStateDoc, {})).toBe(true)
    })

    it("should filter out design documents when replicating to dev", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE}_source`,
        target: `${DocumentType.WORKSPACE_DEV}_target`,
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
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
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
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
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
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })

      const inputOpts = {
        filter: "design/myfilter",
        isCreation: true,
      }

      const opts = replication.appReplicateOpts(inputOpts)

      expect(opts).toBe(inputOpts)
    })
  })

  describe("getRevisionNumber", () => {
    let replication: Replication

    beforeEach(() => {
      replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
    })

    it.each([
      { rev: "5-abc123def456", expected: 5 },
      { rev: "10-xyz789", expected: 10 },
      { rev: "1-simple", expected: 1 },
      { rev: undefined, expected: 0 },
    ])("should return $expected for revision '$rev'", ({ rev, expected }) => {
      const doc = { _rev: rev }
      const revNum = (replication as any).getRevisionNumber(doc)
      expect(revNum).toBe(expected)
    })
  })

  describe("haveReplicationInconsistencies", () => {
    let replication: Replication

    beforeEach(() => {
      replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
    })

    it.each([
      {
        sourceRev: "5-abc123",
        targetRev: "8-def456",
        expected: true,
        description: "target has higher revision",
      },
      {
        sourceRev: "10-abc123",
        targetRev: "8-def456",
        expected: false,
        description: "source has higher revision",
      },
      {
        sourceRev: "5-abc123",
        targetRev: "5-def456",
        expected: false,
        description: "revisions are equal",
      },
    ])(
      "should return $expected when $description",
      ({ sourceRev, targetRev, expected }) => {
        const sourceDoc = { _rev: sourceRev }
        const targetDoc = { _rev: targetRev }

        const hasInconsistency = (
          replication as any
        ).haveReplicationInconsistencies(sourceDoc, targetDoc)
        expect(hasInconsistency).toBe(expected)
      }
    )
  })

  describe("resolveInconsistencies", () => {
    let replication: Replication

    beforeEach(() => {
      jest.clearAllMocks()
      replication = new Replication({
        source: mockSourceDb.name,
        target: mockTargetDb.name,
      })
      jest.spyOn(replication, "replicate").mockResolvedValue({} as any)
    })

    it("should remove conflicted documents and replicate them", async () => {
      const sourceDoc = { _id: "doc1", _rev: "5-abc123" }
      const targetDoc = { _id: "doc1", _rev: "8-def456" }

      mockSourceDb.get.mockResolvedValue(sourceDoc)
      mockTargetDb.get.mockResolvedValue(targetDoc)
      mockTargetDb.remove.mockResolvedValue({})

      await replication.resolveInconsistencies(["doc1"])

      expect(mockTargetDb.remove).toHaveBeenCalledWith({
        _id: "doc1",
        _rev: "8-def456",
      })
      expect(replication.replicate).toHaveBeenCalledWith({ doc_ids: ["doc1"] })
    })

    it("should not remove documents without inconsistencies", async () => {
      const sourceDoc = { _id: "doc1", _rev: "8-abc123" }
      const targetDoc = { _id: "doc1", _rev: "5-def456" }

      mockSourceDb.get.mockResolvedValue(sourceDoc)
      mockTargetDb.get.mockResolvedValue(targetDoc)

      await replication.resolveInconsistencies(["doc1"])

      expect(mockTargetDb.remove).not.toHaveBeenCalled()
      expect(replication.replicate).not.toHaveBeenCalled()
    })
  })
})
