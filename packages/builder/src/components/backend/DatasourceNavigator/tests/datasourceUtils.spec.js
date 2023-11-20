import { enrichDatasources } from "../datasourceUtils"

describe("datasourceUtils", () => {
  describe("enrichDatasources", () => {
    it.each([
      ["undefined", undefined],
      ["undefined list", {}],
      ["empty list", { list: [] }],
    ])("%s datasources will return an empty list", datasources => {
      const result = enrichDatasources(datasources)

      expect(result).toEqual([])
    })

    describe("filtering", () => {
      const internalTables = {
        _id: "datasource_internal_bb_default",
        type: "budibase",
        name: "Sample Data",
        source: "BUDIBASE",
        config: {},
        entities: [
          {
            _id: "ta_bb_employee",
            type: "table",
            name: "Employees",
            sourceId: "datasource_internal_bb_default",
            sourceType: "internal",
          },
          {
            _id: "ta_bb_expenses",
            type: "table",
            views: {},
            name: "Expenses",
            sourceId: "datasource_internal_bb_default",
            sourceType: "internal",
          },
          {
            _id: "ta_bb_inventory",
            type: "table",
            views: {},
            sourceId: "datasource_internal_bb_default",
            sourceType: "internal",
            primaryDisplay: "Item Name",
            name: "Inventory",
          },
          {
            _id: "ta_bb_jobs",
            type: "table",
            name: "Jobs",
            sourceId: "datasource_internal_bb_default",
            sourceType: "internal",
            primaryDisplay: "Job ID",
          },
        ],
      }

      const pgDatasource = {
        _id: "pg_ds",
        name: "PostgreSQL local",
        plus: true,
        entities: {
          "mic moc": {
            type: "table",
            _id: "datasource_plus_865bf332f37f454b82e2d371be90a0ef__mic%20moc",
            primary: ["id"],
            name: "mic moc",
            sourceId: "datasource_plus_865bf332f37f454b82e2d371be90a0ef",
            sourceType: "external",
            primaryDisplay: "Column 01",
            views: {
              "mic view": {
                name: "mic view",
                tableId:
                  "datasource_plus_865bf332f37f454b82e2d371be90a0ef__mic%20moc",
                query: null,
                sort: { field: null, order: "ascending" },
                schema: {
                  "Column 01": { visible: true },
                  "Column 02": { visible: true },
                  id: { visible: true },
                },
                primaryDisplay: "Column 01",
                id: "view_datasource_plus_865bf332f37f454b82e2d371be90a0ef__mic%20moc_201b0c7a6766423a8abab64fd31bc9dc",
                version: 2,
              },
            },
          },
          "table 1": {
            type: "table",
            _id: "datasource_plus_865bf332f37f454b82e2d371be90a0ef__table%201",
            primary: ["id"],
            name: "table 1",
            sourceId: "datasource_plus_865bf332f37f454b82e2d371be90a0ef",
            sourceType: "external",
            primaryDisplay: "Column 01",
            views: {
              fr: {
                id: "view_datasource_plus_865bf332f37f454b82e2d371be90a0ef__table%201_f8a0299dfb9b4423b2a88809c2ee0bcb",
                name: "fr",
                version: 2,
                tableId:
                  "datasource_plus_865bf332f37f454b82e2d371be90a0ef__table%201",
                query: null,
                sort: { field: null, order: "ascending" },
                schema: {
                  "Column 01": { width: 200, visible: true },
                  id: { order: 1, width: 200, visible: true },
                },
                primaryDisplay: "Column 01",
              },
            },
          },
          test2: {
            type: "table",
            _id: "datasource_plus_865bf332f37f454b82e2d371be90a0ef__test2",
            primary: ["id"],
            name: "test2",
            sourceId: "datasource_plus_865bf332f37f454b82e2d371be90a0ef",
            sourceType: "external",
            sql: true,
            views: {
              "new 2": {
                name: "new 2",
                tableId:
                  "datasource_plus_865bf332f37f454b82e2d371be90a0ef__test2",
                query: null,
                sort: { field: null, order: "ascending" },
                schema: {
                  id: { visible: true },
                  "Column 01": { visible: true },
                },
                primaryDisplay: "id",
                id: "view_datasource_plus_865bf332f37f454b82e2d371be90a0ef__test2_cdb7ea28c0104dfb93309c54276d28cd",
                version: 2,
              },
              new: {
                id: "view_datasource_plus_865bf332f37f454b82e2d371be90a0ef__test2_b7848afdbca54cd488f3eabf8be56e07",
                name: "new",
                version: 2,
                tableId:
                  "datasource_plus_865bf332f37f454b82e2d371be90a0ef__test2",
                query: null,
                sort: { field: null, order: "ascending" },
                schema: { id: { width: 200, visible: true } },
                primaryDisplay: "id",
              },
            },
            primaryDisplay: "id",
            indexes: [],
          },
        },
      }

      const datasources = {
        list: [internalTables, pgDatasource],
      }
      const isActive = vi.fn().mockReturnValue(true)

      it("without a search term, all datasources are returned", () => {
        const searchTerm = ""

        const result = enrichDatasources(
          datasources,
          {},
          isActive,
          { list: [] },
          { list: [] },
          { list: [] },
          { list: [] },
          {},
          searchTerm
        )

        expect(result).toEqual(
          datasources.list.map(d =>
            expect.objectContaining({
              _id: d._id,
              show: true,
            })
          )
        )
      })

      it("given a valid search term, all entities are correctly filtered", () => {
        const searchTerm = "ex"

        const result = enrichDatasources(
          datasources,
          {},
          isActive,
          "",
          { list: [] },
          { list: [] },
          { list: [] },
          {},
          searchTerm
        )

        expect(result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: internalTables._id,
              show: true,
            }),
            expect.objectContaining({
              _id: pgDatasource._id,
              show: false,
            }),
          ])
        )
      })
    })
  })
})
