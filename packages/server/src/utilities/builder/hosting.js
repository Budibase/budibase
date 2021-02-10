const CouchDB = require("../../db")
const { BUILDER_CONFIG_DB, HOSTING_DOC } = require("../../constants")
const fetch = require("node-fetch")
const env = require("../../environment")

const PROD_HOSTING_URL = "app.budi.live"

function getProtocol(hostingInfo) {
  return hostingInfo.useHttps ? "https://" : "http://"
}

async function getURLWithPath(pathIfSelfHosted) {
  const hostingInfo = await exports.getHostingInfo()
  const protocol = getProtocol(hostingInfo)
  const path =
    hostingInfo.type === exports.HostingTypes.SELF ? pathIfSelfHosted : ""
  return `${protocol}${hostingInfo.hostingUrl}${path}`
}

exports.HostingTypes = {
  CLOUD: "cloud",
  SELF: "self",
}

exports.getHostingInfo = async () => {
  const db = new CouchDB(BUILDER_CONFIG_DB)
  let doc
  try {
    doc = await db.get(HOSTING_DOC)
  } catch (err) {
    // don't write this doc, want to be able to update these default props
    // for our servers with a new release without needing to worry about state of
    // PouchDB in peoples installations
    doc = {
      _id: HOSTING_DOC,
      type: exports.HostingTypes.CLOUD,
      hostingUrl: PROD_HOSTING_URL,
      selfHostKey: "",
      templatesUrl: "prod-budi-templates.s3-eu-west-1.amazonaws.com",
      useHttps: true,
    }
  }
  return doc
}

exports.getAppUrl = async appId => {
  const hostingInfo = await exports.getHostingInfo()
  const protocol = getProtocol(hostingInfo)
  let url
  if (hostingInfo.type === exports.HostingTypes.CLOUD) {
    url = `${protocol}${appId}.${hostingInfo.hostingUrl}`
  } else {
    url = `${protocol}${hostingInfo.hostingUrl}/app`
  }
  return url
}

exports.getWorkerUrl = async () => {
  return getURLWithPath("/worker")
}

exports.getMinioUrl = async () => {
  return getURLWithPath("/")
}

exports.getCouchUrl = async () => {
  return getURLWithPath("/db")
}

exports.getSelfHostKey = async () => {
  const hostingInfo = await exports.getHostingInfo()
  return hostingInfo.selfHostKey
}

exports.getTemplatesUrl = async (appId, type, name) => {
  const hostingInfo = await exports.getHostingInfo()
  const protocol = getProtocol(hostingInfo)
  let path
  if (type && name) {
    path = `templates/type/${name}.tar.gz`
  } else {
    path = "manifest.json"
  }
  return `${protocol}${hostingInfo.templatesUrl}/${path}`
}

exports.getDeployedApps = async () => {
  const hostingInfo = await exports.getHostingInfo()
  if (
    (!env.CLOUD && hostingInfo.type === exports.HostingTypes.CLOUD) ||
    (env.CLOUD && !env.SELF_HOSTED)
  ) {
    throw "Can only check apps for self hosted environments"
  }
  const workerUrl = !env.CLOUD ? await exports.getWorkerUrl() : env.WORKER_URL
  const hostingKey = !env.CLOUD ? hostingInfo.selfHostKey : env.HOSTING_KEY
  try {
    const response = await fetch(`${workerUrl}/api/apps`, {
      method: "GET",
      headers: {
        "x-budibase-auth": hostingKey,
      },
    })
    const json = await response.json()
    for (let value of Object.values(json)) {
      if (value.url) {
        value.url = value.url.toLowerCase()
      }
    }
    return json
  } catch (err) {
    // error, cannot determine deployed apps, don't stop app creation - sort this later
    return {}
  }
}
