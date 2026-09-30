import {
  Plugin,
  PluginSource,
  PluginType,
  Screen,
  ScreenProps,
  Workspace,
} from "@budibase/types"
import {
  findPluginsInProps,
  areUsedPluginReferencesEqual,
  addUsedPluginsForScreen,
  reconcileWorkspaceUsedPlugins,
  filterExistingUsedPlugins,
  enrichUsedPluginsWithSvelteMajor,
} from "./usedPlugins"
import { cache, context, db as dbCore, tenancy } from "@budibase/backend-core"
import { DocumentType } from "../../db/utils"

jest.mock("@budibase/backend-core", () => {
  const original = jest.requireActual("@budibase/backend-core")
  return {
    ...original,
    cache: {
      ...original.cache,
      workspace: {
        ...original.cache?.workspace,
        invalidateWorkspaceMetadata: jest.fn(),
      },
    },
    context: {
      ...original.context,
      doInWorkspaceContext: jest.fn((workspaceId, fn) => fn()),
      getWorkspaceDB: jest.fn(),
    },
    tenancy: {
      ...original.tenancy,
      getGlobalDB: jest.fn(),
    },
  }
})

describe("usedPlugins", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("findPluginsInProps", () => {
    it("returns empty set when component is undefined", () => {
      const result = findPluginsInProps(undefined)
      expect(result.size).toBe(0)
    })

    it("ignores standard core components", () => {
      const props: ScreenProps = {
        _id: "c1",
        _component: "@budibase/standard-components/container",
        _children: [
          {
            _id: "c2",
            _component: "@budibase/standard-components/text",
          } as any,
        ],
      } as any
      const result = findPluginsInProps(props)
      expect(result.size).toBe(0)
    })

    it("finds top-level and deeply nested plugin components", () => {
      const props: ScreenProps = {
        _id: "c1",
        _component: "plugin/my-custom-chart",
        _children: [
          {
            _id: "c2",
            _component: "@budibase/standard-components/container",
            _children: [
              {
                _id: "c3",
                _component: "plugin/my-custom-button",
              } as any,
            ],
          } as any,
        ],
      } as any
      const result = findPluginsInProps(props)
      expect(result.has("plugin/my-custom-chart")).toBe(true)
      expect(result.has("plugin/my-custom-button")).toBe(true)
      expect(result.size).toBe(2)
    })
  })

  describe("areUsedPluginReferencesEqual", () => {
    const pluginA: Plugin = {
      _id: "plugin_a",
      name: "Plugin A",
      version: "1.0.0",
      hash: "hash_123",
      jsUrl: "/api/assets/plugins/plugin_a/index.js",
    } as Plugin

    const pluginB: Plugin = {
      _id: "plugin_b",
      name: "Plugin B",
      version: "2.0.0",
      hash: "hash_456",
      jsUrl: "/api/assets/plugins/plugin_b/index.js",
    } as Plugin

    it("returns true for arrays with equivalent plugin values", () => {
      expect(
        areUsedPluginReferencesEqual(
          [pluginA, pluginB],
          [{ ...pluginA }, { ...pluginB }]
        )
      ).toBe(true)
    })

    it("returns true regardless of order", () => {
      expect(
        areUsedPluginReferencesEqual(
          [pluginA, pluginB],
          [{ ...pluginB }, { ...pluginA }]
        )
      ).toBe(true)
    })

    it("returns false if length is different", () => {
      expect(areUsedPluginReferencesEqual([pluginA], [pluginA, pluginB])).toBe(
        false
      )
    })

    it("returns false if hash changes", () => {
      const pluginAUpdated = { ...pluginA, hash: "hash_999" }
      expect(areUsedPluginReferencesEqual([pluginA], [pluginAUpdated])).toBe(
        false
      )
    })

    it("returns false if jsUrl changes", () => {
      const pluginAUpdated = {
        ...pluginA,
        jsUrl: "/api/assets/plugins/plugin_a/v2.js",
      }
      expect(areUsedPluginReferencesEqual([pluginA], [pluginAUpdated])).toBe(
        false
      )
    })
  })

  describe("addUsedPluginsForScreen", () => {
    it("returns false immediately if screen has no plugins", async () => {
      const props: ScreenProps = {
        _id: "c1",
        _component: "@budibase/standard-components/container",
      } as any
      const result = await addUsedPluginsForScreen(props, "ws_1")
      expect(result).toBe(false)
      expect(context.doInWorkspaceContext).not.toHaveBeenCalled()
      expect(tenancy.getGlobalDB).not.toHaveBeenCalled()
      expect(context.getWorkspaceDB).not.toHaveBeenCalled()
    })

    it("adds missing plugin, saves metadata, and invalidates cache", async () => {
      const props: ScreenProps = {
        _id: "c1",
        _component: "plugin/custom-table",
      } as any

      const customTableId = dbCore.generatePluginID("custom-table")

      const globalDB = {
        allDocs: jest.fn().mockResolvedValue({
          rows: [
            {
              doc: {
                _id: customTableId,
                name: "custom-table",
                version: "1.0.0",
                hash: "hash_tbl",
                jsUrl: "/api/assets/plugins/plugin_tbl/index.js",
                schema: { type: PluginType.COMPONENT },
              },
            },
          ],
        }),
      }
      ;(tenancy.getGlobalDB as jest.Mock).mockReturnValue(globalDB)

      const mockWorkspaceDoc: Workspace = {
        _id: DocumentType.WORKSPACE_METADATA,
        usedPlugins: [],
      } as any

      const workspaceDB = {
        get: jest.fn().mockResolvedValue(mockWorkspaceDoc),
        put: jest.fn().mockResolvedValue({ ok: true }),
      }
      ;(context.getWorkspaceDB as jest.Mock).mockReturnValue(workspaceDB)

      const result = await addUsedPluginsForScreen(props, "ws_1")

      expect(result).toBe(true)
      expect(globalDB.allDocs).toHaveBeenCalledWith({
        keys: [customTableId],
        include_docs: true,
      })
      expect(workspaceDB.put).toHaveBeenCalledWith(
        expect.objectContaining({
          usedPlugins: [
            expect.objectContaining({
              _id: customTableId,
              name: "custom-table",
            }),
          ],
        })
      )
      expect(cache.workspace.invalidateWorkspaceMetadata).toHaveBeenCalledWith(
        "ws_1"
      )
    })
  })

  describe("reconcileWorkspaceUsedPlugins", () => {
    it("prunes unused plugins and invalidates metadata cache", async () => {
      const activePluginId = dbCore.generatePluginID("active-plugin")
      const unusedPluginId = dbCore.generatePluginID("unused-plugin")

      const globalPlugins = [
        {
          _id: activePluginId,
          name: "active-plugin",
          version: "1.0.0",
          hash: "hash_active",
          jsUrl: "/api/assets/plugins/plugin_active/index.js",
          schema: { type: PluginType.COMPONENT },
        },
        {
          _id: unusedPluginId,
          name: "unused-plugin",
          version: "1.0.0",
          hash: "hash_unused",
          jsUrl: "/api/assets/plugins/plugin_unused/index.js",
          schema: { type: PluginType.COMPONENT },
        },
      ]
      const globalDB = {
        allDocs: jest
          .fn()
          .mockImplementation(({ keys }: { keys?: string[] } = {}) => {
            const rows = keys
              ? globalPlugins
                  .filter(p => keys.includes(p._id))
                  .map(p => ({ id: p._id, doc: p }))
              : globalPlugins.map(p => ({ id: p._id, doc: p }))
            return Promise.resolve({ rows })
          }),
      }
      ;(tenancy.getGlobalDB as jest.Mock).mockReturnValue(globalDB)

      const mockScreens: Screen[] = [
        {
          _id: "screen_1",
          props: {
            _id: "c1",
            _component: "plugin/active-plugin",
          },
        } as any,
      ]

      const mockWorkspaceDoc: Workspace = {
        _id: DocumentType.WORKSPACE_METADATA,
        usedPlugins: [
          {
            _id: activePluginId,
            name: "active-plugin",
            version: "1.0.0",
            hash: "hash_active",
            jsUrl: "/api/assets/plugins/plugin_active/index.js",
          } as Plugin,
          {
            _id: unusedPluginId,
            name: "unused-plugin",
            version: "1.0.0",
            hash: "hash_unused",
            jsUrl: "/api/assets/plugins/plugin_unused/index.js",
          } as Plugin,
        ],
      } as any

      const workspaceDB = {
        allDocs: jest.fn().mockResolvedValue({
          rows: mockScreens.map(s => ({ doc: s })),
        }),
        get: jest.fn().mockResolvedValue(mockWorkspaceDoc),
        put: jest.fn().mockResolvedValue({ ok: true }),
      }
      ;(context.getWorkspaceDB as jest.Mock).mockReturnValue(workspaceDB)

      const result = await reconcileWorkspaceUsedPlugins("ws_1")

      expect(result).toBe(true)
      expect(workspaceDB.put).toHaveBeenCalledWith(
        expect.objectContaining({
          usedPlugins: [
            expect.objectContaining({
              _id: activePluginId,
              name: "active-plugin",
            }),
          ],
        })
      )
      expect(cache.workspace.invalidateWorkspaceMetadata).toHaveBeenCalledWith(
        "ws_1"
      )
    })

    it("returns false and does not write if usedPlugins is already up to date", async () => {
      const activePluginId = dbCore.generatePluginID("active-plugin")

      const globalDB = {
        allDocs: jest.fn().mockResolvedValue({
          rows: [
            {
              doc: {
                _id: activePluginId,
                name: "active-plugin",
                version: "1.0.0",
                hash: "hash_active",
                jsUrl: "/api/assets/plugins/plugin_active/index.js",
                schema: { type: PluginType.COMPONENT },
              },
            },
          ],
        }),
      }
      ;(tenancy.getGlobalDB as jest.Mock).mockReturnValue(globalDB)

      const mockScreens: Screen[] = [
        {
          _id: "screen_1",
          props: {
            _id: "c1",
            _component: "plugin/active-plugin",
          },
        } as any,
      ]

      const mockWorkspaceDoc: Workspace = {
        _id: DocumentType.WORKSPACE_METADATA,
        usedPlugins: [
          {
            _id: activePluginId,
            name: "active-plugin",
            version: "1.0.0",
            hash: "hash_active",
            jsUrl: "/api/assets/plugins/plugin_active/index.js",
          } as Plugin,
        ],
      } as any

      const workspaceDB = {
        allDocs: jest.fn().mockResolvedValue({
          rows: mockScreens.map(s => ({ doc: s })),
        }),
        get: jest.fn().mockResolvedValue(mockWorkspaceDoc),
        put: jest.fn(),
      }
      ;(context.getWorkspaceDB as jest.Mock).mockReturnValue(workspaceDB)

      const result = await reconcileWorkspaceUsedPlugins("ws_1")

      expect(result).toBe(false)
      expect(workspaceDB.put).not.toHaveBeenCalled()
      expect(cache.workspace.invalidateWorkspaceMetadata).not.toHaveBeenCalled()
    })
  })

  describe("filterExistingUsedPlugins", () => {
    it("returns empty array for empty input", async () => {
      expect(await filterExistingUsedPlugins([])).toEqual([])
      expect(await filterExistingUsedPlugins(undefined)).toEqual([])
    })

    it("filters out missing or deleted plugins and attaches schema", async () => {
      const globalDB = {
        allDocs: jest.fn().mockResolvedValue({
          rows: [
            {
              id: "plugin_valid",
              doc: {
                _id: "plugin_valid",
                name: "valid-plugin",
                schema: {
                  metadata: {
                    svelteMajor: 5,
                  },
                },
              },
            },
            {
              id: "plugin_missing",
              error: "not_found",
            },
          ],
        }),
      }
      ;(tenancy.getGlobalDB as jest.Mock).mockReturnValue(globalDB)

      const usedPlugins: Plugin[] = [
        {
          _id: "plugin_valid",
          name: "valid-plugin",
          version: "1.0.0",
        } as Plugin,
        {
          _id: "plugin_missing",
          name: "missing-plugin",
          version: "1.0.0",
        } as Plugin,
      ]

      const result = await filterExistingUsedPlugins(usedPlugins)

      expect(result).toHaveLength(1)
      expect(result[0]._id).toBe("plugin_valid")
      expect(result[0].schema?.metadata?.svelteMajor).toBe(5)
      expect(globalDB.allDocs).toHaveBeenCalledWith({
        keys: ["plugin_valid", "plugin_missing"],
        include_docs: true,
      })
    })
  })

  describe("enrichUsedPluginsWithSvelteMajor", () => {
    it("returns empty array for empty input", async () => {
      expect(await enrichUsedPluginsWithSvelteMajor([])).toEqual([])
      expect(await enrichUsedPluginsWithSvelteMajor(undefined)).toEqual([])
    })

    it("enriches existing plugins with svelteMajor without querying database", async () => {
      const usedPlugins: Plugin[] = [
        {
          _id: "plugin_valid",
          name: "valid-plugin",
          version: "1.0.0",
          schema: {
            metadata: {
              svelteMajor: 5,
            },
          } as any,
        } as Plugin,
      ]

      const result = await enrichUsedPluginsWithSvelteMajor(usedPlugins)

      expect(result).toHaveLength(1)
      expect(result[0]._id).toBe("plugin_valid")
      expect(result[0].schema?.metadata?.svelteMajor).toBe(5)
      expect(tenancy.getGlobalDB).not.toHaveBeenCalled()
    })

    it("supports optional pluginDocs to enrich svelteMajor", async () => {
      const usedPlugins: Plugin[] = [
        {
          _id: "plugin_valid",
          name: "valid-plugin",
          version: "1.0.0",
        } as Plugin,
      ]
      const pluginDocs: Plugin[] = [
        {
          _id: "plugin_valid",
          name: "valid-plugin",
          version: "1.0.0",
          description: "",
          source: PluginSource.FILE,
          package: {},
          hash: "123",
          schema: {
            type: PluginType.COMPONENT,
            metadata: {
              svelteMajor: 5,
            },
          },
        },
      ]

      const result = await enrichUsedPluginsWithSvelteMajor(
        usedPlugins,
        pluginDocs
      )

      expect(result).toHaveLength(1)
      expect(result[0]._id).toBe("plugin_valid")
      expect(result[0].schema?.metadata?.svelteMajor).toBe(5)
      expect(tenancy.getGlobalDB).not.toHaveBeenCalled()
    })
  })
})
