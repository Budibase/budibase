import { PreviewQueryRequest } from "@budibase/types"

const query = (datasourceId: string, fields: any): any => {
  return {
    datasourceId: datasourceId,
    fields: fields,
    name: "Query 1",
    parameters: {},
    queryVerb: "read",
    schema: {},
    transformer: "return data",
  }
}

export const mariaDB = (datasourceId: string): PreviewQueryRequest => {
  const fields = {
    sql: "SELECT * FROM employees LIMIT 10;",
  }
  return query(datasourceId, fields)
}

export const mongoDB = (datasourceId: string): PreviewQueryRequest => {
  const fields = {
    extra: {
      collection: "movies",
      actionType: "find",
    },
    json: "",
  }
  return query(datasourceId, fields)
}

export const postgres = (datasourceId: string): PreviewQueryRequest => {
  const fields = {
    sql: "SELECT * FROM customers;",
  }
  return query(datasourceId, fields)
}

export const expectedSchemaFields = {
  mariaDB: {
    birth_date: "string",
    emp_no: "number",
    first_name: "string",
    gender: "string",
    hire_date: "string",
    last_name: "string",
  },
  mongoDB: {
    directors: "array",
    genres: "array",
    image: "string",
    plot: "string",
    rank: "number",
    rating: "number",
    release_date: "string",
    running_time_secs: "number",
    title: "string",
    year: "number",
    _id: "json",
  },
  postgres: {
    address: "string",
    city: "string",
    company_name: "string",
    contact_name: "string",
    contact_title: "string",
    country: "string",
    customer_id: "string",
    fax: "string",
    phone: "string",
    postal_code: "string",
    region: "string",
  },
}
