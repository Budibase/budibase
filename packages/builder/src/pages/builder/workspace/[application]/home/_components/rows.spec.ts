import {
  WorkspaceResource,
  type Agent,
  type HomeRow,
  type WorkspaceFavourite,
} from "@budibase/types"
import { sortHomeRows } from "./rows"

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
})
