import { createAPIClient, Constants } from "@budibase/frontend-core"
import { notificationStore } from "./stores"
import { FieldTypes } from "./constants"

export const API = createAPIClient({
  // Attach client specific headers
  attachHeaders: headers => {
    // Attach app ID header
    headers["x-budibase-app-id"] = window["##BUDIBASE_APP_ID##"]

    // Attach client header if not inside the builder preview
    if (!window["##BUDIBASE_IN_BUILDER##"]) {
      headers["x-budibase-type"] = "client"
    }
  },

  // Show an error notification for all API failures.
  // We could also log these to sentry.
  // Or we could check error.status and redirect to login on a 403 etc.
  onError: error => {
    const { status, method, url, message, handled } = error || {}

    // Log any errors that we haven't manually handled
    if (!handled) {
      console.error("Unhandled error from API client", error)
      return
    }

    // Notify all errors
    if (message) {
      // Don't notify if the URL contains the word analytics as it may be
      // blocked by browser extensions
      if (!url?.includes("analytics")) {
        notificationStore.actions.error(message)
      }
    }

    // Log all errors to console
    console.warn(`[Client] HTTP ${status} on ${method}:${url}\n\t${message}`)
  },

  // Patch certain endpoints with functionality specific to client apps
  patches: {
    // Enrich rows so they properly handle client bindings
    fetchSelf: async ({ output }) => {
      const user = output
      if (user && user._id) {
        if (user.roleId === "PUBLIC") {
          // Don't try to enrich a public user as it will 403
          return user
        } else {
          return (await enrichRows([user], Constants.TableNames.USERS))[0]
        }
      } else {
        return null
      }
    },
    fetchRelationshipData: async ({ params, output }) => {
      const tableId = params[0]?.tableId
      return await enrichRows(output, tableId)
    },
    fetchTableData: async ({ params, output }) => {
      const tableId = params[0]
      return await enrichRows(output, tableId)
    },
    searchTable: async ({ params, output }) => {
      const tableId = params[0]?.tableId
      return {
        ...output,
        rows: await enrichRows(output?.rows, tableId),
      }
    },
    fetchViewData: async ({ params, output }) => {
      const tableId = params[0]?.tableId
      return await enrichRows(output, tableId)
    },

    // Wipe any HBS formulae from table definitions, as these interfere with
    // handlebars enrichment
    fetchTableDefinition: async ({ output }) => {
      Object.keys(output?.schema || {}).forEach(field => {
        if (output.schema[field]?.type === "formula") {
          delete output.schema[field].formula
        }
      })
      return output
    },
  },
})

/**
 * Enriches rows which contain certain field types so that they can
 * be properly displayed.
 * The ability to create these bindings has been removed, but they will still
 * exist in client apps to support backwards compatibility.
 */
const enrichRows = async (rows, tableId) => {
  if (!Array.isArray(rows)) {
    return []
  }
  if (rows.length) {
    const tables = {}
    for (let row of rows) {
      // Fall back to passed in tableId if row doesn't have it specified
      let rowTableId = row.tableId || tableId
      let table = tables[rowTableId]
      if (!table) {
        // Fetch table schema so we can check column types
        table = await API.fetchTableDefinition(rowTableId)
        tables[rowTableId] = table
      }
      const schema = table?.schema
      if (schema) {
        const keys = Object.keys(schema)
        for (let key of keys) {
          const type = schema[key].type
          if (type === FieldTypes.LINK && Array.isArray(row[key])) {
            // Enrich row a string join of relationship fields
            row[`${key}_text`] =
              row[key]
                ?.map(option => option?.primaryDisplay)
                .filter(option => !!option)
                .join(", ") || ""
          } else if (type === "attachment") {
            // Enrich row with the first image URL for any attachment fields
            let url = null
            if (Array.isArray(row[key]) && row[key][0] != null) {
              url = row[key][0].url
            }
            row[`${key}_first`] = url
          }
        }
      }
    }
  }
  return rows
}
