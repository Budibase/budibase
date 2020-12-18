const CouchDB = require("../../db")
const { BUILDER_CONFIG_DB, HOSTING_DOC } = require("../../constants")

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
      appUrl: "app.budi.live",
      workerUrl: "",
      minioUrl: "",
      couchUrl: "",
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
  if (hostingInfo.type === "cloud") {
    url = `${protocol}${appId}.${hostingInfo.appUrl}`
  } else {
    url = `${protocol}${hostingInfo.appUrl}`
  }
  return url
}

exports.getWorkerUrl = async () => {
  const hostingInfo = await exports.getHostingInfo()
  const protocol = getProtocol(hostingInfo)
  return `${protocol}${hostingInfo.workerUrl}`
}

exports.getMinioUrl = async () => {
  const hostingInfo = await exports.getHostingInfo()
  const protocol = getProtocol(hostingInfo)
  return `${protocol}${hostingInfo.minioUrl}`
}

exports.getCouchUrl = async () => {
  const hostingInfo = await exports.getHostingInfo()
  const protocol = getProtocol(hostingInfo)
  return `${protocol}${hostingInfo.couchUrl}`
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
