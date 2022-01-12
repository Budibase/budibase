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

export const uploadToS3 = async (signedUrl, data) => {
  await API.put({
    url: signedUrl,
    body: data,
    json: false,
    external: true,
  })
}
