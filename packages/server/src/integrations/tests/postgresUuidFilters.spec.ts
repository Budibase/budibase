import type { Knex } from "knex"
import { generator } from "@budibase/backend-core/tests"
import { BasicOperator, type Table } from "@budibase/types"
import { DatabaseName, datasourceDescribe } from "./utils"

const descriptions = datasourceDescribe({
  only: [DatabaseName.POSTGRES, DatabaseName.POSTGRES_LEGACY],
})

if (descriptions.length) {
  describe.each(descriptions)(
    "Postgres UUID filters ($dbName)",
    ({ config, dsProvider }) => {
      const personId = "f69df1ee-4c9e-561b-a24d-1af57af203bf"
      const otherPersonId = "aaaaaaaa-4c9e-561b-a24d-1af57af203bf"
      const profileId = "603e1cf2-b411-5fc7-b8d2-5d4e36939cfc"
      const otherProfileId = "bbbbbbbb-b411-5fc7-b8d2-5d4e36939cfc"
      const unlinkedProfileId = "cccccccc-b411-5fc7-b8d2-5d4e36939cfc"
      const suffix = generator.guid().replaceAll("-", "")
      const personTableName = `persons_${suffix}`
      const profileTableName = `profiles_${suffix}`
      const enumTypeName = `person_status_${suffix}`
      let client: Knex
      let persons: Table
      let profiles: Table
      let relatedId: string

      beforeAll(async () => {
        const { datasource, client: dbClient } = await dsProvider()
        client = dbClient!

        await client.schema.createTable(personTableName, table => {
          table.uuid("person_id").primary()
          table.timestamp("created_at", { useTz: true })
          table.enu("status", ["active", "inactive"], {
            useNative: true,
            enumName: enumTypeName,
          })
        })
        await client.schema.createTable(profileTableName, table => {
          table.uuid("candidate_profile_id").primary()
          table.string("status")
          table
            .uuid("person_id")
            .references("person_id")
            .inTable(personTableName)
        })
        await client(personTableName).insert([
          {
            person_id: personId,
            created_at: "2026-10-15T00:00:00Z",
            status: "active",
          },
          {
            person_id: otherPersonId,
            created_at: "2026-01-01T00:00:00Z",
            status: "inactive",
          },
        ])
        await client(profileTableName).insert([
          { candidate_profile_id: profileId, person_id: personId },
          { candidate_profile_id: otherProfileId, person_id: otherPersonId },
          { candidate_profile_id: unlinkedProfileId, person_id: null },
        ])

        const { datasource: imported } =
          await config.api.datasource.fetchSchema({
            datasourceId: datasource!._id!,
          })
        persons = imported.entities![personTableName]
        profiles = imported.entities![profileTableName]
        await config.api.datasource.addExistingRelationship({
          one: {
            tableId: persons._id!,
            relationshipName: "profiles",
            foreignKey: "person_id",
          },
          many: {
            tableId: profiles._id!,
            relationshipName: "person",
            primaryKey: "person_id",
          },
        })
        const rows = await config.api.row.fetch(persons._id!)
        relatedId = rows.find(row => row.person_id === personId)!._id!
      })

      afterAll(async () => {
        try {
          await client.schema.dropTableIfExists(profileTableName)
          await client.schema.dropTableIfExists(personTableName)
          await client.raw("DROP TYPE IF EXISTS ??", [enumTypeName])
        } finally {
          config.end()
        }
      })

      it.each(["relationship", "table"])(
        "filters by a related encoded UUID using the %s name",
        async name => {
          const prefix = name === "relationship" ? "person" : persons.name
          const result = await config.api.row.search(profiles._id!, {
            query: { equal: { [`${prefix}._id`]: relatedId } },
            countRows: true,
            paginate: true,
            limit: 10,
          })

          expect(result.rows.map(row => row.candidate_profile_id)).toEqual([
            profileId,
          ])
          expect(result.totalRows).toBe(1)
        }
      )

      it("supports inequality on a related UUID", async () => {
        const result = await config.api.row.search(profiles._id!, {
          query: { notEqual: { "person._id": relatedId } },
        })

        expect(result.rows.map(row => row.candidate_profile_id).sort()).toEqual(
          [otherProfileId, unlinkedProfileId]
        )
      })

      it.each(["oneOf", "notOneOf"] as const)(
        "decodes related UUIDs for %s filters",
        async operator => {
          const result = await config.api.row.search(profiles._id!, {
            query: { [operator]: { "person._id": [relatedId] } },
          })

          expect(
            result.rows.map(row => row.candidate_profile_id).sort()
          ).toEqual(
            operator === "oneOf"
              ? [profileId]
              : [otherProfileId, unlinkedProfileId]
          )
        }
      )

      it("decodes numbered related IDs inside nested filters", async () => {
        const result = await config.api.row.search(profiles._id!, {
          query: {
            $or: {
              conditions: [
                {
                  $and: {
                    conditions: [{ equal: { "1:person._id": relatedId } }],
                  },
                },
              ],
            },
          },
        })

        expect(result.rows.map(row => row.candidate_profile_id)).toEqual([
          profileId,
        ])
      })

      it("preserves null entries alongside encoded related IDs", async () => {
        const result = await config.api.row.search(profiles._id!, {
          query: { oneOf: { "person._id": [relatedId, null] } },
        })

        expect(result.rows.map(row => row.candidate_profile_id)).toEqual([
          profileId,
        ])
      })

      it("supports related ID filters saved in a view", async () => {
        const view = await config.api.viewV2.create({
          tableId: profiles._id!,
          name: "Person profiles",
          schema: { candidate_profile_id: { visible: true } },
          queryUI: {
            groups: [
              {
                filters: [
                  {
                    field: "person._id",
                    operator: BasicOperator.EQUAL,
                    value: relatedId,
                  },
                ],
              },
            ],
          },
        })
        const result = await config.api.row.search(view.id, { query: {} })

        expect(result.rows.map(row => row.candidate_profile_id)).toEqual([
          profileId,
        ])
      })

      it("supports equality on native UUID columns", async () => {
        const result = await config.api.row.search(profiles._id!, {
          query: { equal: { person_id: personId } },
        })

        expect(result.rows.map(row => row.candidate_profile_id)).toEqual([
          profileId,
        ])
      })

      it.each([
        {
          operator: "equal",
          value: "2026-10-15T05:30:00+05:30",
        },
        {
          operator: "oneOf",
          value: ["2026-10-14T20:00:00-04:00"],
        },
        {
          operator: "range",
          value: { low: "2026-10-15T05:30:00+05:30" },
        },
      ])(
        "preserves related timestamp offsets in $operator filters",
        async ({ operator, value }) => {
          const result = await config.api.row.search(profiles._id!, {
            query: { [operator]: { "person.created_at": value } },
            countRows: true,
            paginate: true,
          })

          expect(result.rows.map(row => row.candidate_profile_id)).toEqual([
            profileId,
          ])
          expect(result.totalRows).toBe(1)
        }
      )

      it.each(["string", "fuzzy"] as const)(
        "supports %s searches on native UUID columns",
        async operator => {
          const result = await config.api.row.search(profiles._id!, {
            query: { [operator]: { person_id: "F69DF1EE" } },
          })

          expect(result.rows.map(row => row.candidate_profile_id)).toEqual([
            profileId,
          ])
        }
      )

      it.each(["string", "fuzzy"] as const)(
        "supports %s searches on related native UUID columns",
        async operator => {
          const result = await config.api.row.search(profiles._id!, {
            query: { [operator]: { "person.person_id": "F69DF1EE" } },
          })

          expect(result.rows.map(row => row.candidate_profile_id)).toEqual([
            profileId,
          ])
        }
      )

      it.each(["relationship", "table"])(
        "filters related enums using the %s name",
        async name => {
          const prefix = name === "relationship" ? "person" : persons.name
          const result = await config.api.row.search(profiles._id!, {
            query: { string: { [`${prefix}.status`]: "act" } },
            countRows: true,
            paginate: true,
          })

          expect(result.rows.map(row => row.candidate_profile_id)).toEqual([
            profileId,
          ])
          expect(result.totalRows).toBe(1)
        }
      )
    }
  )
}
