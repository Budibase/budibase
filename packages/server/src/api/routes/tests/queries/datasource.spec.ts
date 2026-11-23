import { roles } from "@budibase/backend-core"
import { PermissionLevel, SourceName } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import {
  basicDatasource,
  basicQuery,
} from "../../../../tests/utilities/structures"

describe("Query and datasource integration changes", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(async () => {
    await config.end()
  })

  it.each([
    { from: SourceName.REST, to: SourceName.MONGODB },
    { from: SourceName.MONGODB, to: SourceName.REST },
    { from: SourceName.REST, to: SourceName.POSTGRES },
  ])(
    "rejects changing a datasource integration from $from to $to without queries",
    async ({ from, to }) => {
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        source: from,
      })

      await config.api.datasource.update(
        { ...datasource, source: to },
        { status: 400 }
      )

      expect(await config.api.datasource.get(datasource._id!)).toMatchObject({
        _id: datasource._id,
        source: from,
      })
    }
  )

  it.each([SourceName.REST, SourceName.MONGODB])(
    "allows editing an existing %s datasource",
    async source => {
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        source,
      })

      await config.api.datasource.update({
        ...datasource,
        name: "Updated datasource",
      })

      expect(await config.api.datasource.get(datasource._id!)).toMatchObject({
        _id: datasource._id,
        name: "Updated datasource",
        source,
      })
    }
  )

  it.each([
    { from: SourceName.REST, to: SourceName.MONGODB },
    { from: SourceName.MONGODB, to: SourceName.REST },
    { from: SourceName.REST, to: SourceName.POSTGRES },
  ])(
    "rejects changing a private query from $from to $to",
    async ({ from, to }) => {
      const originalDatasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        source: from,
      })
      const targetDatasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        source: to,
      })
      const query = await config.api.query.save(
        basicQuery(originalDatasource._id!)
      )

      await config.api.query.save(
        { ...query, datasourceId: targetDatasource._id! },
        { status: 400 }
      )

      expect(await config.api.query.get(query._id!)).toEqual(query)
    }
  )

  it.each([SourceName.REST, SourceName.MONGODB])(
    "allows switching between %s datasources",
    async source => {
      const originalDatasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        source,
      })
      const targetDatasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        source,
      })
      const query = await config.api.query.save(
        basicQuery(originalDatasource._id!)
      )
      if (source === SourceName.REST) {
        await config.api.permission.add({
          roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
          resourceId: query._id!,
          level: PermissionLevel.WRITE,
        })
      }

      const savedQuery = await config.api.query.save({
        ...query,
        datasourceId: targetDatasource._id!,
      })

      expect(await config.api.query.get(query._id!)).toEqual({
        ...savedQuery,
        _id: query._id,
        datasourceId: targetDatasource._id,
      })
      if (source === SourceName.REST) {
        const result = await config.api.permission.get(query._id!)
        expect(result.permissions.write.role).toBe(
          roles.BUILTIN_ROLE_IDS.PUBLIC
        )
      }
    }
  )
})
