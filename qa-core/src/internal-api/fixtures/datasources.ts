import { Datasource } from "@budibase/types"
import { DatasourceRequest } from "../../types"
import { generator } from "../../shared"

// Add information about the data source to the fixtures file from 1password
export const mongoDB = (): DatasourceRequest => {
  return {
    datasource: {
      name: "MongoDB",
      source: "MONGODB",
      type: "datasource",
      config: {
        connectionString: process.env.MONGODB_CONNECTION_STRING,
        db: process.env.MONGODB_DB,
      },
    },

    fetchSchema: false,
  }
}

export const postgresSQL = (): DatasourceRequest => {
  return {
    datasource: {
      name: "PostgresSQL",
      plus: true,
      source: "POSTGRES",
      type: "datasource",
      config: {
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
        schema: "public",
        user: process.env.POSTGRES_USER,
      },
    },
    fetchSchema: true,
  }
}
export const mariaDB = (): DatasourceRequest => {
  return {
    datasource: {
      name: "MariaDB",
      plus: true,
      source: "MYSQL",
      type: "datasource",
      config: {
        database: process.env.MARIADB_DB,
        host: process.env.MARIADB_HOST,
        password: process.env.MARIADB_PASSWORD,
        port: process.env.MARIADB_PORT,
        schema: "public",
        user: process.env.MARIADB_USER,
      },
    },
    fetchSchema: true,
  }
}

export const restAPI = (): DatasourceRequest => {
  return {
    datasource: {
      name: "RestAPI",
      source: "REST",
      type: "datasource",
      config: {
        defaultHeaders: {},
        rejectUnauthorized: true,
        url: process.env.REST_API_BASE_URL,
      },
    },
    fetchSchema: false,
  }
}

export const generateRelationshipForMySQL = (
  updatedDataSourceJson: any
): Datasource => {
  const entities = updatedDataSourceJson!.datasource!.entities!
  const datasourceId = updatedDataSourceJson!.datasource!._id!
  const relationShipBody = {
    ...updatedDataSourceJson.datasource,
    entities: {
      ...updatedDataSourceJson.datasource.entities,
      employees: {
        ...entities.employees,
        schema: {
          ...entities.employees.schema,
          salaries: {
            tableId: `${datasourceId}__salaries`,
            name: "salaries",
            relationshipType: "many-to-one",
            fieldName: "salary",
            type: "link",
            main: true,
            _id: generator.string(),
            foreignKey: "emp_no",
          },
        },
      },
      titles: {
        ...entities.titles,
        schema: {
          ...entities.titles.schema,
          employees: {
            tableId: `${datasourceId}__employees`,
            name: "employees",
            relationshipType: "one-to-many",
            fieldName: "emp_no",
            type: "link",
            main: true,
            _id: generator.string(),
            foreignKey: "emp_no",
          },
        },
      },
    },
  }

  return relationShipBody
}
