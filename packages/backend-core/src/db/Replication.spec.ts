import { DocumentType } from "@budibase/types"
import { DesignDocuments, SEPARATOR, USER_METADATA_PREFIX } from "../constants"
import Replication from "./Replication"

const mockDirectCouchCall = jest.fn()

jest.mock("./couch/utils", () => ({
  directCouchCall: (...args: unknown[]) => mockDirectCouchCall(...args),
}))

const mockSourceDb = {
  replicate: {
    to: jest.fn(),
  },
  name: "source_db",
  get: jest.fn(),
  put: jest.fn(),
  changes: jest.fn(),
}

const mockTargetDb = {
  destroy: jest.fn(),
  name: "target_db",
  get: jest.fn(),
  put: jest.fn(),
  remove: jest.fn(),
  allDocs: jest.fn(),
  changes: jest.fn(),
}

jest.mock("./couch", () => ({
  getPouchDB: jest.fn((name: string) =>
    name === mockSourceDb.name || name.startsWith("app_dev_")
      ? mockSourceDb
      : mockTargetDb
  ),
}))

describe("Replication", () => {
  describe("replicateApp", () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockSourceDb.changes = jest.fn()
      mockTargetDb.allDocs = jest.fn()
      mockTargetDb.changes = jest.fn()
      mockDirectCouchCall.mockImplementation(
        async (
          _path: string,
          _method: string,
          body: Record<string, string[]>
        ) => ({
          ok: true,
          status: 200,
          json: async () => ({ purged: body }),
        })
      )
    })

    it("replicates only new deletions for documents still live in production", async () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      jest.spyOn(replication, "replicate").mockResolvedValue({} as any)
      mockTargetDb.get.mockRejectedValue({ status: 404 })
      const deletedChanges = [
        {
          id: "active_doc",
          deleted: true,
          changes: [{ rev: "2-active" }],
          doc: { _id: "active_doc", _rev: "2-active", _deleted: true },
        },
        {
          id: "absent_doc",
          deleted: true,
          changes: [{ rev: "2-absent" }],
          doc: { _id: "absent_doc", _rev: "2-absent", _deleted: true },
        },
      ]
      mockSourceDb.changes.mockImplementation(
        async (options: { doc_ids?: string[] }) =>
          options.doc_ids
            ? {
                results: deletedChanges.filter(change =>
                  options.doc_ids?.includes(change.id)
                ),
              }
            : {
                last_seq: "seq-2",
                results: [
                  ...deletedChanges,
                  { id: "live_doc", deleted: false },
                ],
              }
      )
      mockTargetDb.changes.mockImplementation(
        async (options: { doc_ids?: string[] }) => ({
          results:
            options.doc_ids?.[0] === "active_doc" ? [deletedChanges[0]] : [],
        })
      )
      mockTargetDb.allDocs.mockResolvedValue({
        rows: [
          { id: "active_doc", value: { rev: "2-a" } },
          { key: "absent_doc", error: "not_found" },
        ],
      })

      await replication.replicateApp()

      const replicationOptions = jest.mocked(replication.replicate).mock
        .calls[0][0]
      if (!replicationOptions) {
        throw new Error("Expected replication options")
      }
      expect(replicationOptions.selector).toEqual(
        expect.objectContaining({
          $and: expect.arrayContaining([
            expect.objectContaining({
              $and: expect.arrayContaining([{ _id: { $in: ["active_doc"] } }]),
            }),
          ]),
        })
      )
      expect(mockSourceDb.changes).toHaveBeenCalledWith({
        since: 0,
        limit: 500,
        include_docs: true,
        style: "all_docs",
      })
      expect(mockTargetDb.put).toHaveBeenCalledWith({
        _id: "_local/budibase-publish-tombstones",
        lastSequence: "seq-2",
      })
    })

    it("does not advance its tombstone cursor if replication fails", async () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      jest.spyOn(replication, "replicate").mockRejectedValue(new Error("fail"))
      mockTargetDb.get.mockRejectedValue({ status: 404 })
      mockSourceDb.changes.mockResolvedValue({
        last_seq: 12,
        results: [],
      })

      await expect(replication.replicateApp()).rejects.toThrow("fail")
      expect(mockTargetDb.put).not.toHaveBeenCalled()
    })

    it("resumes tombstone detection from the saved sequence", async () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      jest.spyOn(replication, "replicate").mockResolvedValue({} as any)
      mockTargetDb.get.mockResolvedValue({
        _id: "_local/budibase-publish-tombstones",
        _rev: "0-1",
        lastSequence: "seq-1",
      })
      mockSourceDb.changes.mockResolvedValue({ last_seq: "seq-2", results: [] })

      await replication.replicateApp()

      expect(mockSourceDb.changes).toHaveBeenCalledWith({
        since: "seq-1",
        limit: 500,
        include_docs: true,
        style: "all_docs",
      })
    })

    it("paginates the tombstone change scan", async () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      jest.spyOn(replication, "replicate").mockResolvedValue({} as any)
      mockTargetDb.get.mockRejectedValue({ status: 404 })
      mockSourceDb.changes
        .mockResolvedValueOnce({
          last_seq: "seq-2",
          results: Array.from({ length: 500 }, (_, index) => ({
            id: `doc-${index}`,
            deleted: false,
            seq: "seq-1",
          })),
        })
        .mockResolvedValueOnce({ last_seq: "seq-2", results: [] })

      await replication.replicateApp()

      expect(mockSourceDb.changes).toHaveBeenNthCalledWith(2, {
        since: "seq-1",
        limit: 500,
        include_docs: true,
        style: "all_docs",
      })
      expect(mockTargetDb.put).toHaveBeenCalledWith({
        _id: "_local/budibase-publish-tombstones",
        lastSequence: "seq-2",
      })
    })

    it("chunks target lookups and tombstone selectors", async () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      jest.spyOn(replication, "replicate").mockResolvedValue({} as any)
      mockTargetDb.get.mockRejectedValue({ status: 404 })
      const changes = Array.from({ length: 401 }, (_, index) => ({
        id: `doc-${index}`,
        deleted: true,
        changes: [{ rev: `2-${index}` }],
        doc: { _id: `doc-${index}`, _rev: `2-${index}`, _deleted: true },
      }))
      mockSourceDb.changes.mockResolvedValue({
        last_seq: "seq-1",
        results: changes,
      })
      mockTargetDb.allDocs.mockImplementation(({ keys }: { keys: string[] }) =>
        Promise.resolve({
          rows: keys.map(id => ({ id, value: { rev: "1-a" } })),
        })
      )
      mockTargetDb.changes.mockImplementation(
        async (options: { doc_ids?: string[] }) => ({
          results: changes.filter(change =>
            options.doc_ids?.includes(change.id)
          ),
        })
      )

      await replication.replicateApp()

      expect(mockTargetDb.allDocs).toHaveBeenCalledTimes(3)
      for (const [options] of mockTargetDb.allDocs.mock.calls) {
        expect(options.keys.length).toBeLessThanOrEqual(200)
      }
      const tombstoneSelectors = jest
        .mocked(replication.replicate)
        .mock.calls.slice(0, 3)
        .map(([options]) => JSON.stringify(options?.selector))
      expect(tombstoneSelectors).toHaveLength(3)
      for (const selector of tombstoneSelectors) {
        expect(selector.length).toBeLessThan(20_000)
      }
    })

    it("limits cleanup work and retains the checkpoint for a large backlog", async () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      jest.spyOn(replication, "replicate").mockResolvedValue({} as any)
      mockTargetDb.get.mockRejectedValue({ status: 404 })
      const changes = [
        ...Array.from({ length: 1200 }, (_, index) => ({
          id: `doc-${index}`,
          deleted: true,
          changes: [{ rev: `2-${index}` }],
          doc: { _id: `doc-${index}`, _rev: `2-${index}`, _deleted: true },
        })),
        {
          id: "doc-0",
          deleted: true,
          changes: [{ rev: "3-0" }],
          doc: { _id: "doc-0", _rev: "3-0", _deleted: true },
        },
      ]
      const scanBatches = [
        changes.slice(0, 500).map(change => ({
          ...change,
          seq: "seq-1",
        })),
        changes.slice(500, 1000).map(change => ({
          ...change,
          seq: "seq-2",
        })),
        changes.slice(1000).map(change => ({
          ...change,
          seq: "seq-3",
        })),
      ]
      mockSourceDb.changes.mockImplementation(
        async (options: { doc_ids?: string[]; since?: string | number }) => {
          if (options.doc_ids) {
            return {
              results: changes.filter(change =>
                options.doc_ids?.includes(change.id)
              ),
            }
          }
          const batch =
            options.since === 0
              ? scanBatches[0]
              : options.since === "seq-1"
                ? scanBatches[1]
                : scanBatches[2]
          return { last_seq: "seq-3", results: batch }
        }
      )
      mockTargetDb.allDocs.mockImplementation(({ keys }: { keys: string[] }) =>
        Promise.resolve({
          rows: keys.map(id => ({ id, value: { rev: "1-live" } })),
        })
      )
      mockTargetDb.changes.mockImplementation(
        async (options: { doc_ids?: string[] }) => ({
          results: changes.filter(change =>
            options.doc_ids?.includes(change.id)
          ),
        })
      )

      await replication.replicateApp()

      expect(mockTargetDb.changes).toHaveBeenCalledTimes(5)
      expect(mockDirectCouchCall).toHaveBeenCalledTimes(10)
      expect(mockDirectCouchCall.mock.calls[0][2]).toEqual(
        expect.objectContaining({ "doc-0": ["3-0"] })
      )
      expect(mockTargetDb.put).not.toHaveBeenCalled()
    })

    it("does not advance the tombstone cursor when CouchDB reports write failures", async () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      jest
        .spyOn(replication, "replicate")
        .mockResolvedValue({ doc_write_failures: 1 } as any)
      mockTargetDb.get.mockRejectedValue({ status: 404 })
      mockSourceDb.changes.mockResolvedValue({
        last_seq: 12,
        results: [
          {
            id: "deleted_doc",
            deleted: true,
            changes: [{ rev: "2-deleted" }],
            doc: {
              _id: "deleted_doc",
              _rev: "2-deleted",
              _deleted: true,
            },
          },
        ],
      })
      mockTargetDb.allDocs.mockResolvedValue({
        rows: [{ id: "deleted_doc", value: { rev: "1-live" } }],
      })

      await replication.replicateApp()

      expect(mockTargetDb.put).not.toHaveBeenCalled()
      expect(mockDirectCouchCall).not.toHaveBeenCalled()
    })

    it("does not advance the global cursor during a scoped publish", async () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      jest.spyOn(replication, "replicate").mockResolvedValue({} as any)
      mockTargetDb.get.mockRejectedValue({ status: 404 })
      mockSourceDb.changes.mockResolvedValue({ last_seq: "seq-2", results: [] })

      await replication.replicateApp({ tablesToSync: ["orders"] })

      expect(mockTargetDb.put).not.toHaveBeenCalled()
    })

    it("purges a confirmed tombstone from production and dev after publish", async () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      jest.spyOn(replication, "replicate").mockResolvedValue({} as any)
      mockTargetDb.get.mockRejectedValue({ status: 404 })
      const tombstone = {
        id: "deleted_doc",
        deleted: true,
        changes: [{ rev: "2-deleted" }],
      }
      const liveChange = {
        id: "deleted_doc",
        deleted: false,
        changes: [{ rev: "1-live" }],
      }
      mockSourceDb.changes.mockImplementation(
        async (options: { doc_ids?: string[] }) =>
          options.doc_ids
            ? { results: [liveChange, tombstone] }
            : { last_seq: "seq-2", results: [tombstone] }
      )
      mockTargetDb.allDocs.mockResolvedValue({
        rows: [{ id: "deleted_doc", value: { rev: "1-live" } }],
      })
      mockTargetDb.changes.mockResolvedValue({
        results: [liveChange, tombstone],
      })

      await replication.replicateApp()

      expect(mockDirectCouchCall).toHaveBeenNthCalledWith(
        1,
        `${DocumentType.WORKSPACE}_target/_purge`,
        "POST",
        { deleted_doc: ["2-deleted"] }
      )
      expect(mockDirectCouchCall).toHaveBeenNthCalledWith(
        2,
        `${DocumentType.WORKSPACE_DEV}_source/_purge`,
        "POST",
        { deleted_doc: ["2-deleted"] }
      )
    })

    it("purges excluded row tombstones from dev during a normal publish", async () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      jest.spyOn(replication, "replicate").mockResolvedValue({} as any)
      mockTargetDb.get.mockRejectedValue({ status: 404 })
      const tombstone = {
        id: `${DocumentType.ROW}${SEPARATOR}orders${SEPARATOR}row1`,
        deleted: true,
        changes: [{ rev: "2-deleted" }],
      }
      mockSourceDb.changes.mockImplementation(
        async (options: { doc_ids?: string[] }) =>
          options.doc_ids
            ? { results: [tombstone] }
            : { last_seq: "seq-2", results: [tombstone] }
      )

      await replication.replicateApp({ isCreation: false })

      expect(mockDirectCouchCall).toHaveBeenCalledWith(
        `${DocumentType.WORKSPACE_DEV}_source/_purge`,
        "POST",
        { [tombstone.id]: ["2-deleted"] }
      )
      expect(mockDirectCouchCall).not.toHaveBeenCalledWith(
        `${DocumentType.WORKSPACE}_target/_purge`,
        "POST",
        expect.anything()
      )
      expect(mockTargetDb.put).toHaveBeenCalledWith({
        _id: "_local/budibase-publish-tombstones",
        lastSequence: "seq-2",
      })
    })

    it("does not purge tombstones with conflicting leaf revisions", async () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      jest.spyOn(replication, "replicate").mockResolvedValue({} as any)
      mockTargetDb.get.mockRejectedValue({ status: 404 })
      const tombstone = {
        id: "deleted_doc",
        deleted: true,
        changes: [{ rev: "2-deleted" }],
        doc: { _id: "deleted_doc", _rev: "2-deleted", _deleted: true },
      }
      mockSourceDb.changes.mockImplementation(
        async (options: { doc_ids?: string[] }) =>
          options.doc_ids
            ? { results: [tombstone] }
            : { last_seq: "seq-2", results: [tombstone] }
      )
      mockTargetDb.allDocs.mockResolvedValue({
        rows: [{ id: "deleted_doc", value: { rev: "1-live" } }],
      })
      mockTargetDb.changes.mockResolvedValue({
        results: [
          {
            ...tombstone,
            changes: [{ rev: "2-deleted" }, { rev: "2-live-conflict" }],
          },
        ],
      })

      await replication.replicateApp()

      expect(mockDirectCouchCall).not.toHaveBeenCalled()
      expect(mockTargetDb.put).not.toHaveBeenCalled()
    })

    it("replicates shared resource tombstones with conflicting leaf revisions", async () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      jest.spyOn(replication, "replicate").mockResolvedValue({} as any)
      mockTargetDb.get.mockRejectedValue({ status: 404 })
      const tombstone = {
        id: `${DocumentType.AUTOMATION}${SEPARATOR}automation1`,
        deleted: true,
        changes: [{ rev: "2-deleted" }, { rev: "2-conflict" }],
        doc: {
          _id: `${DocumentType.AUTOMATION}${SEPARATOR}automation1`,
          _rev: "2-deleted",
          _deleted: true,
        },
      }
      mockSourceDb.changes.mockImplementation(
        async (options: { doc_ids?: string[] }) =>
          options.doc_ids
            ? { results: [tombstone] }
            : { last_seq: "seq-2", results: [tombstone] }
      )
      mockTargetDb.allDocs.mockResolvedValue({
        rows: [{ id: tombstone.id, value: { rev: "1-live" } }],
      })

      await replication.replicateApp()

      expect(replication.replicate).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            $and: expect.arrayContaining([
              expect.objectContaining({
                $and: expect.arrayContaining([
                  { _id: { $in: [tombstone.id] } },
                ]),
              }),
            ]),
          }),
        })
      )
      expect(mockDirectCouchCall).not.toHaveBeenCalled()
      expect(mockTargetDb.put).toHaveBeenCalledWith({
        _id: "_local/budibase-publish-tombstones",
        lastSequence: "seq-2",
      })
    })
  })

  describe("replicate", () => {
    it("preserves custom filters when a selector is provided", async () => {
      const complete = {}
      const on = jest.fn()
      on.mockImplementation(
        (event: string, callback: (info: object) => void) => {
          if (event === "complete") {
            callback(complete)
          }
          return { on }
        }
      )
      mockSourceDb.replicate.to.mockReturnValue({ on })

      const replication = new Replication({
        source: mockSourceDb.name,
        target: mockTargetDb.name,
      })
      const filter = jest.fn()
      const opts = {
        selector: { _id: "keep" },
        filter,
      }

      await replication.replicate(opts)

      expect(mockSourceDb.replicate.to).toHaveBeenCalledWith(mockTargetDb, opts)
      expect(opts.filter).toBe(filter)
    })
  })

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

    it("should reject tombstones that were not confirmed on production", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: false })

      const deletedDoc = {
        _id: "some_doc",
        _deleted: true,
      }

      expect((opts.filter as Function)(deletedDoc, {})).toBe(false)
      expect(JSON.stringify(opts.selector)).not.toContain('"_deleted"')
    })

    it("should allow confirmed production tombstones through the selector and filter", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      const opts = replication.appReplicateOpts({
        isCreation: false,
        tombstoneIds: ["deleted_doc"],
      })
      const deletedDoc = { _id: "deleted_doc", _deleted: true }

      expect((opts.filter as Function)(deletedDoc, {})).toBe(true)
      expect(JSON.stringify(opts.selector)).toContain('"$in":["deleted_doc"]')
      expect(opts).not.toHaveProperty("tombstoneIds")
    })

    it("should replicate deleted documents when syncing to development", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE}_source`,
        target: `${DocumentType.WORKSPACE_DEV}_target`,
      })
      const opts = replication.appReplicateOpts({ isCreation: false })

      expect(
        (opts.filter as Function)({ _id: "some_doc", _deleted: true }, {})
      ).toBe(true)
      expect(opts.selector).toEqual(
        expect.objectContaining({
          $and: expect.arrayContaining([
            expect.objectContaining({
              $or: expect.arrayContaining([{ _deleted: true }]),
            }),
          ]),
        })
      )
    })

    it.each([
      {
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      },
      {
        source: `${DocumentType.WORKSPACE}_source`,
        target: `${DocumentType.WORKSPACE_DEV}_target`,
      },
    ])(
      "should filter out Slack app config documents in both directions",
      ({ source, target }) => {
        const replication = new Replication({ source, target })
        const opts = replication.appReplicateOpts({ isCreation: true })

        expect(
          (opts.filter as Function)(
            { _id: `${DocumentType.SLACK_APP_CONFIG}_config` },
            {}
          )
        ).toBe(false)
      }
    )

    it("should filter out Slack app config tombstones", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      const opts = replication.appReplicateOpts({ isCreation: false })

      expect(
        (opts.filter as Function)(
          {
            _id: `${DocumentType.SLACK_APP_CONFIG}_config`,
            _deleted: true,
          },
          {}
        )
      ).toBe(false)
    })

    it("should only replicate user metadata when its table is selected", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      const userMetadataDoc = {
        _id: `${USER_METADATA_PREFIX}global-user-id`,
      }

      const opts = replication.appReplicateOpts({ isCreation: false })

      expect((opts.filter as Function)(userMetadataDoc, {})).toBe(false)

      const selectedTableOpts = replication.appReplicateOpts({
        isCreation: false,
        tablesToSync: ["ta_users"],
      })

      expect((selectedTableOpts.filter as Function)(userMetadataDoc, {})).toBe(
        true
      )
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

    it("should return opts unchanged other than a default batch_size when filter is string", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE}_source`,
        target: `${DocumentType.WORKSPACE_DEV}_target`,
      })

      const inputOpts = {
        filter: "design/myfilter",
        isCreation: true,
      }

      const opts = replication.appReplicateOpts(inputOpts)

      expect(opts).toBe(inputOpts)
      expect(opts).not.toHaveProperty("selector")
      expect(opts.batch_size).toBe(1000)
    })

    it("should not override a caller-provided batch_size when filter is string", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE}_source`,
        target: `${DocumentType.WORKSPACE_DEV}_target`,
      })

      const inputOpts = {
        filter: "design/myfilter",
        isCreation: true,
        batch_size: 42,
      }

      const opts = replication.appReplicateOpts(inputOpts)

      expect(opts.batch_size).toBe(42)
    })

    it("should reject named filters when replicating to production", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })

      expect(() =>
        replication.appReplicateOpts({ filter: "design/myfilter" })
      ).toThrow(
        "Named CouchDB filters cannot be used when replicating to production"
      )
    })

    it("should attach a native selector when no custom filter is provided", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: false })

      expect(opts.selector).toBeInstanceOf(Object)
      const selectorJSON = JSON.stringify(opts.selector)
      expect(selectorJSON).toContain(DocumentType.SLACK_APP_CONFIG)
      expect(selectorJSON).toContain(DesignDocuments.MIGRATIONS)
      expect(selectorJSON).toContain(DocumentType.AUTOMATION_LOG)
      expect(selectorJSON).toContain(DocumentType.AGENT_LOG_SESSION)
      expect(selectorJSON).toContain(DocumentType.WORKSPACE_METADATA)
      expect(selectorJSON).toContain(DocumentType.AUTO_COLUMN_STATE)
      expect(selectorJSON).not.toContain('"_deleted"')
    })

    it("should leave tombstone filtering to the replication filter", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: false })

      expect(JSON.stringify(opts.selector)).not.toContain('"_deleted"')
    })

    it("should exclude design documents from the TO_DEV selector", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE}_source`,
        target: `${DocumentType.WORKSPACE_DEV}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: true })

      expect(opts.selector).toEqual(
        expect.objectContaining({
          $and: expect.arrayContaining([
            { $nor: [{ _id: { $regex: "^_design" } }] },
          ]),
        })
      )
    })

    it("should allow auto column state in creation selectors", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: true })

      const selectorJSON = JSON.stringify(opts.selector)
      expect(selectorJSON).not.toContain(
        `${DocumentType.AUTO_COLUMN_STATE}${SEPARATOR}`
      )
    })

    it("should include only selected table data in the selector", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })

      const opts = replication.appReplicateOpts({
        isCreation: true,
        tablesToSync: ["ta_orders"],
      })

      expect(JSON.stringify(opts.selector)).toContain('"ta_orders"')
      expect(JSON.stringify(opts.selector)).toContain(
        `"^${DocumentType.ROW}${SEPARATOR}"`
      )
      expect(JSON.stringify(opts.selector)).toContain(
        `"^${DocumentType.LINK}${SEPARATOR}"`
      )
    })

    it("should apply publish scope and type exclusions to confirmed tombstones", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      const filter = jest.fn().mockReturnValue(true)
      const opts = replication.appReplicateOpts({
        isCreation: false,
        tablesToSync: ["orders"],
        tombstoneIds: [
          `${DocumentType.ROW}${SEPARATOR}orders${SEPARATOR}row1`,
          `${DocumentType.ROW}${SEPARATOR}customers${SEPARATOR}row1`,
          `${DocumentType.AUTOMATION_LOG}${SEPARATOR}log1`,
        ],
        filter,
      })
      const appFilter = opts.filter as Function

      expect(
        appFilter(
          {
            _id: `${DocumentType.ROW}${SEPARATOR}orders${SEPARATOR}row1`,
            _deleted: true,
          },
          {}
        )
      ).toBe(true)
      expect(
        appFilter(
          {
            _id: `${DocumentType.ROW}${SEPARATOR}customers${SEPARATOR}row1`,
            _deleted: true,
          },
          {}
        )
      ).toBe(false)
      expect(
        appFilter(
          {
            _id: `${DocumentType.AUTOMATION_LOG}${SEPARATOR}log1`,
            _deleted: true,
          },
          {}
        )
      ).toBe(false)
      expect(filter).toHaveBeenCalledTimes(1)

      const selector = JSON.stringify(opts.selector)
      expect(selector).toContain('"$in":["' + DocumentType.ROW)
      expect(selector).toContain(DocumentType.AUTOMATION_LOG)
      expect(selector).toContain('"orders"')
    })

    it("should allow custom-filter-scoped row tombstones in the Mango selector", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      const rowId = `${DocumentType.ROW}${SEPARATOR}orders${SEPARATOR}row1`
      const opts = replication.appReplicateOpts({
        tombstoneIds: [rowId],
        tombstonesOnly: true,
        filter: doc => doc._id === rowId,
      })
      const selector = opts.selector as { $and: object[] }

      expect(selector.$and[2]).toEqual({
        $and: expect.arrayContaining([{ _id: { $in: [rowId] } }]),
      })
    })

    it("should combine a caller selector with the generated selector", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })
      const callerSelector = {
        _id: { $regex: "^ta_orders_" },
      }

      const opts = replication.appReplicateOpts({
        isCreation: true,
        selector: callerSelector,
      })

      expect(opts.selector).toEqual({
        $and: [
          callerSelector,
          expect.objectContaining({
            $and: expect.any(Array),
          }),
        ],
      })
    })

    it("should attach a tombstone selector when a custom filter is provided for production", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })

      const opts = replication.appReplicateOpts({
        isCreation: true,
        filter: jest.fn(),
      })

      expect(JSON.stringify(opts.selector)).not.toContain('"_deleted"')
    })

    it("should not attach a selector when a custom filter is provided to dev", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE}_source`,
        target: `${DocumentType.WORKSPACE_DEV}_target`,
      })

      const opts = replication.appReplicateOpts({
        isCreation: true,
        filter: jest.fn(),
      })

      expect(opts.selector).toBeUndefined()
    })

    it("should default batch_size to 1000", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })

      const opts = replication.appReplicateOpts({ isCreation: true })

      expect(opts.batch_size).toBe(1000)
    })

    it("should not override a caller-provided batch_size", () => {
      const replication = new Replication({
        source: `${DocumentType.WORKSPACE_DEV}_source`,
        target: `${DocumentType.WORKSPACE}_target`,
      })

      const opts = replication.appReplicateOpts({
        isCreation: true,
        batch_size: 42,
      })

      expect(opts.batch_size).toBe(42)
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

  describe("replicationDelta", () => {
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
        expected: 3,
        description: "target has higher revision",
      },
      {
        sourceRev: "10-abc123",
        targetRev: "8-def456",
        expected: -2,
        description: "source has higher revision",
      },
      {
        sourceRev: "5-abc123",
        targetRev: "5-def456",
        expected: 0,
        description: "revisions are equal",
      },
    ])(
      "should return $expected when $description",
      ({ sourceRev, targetRev, expected }) => {
        const sourceDoc = { _rev: sourceRev }
        const targetDoc = { _rev: targetRev }

        const hasInconsistency = (replication as any).replicationDelta(
          sourceDoc,
          targetDoc
        )
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

    it("should bump source revisions when target is ahead", async () => {
      const sourceDoc = { _id: "doc1", _rev: "5-abc123" }
      const targetDoc = { _id: "doc1", _rev: "8-def456" }

      mockSourceDb.get.mockResolvedValue(sourceDoc)
      mockTargetDb.get.mockResolvedValue(targetDoc)

      await replication.resolveInconsistencies(["doc1"])

      expect(mockSourceDb.put).toHaveBeenCalledTimes(4) // the target is ahead of source 3 versions. Loop executes 4 times to ensure source rev exceeds target
      expect(mockTargetDb.remove).not.toHaveBeenCalled()
      expect(replication.replicate).not.toHaveBeenCalled()
    })

    it("should skip documents without inconsistencies", async () => {
      const sourceDoc = { _id: "doc1", _rev: "8-abc123" }
      const targetDoc = { _id: "doc1", _rev: "5-def456" }

      mockSourceDb.get.mockResolvedValue(sourceDoc)
      mockTargetDb.get.mockResolvedValue(targetDoc)

      await replication.resolveInconsistencies(["doc1"])

      expect(mockSourceDb.put).not.toHaveBeenCalled()
      expect(mockTargetDb.remove).not.toHaveBeenCalled()
      expect(replication.replicate).not.toHaveBeenCalled()
    })
  })
})
