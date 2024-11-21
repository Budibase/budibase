import {
  BuildSchemaFromSourceResponse,
  CreateDatasourceResponse,
  Datasource,
  FetchDatasourceInfoResponse,
  FieldType,
  QueryJson,
  RelationshipType,
  UpdateDatasourceRequest,
  UpdateDatasourceResponse,
  VerifyDatasourceRequest,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"
import { sql } from "@budibase/backend-core"

export class DatasourceAPI extends TestAPI {
  create = async (
    config: Datasource,
    expectations?: Expectations
  ): Promise<Datasource> => {
    const response = await this._post<CreateDatasourceResponse>(
      `/api/datasources`,
      {
        body: {
          datasource: config,
          tablesFilter: [],
        },
        expectations,
      }
    )
    return response.datasource
  }

  update = async (
    datasource: UpdateDatasourceRequest,
    expectations?: Expectations
  ): Promise<Datasource> => {
    const response = await this._put<UpdateDatasourceResponse>(
      `/api/datasources/${datasource._id}`,
      { body: datasource, expectations }
    )
    return response.datasource
  }

  verify = async (
    data: VerifyDatasourceRequest,
    expectations?: Expectations
  ) => {
    return await this._post(`/api/datasources/verify`, {
      body: data,
      expectations,
    })
  }

  delete = async (datasource: Datasource, expectations?: Expectations) => {
    return await this._delete(
      `/api/datasources/${datasource._id!}/${datasource._rev!}`,
      { expectations }
    )
  }

  get = async (id: string, expectations?: Expectations) => {
    return await this._get<Datasource>(`/api/datasources/${id}`, {
      expectations,
    })
  }

  fetch = async (expectations?: Expectations) => {
    return await this._get<Datasource[]>(`/api/datasources`, { expectations })
  }

  query = async (
    query: Omit<QueryJson, "meta"> & Partial<Pick<QueryJson, "meta">>,
    expectations?: Expectations
  ) => {
    return await this._post<any>(`/api/datasources/query`, {
      body: query,
      expectations,
    })
  }

  fetchSchema = async (
    {
      datasourceId,
      tablesFilter,
    }: { datasourceId: string; tablesFilter?: string[] },
    expectations?: Expectations
  ) => {
    return await this._post<BuildSchemaFromSourceResponse>(
      `/api/datasources/${datasourceId}/schema`,
      {
        expectations: expectations,
        body: {
          tablesFilter: tablesFilter,
        },
      }
    )
  }

  info = async (datasource: Datasource, expectations?: Expectations) => {
    return await this._post<FetchDatasourceInfoResponse>(
      `/api/datasources/info`,
      {
        body: { datasource },
        expectations,
      }
    )
  }

  addExistingRelationship = async (
    tableId1: string,
    tableId2: string,
    relationshipNameInTable1: string,
    relationshipNameInTable2: string,
    primaryKey: string,
    foreignKey: string,
    expectations?: Expectations
  ) => {
    const tableInfo1 = sql.utils.breakExternalTableId(tableId1),
      tableInfo2 = sql.utils.breakExternalTableId(tableId2)
    if (tableInfo1.datasourceId !== tableInfo2.datasourceId) {
      throw new Error(
        "Tables are in different datasources, cannot create relationship."
      )
    }
    const datasource = await this.get(tableInfo1.datasourceId)
    const table1 = datasource.entities?.[tableInfo1.tableName],
      table2 = datasource.entities?.[tableInfo2.tableName]
    if (!table1 || !table2) {
      throw new Error(
        "Both tables not found in datasource, cannot create relationship."
      )
    }

    const table1HasPrimary = table1.primary!.includes(primaryKey)
    table1.schema[relationshipNameInTable1] = {
      type: FieldType.LINK,
      name: relationshipNameInTable1,
      tableId: tableId2,
      relationshipType: table1HasPrimary
        ? RelationshipType.MANY_TO_ONE
        : RelationshipType.ONE_TO_MANY,
      fieldName: table1HasPrimary ? foreignKey : primaryKey,
      foreignKey: table1HasPrimary ? primaryKey : foreignKey,
      main: table1HasPrimary,
    }
    table2.schema[relationshipNameInTable2] = {
      type: FieldType.LINK,
      name: relationshipNameInTable2,
      tableId: tableId1,
      relationshipType: table1HasPrimary
        ? RelationshipType.ONE_TO_MANY
        : RelationshipType.MANY_TO_ONE,
      fieldName: table1HasPrimary ? primaryKey : foreignKey,
      foreignKey: table1HasPrimary ? foreignKey : primaryKey,
      main: !table1HasPrimary,
    }
    return await this.update(datasource, expectations)
  }
}
