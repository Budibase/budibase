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
