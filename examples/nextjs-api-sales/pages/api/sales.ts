import getConfig from "next/config"
import fetch from "node-fetch"
import { App, AppSearch, RowSearch } from "../../definitions"

const { serverRuntimeConfig } = getConfig()
const apiKey = serverRuntimeConfig["apiKey"]
const appName = serverRuntimeConfig["appName"]
const host = serverRuntimeConfig["host"]

async function makeCall(method: string, url: string, opts?: { body?: any, appId?: string } = {}): Promise<any> {
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
    fetchOpts.body = JSON.stringify(opts?.body)
    fetchOpts.headers["Content-Type"] = "application/json"
  }
  const response = await fetch(`${host}/public/v1/${url}`, fetchOpts)
  if (response.status === 200) {
    return response.json()
  } else {
    throw new Error(await response.text())
  }
}

async function getApp(): Promise<App> {
  const apps: AppSearch = await makeCall("post", "applications/search", {
    body: {
      name: appName,
    }
  })
  if (!Array.isArray(apps?.data)) {
    throw new Error("Fatal error, no apps found.")
  }
  const app = apps.data.find((app: App) => app.name === appName)
  if (!app) {
    throw new Error("Could not find app, please make sure app name in config is correct.")
  }
  return app
}

async function getSales(req: any) {
  const { _id: appId } = await getApp()
}

async function saveSale(req: any) {
  const { _id: appId } = await getApp()
}

export default async function handler(req: any, res: any) {
  let response: any = {}
  if (req.method === "POST") {
    response = await saveSale(req)
  } else if (req.method === "GET") {
    response = await getSales(req)
  } else {
    res.status(404)
  }
  res.status(200).json(response)
}