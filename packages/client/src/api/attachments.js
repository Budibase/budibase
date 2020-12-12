import API from "./api"

/**
 * Uploads an attachment to the server.
 */
export const uploadAttachment = async data => {
  return await API.post({
    url: "/api/attachments/upload",
    body: data,
    json: false,
  })
}
