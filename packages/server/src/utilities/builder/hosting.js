const CouchDB = require("../../db")
const { BUILDER_CONFIG_DB, HOSTING_DOC } = require("../../constants")
const { join } = require("path")

function getProtocol(hostingInfo) {
  return hostingInfo.useHttps ? "https://" : "http://"
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
      appServerUrl: "app.budi.live",
      objectStoreUrl: "cdn.app.budi.live",
      templatesUrl: "prod-budi-templates.s3-eu-west-1.amazonaws.com",
      useHttps: true,
    }
  }
  return doc
}

exports.getAppServerUrl = async appId => {
  const hostingInfo = await exports.getHostingInfo()
  const protocol = getProtocol(hostingInfo)
  let url
  if (hostingInfo.type === "cloud") {
    url = `${protocol}${appId}.${hostingInfo.appServerUrl}`
  } else {
    url = `${protocol}${hostingInfo.appServerUrl}`
  }
  return url
}

exports.getTemplatesUrl = async (appId, type, name) => {
  const hostingInfo = await exports.getHostingInfo()
  const protocol = getProtocol(hostingInfo)
  let path
  if (type && name) {
    path = join("templates", type, `${name}.tar.gz`)
  } else {
    path = "manifest.json"
  }
  return join(`${protocol}${hostingInfo.templatesUrl}`, path)
}
