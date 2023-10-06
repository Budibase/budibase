import { populateExternalTableSchemas } from "../validation"
import { cloneDeep } from "lodash/fp"
import { AutoReason, Datasource, Table } from "@budibase/types"
import { isEqual } from "lodash"

const SCHEMA = {
  entities: {
    client: {
      _id: "tableA",
      name: "client",
      primary: ["idC"],
      primaryDisplay: "Name",
      schema: {
        idC: {
          autocolumn: true,
          externalType: "int unsigned",
          name: "idC",
          type: "number",
        },
        Name: {
          autocolumn: false,
          externalType: "varchar(255)",
          name: "Name",
          type: "string",
        },
        project: {
          fieldName: "idC",
          foreignKey: "idC",
          main: true,
          name: "project",
          relationshipType: "many-to-one",
          tableId: "tableB",
          type: "link",
        },
      },
    },
    project: {
      _id: "tableB",
      name: "project",
      primary: ["idP"],
      primaryDisplay: "Name",
      schema: {
        idC: {
          externalType: "int unsigned",
          name: "idC",
          type: "number",
        },
        idP: {
          autocolumn: true,
          externalType: "int unsigned",
          name: "idProject",
          type: "number",
        },
        Name: {
          autocolumn: false,
          externalType: "varchar(255)",
          name: "Name",
          type: "string",
        },
        client: {
          fieldName: "idC",
          foreignKey: "idC",
          name: "client",
          relationshipType: "one-to-many",
          tableId: "tableA",
          type: "link",
        },
      },
      sql: true,
      type: "table",
    },
  },
}

const OTHER_CLIENT_COLS = ["idC", "Name", "project"]
const OTHER_PROJECT_COLS = ["idP", "Name", "client"]

describe("validation and update of external table schemas", () => {
  function getForeignKeyColumn(datasource: Datasource) {
    return datasource.entities!["project"].schema.idC
  }

  function checkOtherColumns(
    table: Table,
    compareTable: Table,
    columnsToCheck: string[]
  ) {
    for (let columnName of columnsToCheck) {
      const columnA = table.schema[columnName]
      const columnB = table.schema[columnName]
      expect(isEqual(columnA, columnB)).toBe(true)
    }
  }

  function noOtherTableChanges(response: any) {
    checkOtherColumns(
      response.entities!.client!,
      SCHEMA.entities.client as Table,
      OTHER_CLIENT_COLS
    )
    checkOtherColumns(
      response.entities!.project!,
      SCHEMA.entities.project as Table,
      OTHER_PROJECT_COLS
    )
  }

  it("should correctly set utilised foreign keys to autocolumns", () => {
    const response = populateExternalTableSchemas(cloneDeep(SCHEMA) as any)
    const foreignKey = getForeignKeyColumn(response)
    expect(foreignKey.autocolumn).toBe(true)
    expect(foreignKey.autoReason).toBe(AutoReason.FOREIGN_KEY)
    noOtherTableChanges(response)
  })

  it("should correctly unset foreign keys when no longer used", () => {
    const setResponse = populateExternalTableSchemas(cloneDeep(SCHEMA) as any)
    const beforeFk = getForeignKeyColumn(setResponse)
    delete setResponse.entities!.client.schema.project
    delete setResponse.entities!.project.schema.client
    const response = populateExternalTableSchemas(cloneDeep(setResponse))
    const afterFk = getForeignKeyColumn(response)
    expect(beforeFk.autocolumn).toBe(true)
    expect(beforeFk.autoReason).toBe("foreign_key")
    expect(afterFk.autocolumn).toBeUndefined()
    expect(afterFk.autoReason).toBeUndefined()
    noOtherTableChanges(response)
  })
})
