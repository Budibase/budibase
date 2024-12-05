import {
  BuildSchemaFromSourceResponse,
  CreateDatasourceResponse,
  Datasource,
  FetchDatasourceInfoResponse,
  FetchExternalSchemaResponse,
  FieldType,
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

  externalSchema = async (
    datasource: Datasource | string,
    expectations?: Expectations
  ): Promise<FetchExternalSchemaResponse> => {
    const id = typeof datasource === "string" ? datasource : datasource._id
    return await this._get<FetchExternalSchemaResponse>(
      `/api/datasources/${id}/schema/external`,
      {
        expectations,
      }
    )
  }

  addExistingRelationship = async (
    {
      one,
      many,
    }: {
      one: { tableId: string; relationshipName: string; foreignKey: string }
      many: { tableId: string; relationshipName: string; primaryKey: string }
    },
    expectations?: Expectations
  ) => {
    const oneTableInfo = sql.utils.breakExternalTableId(one.tableId),
      manyTableInfo = sql.utils.breakExternalTableId(many.tableId)
    if (oneTableInfo.datasourceId !== manyTableInfo.datasourceId) {
      throw new Error(
        "Tables are in different datasources, cannot create relationship."
      )
    }
    const datasource = await this.get(oneTableInfo.datasourceId)
    const oneTable = datasource.entities?.[oneTableInfo.tableName],
      manyTable = datasource.entities?.[manyTableInfo.tableName]
    if (!oneTable || !manyTable) {
      throw new Error(
        "Both tables not found in datasource, cannot create relationship."
      )
    }

    manyTable.schema[many.relationshipName] = {
      type: FieldType.LINK,
      name: many.relationshipName,
      tableId: oneTable._id!,
      relationshipType: RelationshipType.MANY_TO_ONE,
      fieldName: one.foreignKey,
      foreignKey: many.primaryKey,
      main: true,
    }
    oneTable.schema[one.relationshipName] = {
      type: FieldType.LINK,
      name: one.relationshipName,
      tableId: manyTable._id!,
      relationshipType: RelationshipType.ONE_TO_MANY,
      fieldName: many.primaryKey,
      foreignKey: one.foreignKey,
    }
    return await this.update(datasource, expectations)
  }
}
