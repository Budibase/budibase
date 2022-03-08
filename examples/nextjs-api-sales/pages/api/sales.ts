import getConfig from "next/config"
import {App, AppSearch, Table, TableSearch} from "../../definitions"

const { serverRuntimeConfig } = getConfig()
const apiKey = serverRuntimeConfig["apiKey"]
const appName = serverRuntimeConfig["appName"]
const host = serverRuntimeConfig["host"]

let APP: App | null = null
let TABLES: { [key: string]: Table } = {}

async function makeCall(method: string, url: string, opts?: { body?: any, appId?: string }): Promise<any> {
  const fetchOpts: any = {
    method,
    headers: {
      "x-budibase-api-key": apiKey,
    }
  }
  if (opts?.appId) {
    fetchOpts.headers["x-budibase-app-id"] = opts.appId
  }
  if (opts?.body) {
    fetchOpts.body = typeof opts.body !== "string" ? JSON.stringify(opts.body) : opts.body
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

async function getApp(): Promise<App> {
  if (APP) {
    return APP
  }
  const apps: AppSearch = await makeCall("post", "applications/search", {
    body: {
      name: appName,
    }
  })
  const app = apps.data.find((app: App) => app.name === appName)
  if (!app) {
    throw new Error("Could not find app, please make sure app name in config is correct.")
  }
  APP = app
  return app
}

async function findTable(appId: string, tableName: string): Promise<Table> {
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
    throw new Error("Could not find table, please make sure your app is configured with the Postgres datasource correctly.")
  }
  TABLES[tableName] = table
  return table
}

async function getSales(req: any) {
  const { page } = req.query
  const { _id: appId } = await getApp()
  const table = await findTable(appId, "sales")
  return await makeCall("post", `tables/${table._id}/rows/search`, {
    appId,
    body: {
      limit: 10,
      sort: {
        type: "string",
        order: "ascending",
        column: "sale_id",
      },
      paginate: true,
      bookmark: parseInt(page),
    }
  })
}

async function saveSale(req: any) {
  const { _id: appId } = await getApp()
  const table = await findTable(appId, "sales")
  return await makeCall("post", `tables/${table._id}/rows`, {
    body: req.body,
    appId,
  })
}

export default async function handler(req: any, res: any) {
  let response: any = {}
  try {
    if (req.method === "POST") {
      response = await saveSale(req)
    } else if (req.method === "GET") {
      response = await getSales(req)
    } else {
      res.status(404)
      return
    }
    res.status(200).json(response)
  } catch (err: any) {
    res.status(400).send(err)
  }
}