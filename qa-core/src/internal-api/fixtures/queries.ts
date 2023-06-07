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
    _id: "string",
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
  restAPI: {
    abilities: "array",
    base_experience: "number",
    forms: "array",
    game_indices: "array",
    height: "number",
    held_items: "array",
    id: "number",
    is_default: "string",
    location_area_encounters: "string",
    moves: "array",
    name: "string",
    order: "number",
    past_types: "array",
    species: "json",
    sprites: "json",
    stats: "array",
    types: "array",
    weight: "number",
  },
}

const request = (datasourceId: string, fields: any, flags: any): any => {
  return {
    datasourceId: datasourceId,
    fields: fields,
    flags: flags,
    name: "Query 1",
    parameters: {},
    queryVerb: "read",
    schema: {},
    transformer: "return data",
  }
}
export const restAPI = (datasourceId: string): PreviewQueryRequest => {
  const fields = {
    authConfigId: null,
    bodyType: "none",
    disabledHeaders: {},
    headers: {},
    pagination: {},
    path: `${process.env.REST_API_BASE_URL}/pokemon/ditto`,
    queryString: "",
  }
  const flags = {
    urlName: true,
  }
  return request(datasourceId, fields, flags)
}
