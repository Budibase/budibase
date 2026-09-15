import {
  Plugin,
  PluginType,
  Screen,
  ScreenProps,
  Workspace,
} from "@budibase/types"
import {
  findPluginsInProps,
  areUsedPluginsEqual,
  addUsedPluginsForScreen,
  reconcileWorkspaceUsedPlugins,
  enrichUsedPluginSvelteMajors,
} from "./usedPlugins"
import { cache, context, tenancy } from "@budibase/backend-core"
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

  describe("areUsedPluginsEqual", () => {
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

    it("returns true for identical arrays", () => {
      expect(areUsedPluginsEqual([pluginA, pluginB], [pluginA, pluginB])).toBe(
        true
      )
    })

    it("returns true regardless of order", () => {
      expect(areUsedPluginsEqual([pluginA, pluginB], [pluginB, pluginA])).toBe(
        true
      )
    })

    it("returns false if length is different", () => {
      expect(areUsedPluginsEqual([pluginA], [pluginA, pluginB])).toBe(false)
    })

    it("returns false if version changes", () => {
      const pluginAUpdated = { ...pluginA, version: "1.0.1" }
      expect(areUsedPluginsEqual([pluginA], [pluginAUpdated])).toBe(false)
    })

    it("returns false if hash changes", () => {
      const pluginAUpdated = { ...pluginA, hash: "hash_999" }
      expect(areUsedPluginsEqual([pluginA], [pluginAUpdated])).toBe(false)
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
      expect(context.getWorkspaceDB).not.toHaveBeenCalled()
    })

    it("adds missing plugin, saves metadata, and invalidates cache", async () => {
      const props: ScreenProps = {
        _id: "c1",
        _component: "plugin/custom-table",
      } as any

      const globalDB = {
        allDocs: jest.fn().mockResolvedValue({
          rows: [
            {
              doc: {
                _id: "plugin_tbl",
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
      expect(workspaceDB.put).toHaveBeenCalledWith(
        expect.objectContaining({
          usedPlugins: [
            expect.objectContaining({
              _id: "plugin_tbl",
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
      const globalDB = {
        allDocs: jest.fn().mockResolvedValue({
          rows: [
            {
              doc: {
                _id: "plugin_active",
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
            _id: "plugin_active",
            name: "active-plugin",
            version: "1.0.0",
            hash: "hash_active",
            jsUrl: "/api/assets/plugins/plugin_active/index.js",
          } as Plugin,
          {
            _id: "plugin_deleted",
            name: "deleted-plugin",
            version: "1.0.0",
            hash: "hash_deleted",
            jsUrl: "/api/assets/plugins/plugin_deleted/index.js",
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
              _id: "plugin_active",
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
      const globalDB = {
        allDocs: jest.fn().mockResolvedValue({
          rows: [
            {
              doc: {
                _id: "plugin_active",
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
            _id: "plugin_active",
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

  describe("enrichUsedPluginSvelteMajors", () => {
    it("returns empty array for empty input", async () => {
      expect(await enrichUsedPluginSvelteMajors([])).toEqual([])
      expect(await enrichUsedPluginSvelteMajors(undefined)).toEqual([])
    })

    it("filters out missing or deleted plugins and enriches existing ones", async () => {
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
              id: "plugin_deleted",
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
          _id: "plugin_deleted",
          name: "deleted-plugin",
          version: "1.0.0",
        } as Plugin,
      ]

      const result = await enrichUsedPluginSvelteMajors(usedPlugins)

      expect(result).toHaveLength(1)
      expect(result[0]._id).toBe("plugin_valid")
      expect(result[0].schema?.metadata?.svelteMajor).toBe(5)
    })
  })
})
