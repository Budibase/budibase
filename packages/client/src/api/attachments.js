import API from "./api"

/**
 * Uploads an attachment to the server.
 */
export const uploadAttachment = async (data, tableId = "") => {
  return await API.post({
    url: `/api/attachments/${tableId}/upload`,
    body: data,
    json: false,
  })
}

/**
 * Generates a signed URL to upload a file to an external datasource.
 */
export const getSignedDatasourceURL = async (datasourceId, bucket, key) => {
  if (!datasourceId) {
    return null
  }
  const res = await API.post({
    url: `/api/attachments/${datasourceId}/url`,
    body: { bucket, key },
  })
  return res?.signedUrl
}

/**
 * Uploads a file to an external datasource.
 */
export const externalUpload = async (datasourceId, bucket, key, data) => {
  const signedUrl = await getSignedDatasourceURL(datasourceId, bucket, key)
  await API.put({
    url: signedUrl,
    body: data,
    json: false,
    external: true,
  })
}
