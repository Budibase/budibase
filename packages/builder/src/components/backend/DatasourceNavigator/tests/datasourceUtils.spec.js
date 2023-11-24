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
        name: "Sample Data",
      }

      const pgDatasource = {
        _id: "pg_ds",
        name: "PostgreSQL local",
      }

      const mysqlDatasource = {
        _id: "mysql_ds",
        name: "My SQL local",
      }

      const tables = [
        ...[
          {
            _id: "ta_bb_employee",
            name: "Employees",
          },
          {
            _id: "ta_bb_expenses",
            name: "Expenses",
          },
          {
            _id: "ta_bb_expenses_2",
            name: "Expenses 2",
          },
          {
            _id: "ta_bb_inventory",
            name: "Inventory",
          },
          {
            _id: "ta_bb_jobs",
            name: "Jobs",
          },
        ].map(t => ({
          ...t,
          sourceId: internalTables._id,
        })),
        ...[
          {
            _id: "pg_ds-external_inventory",
            name: "External Inventory",
            views: {
              "External Inventory first view": {
                name: "External Inventory first view",
                id: "pg_ds_view_1",
              },
              "External Inventory second view": {
                name: "External Inventory second view",
                id: "pg_ds_view_2",
              },
            },
          },
          {
            _id: "pg_ds-another_table",
            name: "Another table",
            views: {
              view1: {
                id: "pg_ds-another_table-view1",
                name: "view1",
              },
              ["View 2"]: {
                id: "pg_ds-another_table-view2",
                name: "View 2",
              },
            },
          },
          {
            _id: "pg_ds_table2",
            name: "table2",
            views: {
              "new 2": {
                name: "new 2",
                id: "pg_ds_table2_new_2",
              },
              new: {
                name: "new",
                id: "pg_ds_table2_new_",
              },
            },
          },
        ].map(t => ({
          ...t,
          sourceId: pgDatasource._id,
        })),
        ...[
          {
            _id: "mysql_ds-mysql_table",
            name: "MySQL table",
          },
        ].map(t => ({
          ...t,
          sourceId: mysqlDatasource._id,
        })),
      ]

      const datasources = {
        list: [internalTables, pgDatasource, mysqlDatasource],
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

      it("given a valid search term, all tables are correctly filtered", () => {
        const searchTerm = "ex"

        const result = enrichDatasources(
          datasources,
          {},
          isActive,
          { list: tables },
          { list: [] },
          { list: [] },
          { list: [] },
          {},
          searchTerm
        )

        expect(result).toEqual([
          expect.objectContaining({
            _id: internalTables._id,
            show: true,
            tables: [
              expect.objectContaining({ _id: "ta_bb_expenses" }),
              expect.objectContaining({ _id: "ta_bb_expenses_2" }),
            ],
          }),
          expect.objectContaining({
            _id: pgDatasource._id,
            show: true,
            tables: [
              expect.objectContaining({ _id: "pg_ds-external_inventory" }),
            ],
          }),
          expect.objectContaining({
            _id: mysqlDatasource._id,
            show: false,
            tables: [],
          }),
        ])
      })

      it("given a non matching search term, all entities are empty", () => {
        const searchTerm = "non matching"

        const result = enrichDatasources(
          datasources,
          {},
          isActive,
          { list: tables },
          { list: [] },
          { list: [] },
          { list: [] },
          {},
          searchTerm
        )

        expect(result).toEqual([
          expect.objectContaining({
            _id: internalTables._id,
            show: false,
            tables: [],
          }),
          expect.objectContaining({
            _id: pgDatasource._id,
            show: false,
            tables: [],
          }),
          expect.objectContaining({
            _id: mysqlDatasource._id,
            show: false,
            tables: [],
          }),
        ])
      })
    })
  })
})
