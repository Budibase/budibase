import { App, AppSearch, Table, TableSearch } from "../definitions"
import getConfig from "next/config"

const { serverRuntimeConfig } = getConfig()
const apiKey = serverRuntimeConfig["apiKey"]
const appName = serverRuntimeConfig["appName"]
const host = serverRuntimeConfig["host"]

let APP: App | null = null
let TABLES: { [key: string]: Table } = {}

export async function makeCall(
  method: string,
  url: string,
  opts?: { body?: any; appId?: string }
): Promise<any> {
  const fetchOpts: any = {
    method,
    headers: {
      "x-budibase-api-key": apiKey,
    },
  }
  if (opts?.appId) {
    fetchOpts.headers["x-budibase-app-id"] = opts.appId
  }
  if (opts?.body) {
    fetchOpts.body =
      typeof opts.body !== "string" ? JSON.stringify(opts.body) : opts.body
    fetchOpts.headers["Content-Type"] = "application/json"
  }
  const finalUrl = `${host}/api/public/v1/${url}`
  const response = await fetch(finalUrl, fetchOpts)
  if (response.ok) {
    return response.json()
  } else {
    const error = await response.text()
    console.error("Budibase server error - ", error)
    throw new Error(error)
  }
}

export async function getApp(): Promise<App> {
  if (APP) {
    return APP
  }
  const apps: AppSearch = await makeCall("post", "applications/search", {
    body: {
      name: appName,
    },
  })
  const app = apps.data.find((app: App) => app.name === appName)
  if (!app) {
    throw new Error(
      "Could not find app, please make sure app name in config is correct."
    )
  }
  APP = app
  return app
}

export async function findTable(
  appId: string,
  tableName: string
): Promise<Table> {
  if (TABLES[tableName]) {
    return TABLES[tableName]
  }
  const tables: TableSearch = await makeCall("post", "tables/search", {
    body: {
      name: tableName,
    },
    appId,
  })
  const table = tables.data.find((table: Table) => table.name === tableName)
  if (!table) {
    throw new Error(
      "Could not find table, please make sure your app is configured with the Postgres datasource correctly."
    )
  }
  TABLES[tableName] = table
  return table
}
