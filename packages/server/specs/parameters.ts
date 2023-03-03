export const tableId = {
  in: "path",
  name: "tableId",
  required: true,
  description: "The ID of the table which this request is targeting.",
  schema: {
    type: "string",
  },
}

export const rowId = {
  in: "path",
  name: "rowId",
  required: true,
  description: "The ID of the row which this request is targeting.",
  schema: {
    type: "string",
  },
}

export const appId = {
  in: "header",
  name: "x-budibase-app-id",
  required: true,
  description: "The ID of the app which this request is targeting.",
  schema: {
    type: "string",
  },
}

export const appIdUrl = {
  in: "path",
  name: "appId",
  required: true,
  description: "The ID of the app which this request is targeting.",
  schema: {
    type: "string",
  },
}

export const queryId = {
  in: "path",
  name: "queryId",
  required: true,
  description: "The ID of the query which this request is targeting.",
  schema: {
    type: "string",
  },
}

export const userId = {
  in: "path",
  name: "userId",
  required: true,
  description: "The ID of the user which this request is targeting.",
  schema: {
    type: "string",
  },
}
