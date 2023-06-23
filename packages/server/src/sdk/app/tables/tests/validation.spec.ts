import { checkExternalTableSchemas } from "../validation"
import { cloneDeep } from "lodash/fp"
import { Datasource } from "@budibase/types"

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

describe("validation and update of external table schemas", () => {
  function getForeignKeyColumn(datasource: Datasource) {
    return datasource.entities!["project"].schema.idC
  }

  it("should correctly set utilised foreign keys to autocolumns", () => {
    const response = checkExternalTableSchemas(cloneDeep(SCHEMA) as any)
    const foreignKey = getForeignKeyColumn(response)
    expect(foreignKey.autocolumn).toBe(true)
    expect(foreignKey.autoReason).toBe("foreign_key")
  })

  it("should correctly unset foreign keys when no longer used", () => {
    const setResponse = checkExternalTableSchemas(cloneDeep(SCHEMA) as any)
    const beforeFk = getForeignKeyColumn(setResponse)
    delete setResponse.entities!.client.schema.project
    delete setResponse.entities!.project.schema.client
    const response = checkExternalTableSchemas(cloneDeep(setResponse))
    const afterFk = getForeignKeyColumn(response)
    expect(beforeFk.autocolumn).toBe(true)
    expect(beforeFk.autoReason).toBe("foreign_key")
    expect(afterFk.autocolumn).toBeUndefined()
    expect(afterFk.autoReason).toBeUndefined()
  })
})
