import api from "./api"

/**
 * Uploads an attachment to the server.
 */
export const uploadAttachment = async data => {
  return await api.post({
    url: "/api/attachments/upload",
    body: data,
    json: false,
  })
}
