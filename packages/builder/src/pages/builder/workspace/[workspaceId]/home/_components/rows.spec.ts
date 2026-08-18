import {
  WorkspaceResource,
  SourceName,
  TableSourceType,
  type Agent,
  type Datasource,
  type HomeRow,
  type Table,
  type UIInternalDatasource,
  type WorkspaceFavourite,
} from "@budibase/types"
import { TableNames } from "@/constants"
import { BUDIBASE_INTERNAL_DB_ID } from "@/constants/backend"
import { buildHomeRows, filterHomeRows, sortHomeRows } from "./rows"

const buildFavourite = (
  resourceId: string,
  favouriteId?: string
): WorkspaceFavourite => ({
  ...(favouriteId ? { _id: favouriteId } : {}),
  resourceType: WorkspaceResource.AGENT,
  resourceId,
  createdBy: "user_1",
})

const buildAgentRow = ({
  id,
  name,
  updatedAt,
  createdAt,
  favouriteId,
}: {
  id: string
  name: string
  updatedAt?: string
  createdAt?: string
  favouriteId?: string
}): HomeRow => ({
  _id: id,
  id,
  name,
  type: "agent",
  live: true,
  updatedAt,
  createdAt,
  resource: {} as Agent,
  favourite: buildFavourite(id, favouriteId),
  icon: "sparkle",
  iconColor: "#BDB0F5",
})

describe("sortHomeRows", () => {
  it("sorts by updatedAt descending", () => {
    const rows = [
      buildAgentRow({
        id: "a",
        name: "Alpha",
        updatedAt: "2024-01-01T00:00:00.000Z",
      }),
      buildAgentRow({
        id: "b",
        name: "Beta",
        updatedAt: "2025-01-01T00:00:00.000Z",
      }),
      buildAgentRow({
        id: "c",
        name: "Gamma",
        updatedAt: "2023-01-01T00:00:00.000Z",
      }),
    ]

    const result = sortHomeRows(rows, {
      sortColumn: "updated",
      sortOrder: "desc",
    })

    expect(result.map(row => row._id)).toEqual(["b", "a", "c"])
  })

  it("sorts by updatedAt ascending", () => {
    const rows = [
      buildAgentRow({
        id: "a",
        name: "Alpha",
        updatedAt: "2024-01-01T00:00:00.000Z",
      }),
      buildAgentRow({
        id: "b",
        name: "Beta",
        updatedAt: "2025-01-01T00:00:00.000Z",
      }),
      buildAgentRow({
        id: "c",
        name: "Gamma",
        updatedAt: "2023-01-01T00:00:00.000Z",
      }),
    ]

    const result = sortHomeRows(rows, {
      sortColumn: "updated",
      sortOrder: "asc",
    })

    expect(result.map(row => row._id)).toEqual(["c", "a", "b"])
  })

  it("does not use createdAt when updatedAt is missing", () => {
    const rows = [
      buildAgentRow({
        id: "a",
        name: "MissingUpdated",
        createdAt: "2099-01-01T00:00:00.000Z",
      }),
      buildAgentRow({
        id: "b",
        name: "HasUpdatedOlder",
        updatedAt: "2024-01-01T00:00:00.000Z",
      }),
      buildAgentRow({
        id: "c",
        name: "HasUpdatedNewer",
        updatedAt: "2025-01-01T00:00:00.000Z",
      }),
    ]

    const result = sortHomeRows(rows, {
      sortColumn: "updated",
      sortOrder: "desc",
    })

    expect(result.map(row => row._id)).toEqual(["c", "b", "a"])
  })

  it("keeps favourites first before applying updated sort", () => {
    const rows = [
      buildAgentRow({
        id: "a",
        name: "FavOlder",
        updatedAt: "2024-01-01T00:00:00.000Z",
        favouriteId: "fav_1",
      }),
      buildAgentRow({
        id: "b",
        name: "NonFavNewer",
        updatedAt: "2025-01-01T00:00:00.000Z",
      }),
    ]

    const result = sortHomeRows(rows, {
      sortColumn: "updated",
      sortOrder: "desc",
    })

    expect(result.map(row => row._id)).toEqual(["a", "b"])
  })

  it("uses name as tie-breaker when updatedAt matches", () => {
    const rows = [
      buildAgentRow({
        id: "b",
        name: "Bravo",
        updatedAt: "2025-01-01T00:00:00.000Z",
      }),
      buildAgentRow({
        id: "a",
        name: "Alpha",
        updatedAt: "2025-01-01T00:00:00.000Z",
      }),
    ]

    const result = sortHomeRows(rows, {
      sortColumn: "updated",
      sortOrder: "desc",
    })

    expect(result.map(row => row.name)).toEqual(["Alpha", "Bravo"])
  })

  it("sorts by project count descending", () => {
    const rows = [
      buildAgentRow({ id: "a", name: "Unassigned" }),
      {
        ...buildAgentRow({ id: "b", name: "Assigned" }),
        projectIds: ["project_1"],
      },
    ]

    const result = sortHomeRows(rows, {
      sortColumn: "projects",
      sortOrder: "desc",
    })

    expect(result.map(row => row._id)).toEqual(["b", "a"])
  })

  it("sorts by multiple project count descending", () => {
    const rows = [
      buildAgentRow({ id: "a", name: "OneProject" }),
      {
        ...buildAgentRow({ id: "b", name: "TwoProjects" }),
        projectIds: ["project_1", "project_2"],
      },
      {
        ...buildAgentRow({ id: "c", name: "SingleAssigned" }),
        projectIds: ["project_1"],
      },
    ]

    const result = sortHomeRows(rows, {
      sortColumn: "projects",
      sortOrder: "desc",
    })

    expect(result.map(row => row._id)).toEqual(["b", "c", "a"])
  })
})

const noopGetFavourite = (
  resourceType: WorkspaceResource,
  resourceId: string
): WorkspaceFavourite => ({
  resourceType,
  resourceId,
  createdBy: "user_1",
})

const buildDatasource = (overrides: Partial<Datasource> = {}): Datasource =>
  ({
    _id: "datasource_1",
    name: "My datasource",
    source: SourceName.POSTGRES,
    type: "datasource",
    ...overrides,
  }) as Datasource

const buildInternalDatasource = (
  overrides: Partial<UIInternalDatasource> = {}
): UIInternalDatasource =>
  ({
    _id: BUDIBASE_INTERNAL_DB_ID,
    name: "Internal datasource",
    source: SourceName.BUDIBASE,
    type: "datasource",
    entities: [],
    ...overrides,
  }) as UIInternalDatasource

const buildTable = (overrides: Partial<Table> = {}): Table =>
  ({
    _id: "table_1",
    name: "My table",
    sourceId: "datasource_1",
    sourceType: TableSourceType.INTERNAL,
    schema: {},
    ...overrides,
  }) as Table

describe("buildHomeRows", () => {
  it("builds assignable data rows for external datasources and internal tables", () => {
    const rows = buildHomeRows({
      apps: [],
      automations: [],
      agents: [],
      datasources: [
        buildDatasource({ _id: BUDIBASE_INTERNAL_DB_ID }),
        buildDatasource({
          _id: "datasource_1",
          projectIds: ["project_external"],
        }),
      ],
      tables: [
        buildTable({
          _id: "internal_table",
          name: "Internal table",
          sourceId: BUDIBASE_INTERNAL_DB_ID,
          projectIds: ["project_internal", "project_external"],
        }),
        buildTable({
          _id: TableNames.USERS,
          sourceId: BUDIBASE_INTERNAL_DB_ID,
          projectIds: ["project_users"],
        }),
        buildTable({
          _id: "external_table",
          sourceType: TableSourceType.EXTERNAL,
          projectIds: ["project_external_table"],
        }),
      ],
      getFavourite: noopGetFavourite,
    })

    expect(rows).toHaveLength(2)
    expect(rows[0]).toMatchObject({
      _id: "datasource_1",
      id: "datasource_1",
      name: "My datasource",
      type: "datasource",
      icon: "database",
      iconColor: "var(--color-green-600)",
      projectIds: ["project_external"],
    })
    expect(rows[0].favourite).toMatchObject({
      resourceType: WorkspaceResource.DATASOURCE,
      resourceId: "datasource_1",
    })
    expect(rows[1]).toMatchObject({
      _id: "internal_table",
      id: "internal_table",
      name: "Internal table",
      type: "table",
      icon: "table",
      iconColor: "var(--color-green-600)",
      projectIds: ["project_internal", "project_external"],
    })
    expect(rows[1].favourite).toMatchObject({
      resourceType: WorkspaceResource.TABLE,
      resourceId: "internal_table",
    })
  })

  it("does not build rows for internal, draft, or entity datasources and unsupported tables", () => {
    const rows = buildHomeRows({
      apps: [],
      automations: [],
      agents: [],
      datasources: [
        buildDatasource({ _id: BUDIBASE_INTERNAL_DB_ID }),
        buildDatasource({ _id: "__draft__" }),
        buildInternalDatasource({ _id: "datasource_with_entities" }),
      ],
      tables: [
        buildTable({
          _id: TableNames.USERS,
          sourceId: BUDIBASE_INTERNAL_DB_ID,
        }),
        buildTable({
          _id: "external_table",
          sourceType: TableSourceType.EXTERNAL,
        }),
      ],
      getFavourite: noopGetFavourite,
    })

    expect(rows).toEqual([])
  })

  it("does not expose a generic aggregate data row", () => {
    const rows = buildHomeRows({
      apps: [],
      automations: [],
      agents: [],
      datasources: [buildDatasource({ _id: "datasource_1" })],
      tables: [
        buildTable({
          _id: "internal_table",
          sourceId: BUDIBASE_INTERNAL_DB_ID,
          sourceType: TableSourceType.INTERNAL,
        }),
        buildTable({
          _id: "external_table",
          sourceType: TableSourceType.EXTERNAL,
        }),
      ],
      getFavourite: noopGetFavourite,
    })

    expect(rows.map(row => row._id)).not.toContain("data")
    expect(rows.map(row => row._id)).toEqual(["datasource_1", "internal_table"])
  })
})

describe("filterHomeRows", () => {
  const rows = buildHomeRows({
    apps: [],
    automations: [],
    agents: [],
    datasources: [buildDatasource({ _id: "datasource_1" })],
    tables: [
      buildTable({
        _id: "internal_table",
        sourceId: BUDIBASE_INTERNAL_DB_ID,
        sourceType: TableSourceType.INTERNAL,
      }),
      buildTable({
        _id: "external_table",
        sourceType: TableSourceType.EXTERNAL,
      }),
    ],
    getFavourite: noopGetFavourite,
  })

  it.each([["data", ["datasource_1", "internal_table"]]] as const)(
    "filters by type %s",
    (typeFilter, expectedIds) => {
      const result = filterHomeRows({ rows, typeFilter, searchTerm: "" })
      expect(result.map(row => row._id)).toEqual(expectedIds)
    }
  )
})
