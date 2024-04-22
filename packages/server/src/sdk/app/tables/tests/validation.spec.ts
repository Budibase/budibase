import { populateExternalTableSchemas } from "../validation"
import { cloneDeep } from "lodash/fp"
import {
  AutoReason,
  Datasource,
  FieldType,
  RelationshipType,
  SourceName,
  Table,
  TableSourceType,
} from "@budibase/types"
import { isEqual } from "lodash"
import { generateDatasourceID } from "../../../../db/utils"

const datasourceId = generateDatasourceID()

const SCHEMA: Datasource = {
  source: SourceName.POSTGRES,
  type: "datasource",
  _id: datasourceId,
  entities: {
    client: {
      type: "table",
      _id: "tableA",
      name: "client",
      primary: ["idC"],
      primaryDisplay: "Name",
      sourceId: datasourceId,
      sourceType: TableSourceType.EXTERNAL,
      schema: {
        idC: {
          autocolumn: true,
          externalType: "int unsigned",
          name: "idC",
          type: FieldType.NUMBER,
        },
        Name: {
          autocolumn: false,
          externalType: "varchar(255)",
          name: "Name",
          type: FieldType.STRING,
        },
        project: {
          fieldName: "idC",
          foreignKey: "idC",
          main: true,
          name: "project",
          relationshipType: RelationshipType.MANY_TO_ONE,
          tableId: "tableB",
          type: FieldType.LINK,
        },
      },
    },
    project: {
      type: "table",
      _id: "tableB",
      name: "project",
      primary: ["idP"],
      primaryDisplay: "Name",
      sourceId: datasourceId,
      sourceType: TableSourceType.EXTERNAL,
      schema: {
        idC: {
          externalType: "int unsigned",
          name: "idC",
          type: FieldType.NUMBER,
        },
        idP: {
          autocolumn: true,
          externalType: "int unsigned",
          name: "idProject",
          type: FieldType.NUMBER,
        },
        Name: {
          autocolumn: false,
          externalType: "varchar(255)",
          name: "Name",
          type: FieldType.STRING,
        },
        client: {
          fieldName: "idC",
          foreignKey: "idC",
          name: "client",
          relationshipType: RelationshipType.ONE_TO_MANY,
          tableId: "tableA",
          type: FieldType.LINK,
        },
      },
      sql: true,
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
      SCHEMA.entities!.client,
      OTHER_CLIENT_COLS
    )
    checkOtherColumns(
      response.entities!.project!,
      SCHEMA.entities!.project,
      OTHER_PROJECT_COLS
    )
  }

  it("should correctly set utilised foreign keys to autocolumns", () => {
    const response = populateExternalTableSchemas(cloneDeep(SCHEMA))
    const foreignKey = getForeignKeyColumn(response)
    expect(foreignKey.autocolumn).toBe(true)
    expect(foreignKey.autoReason).toBe(AutoReason.FOREIGN_KEY)
    noOtherTableChanges(response)
  })

  it("should correctly unset foreign keys when no longer used", () => {
    const setResponse = populateExternalTableSchemas(cloneDeep(SCHEMA))
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
