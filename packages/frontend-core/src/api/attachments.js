export const buildAttachmentEndpoints = API => ({
  /**
   * Uploads an attachment to the server.
   */
  uploadAttachment: async ({ data, tableId }) => {
    return await API.post({
      url: `/api/attachments/${tableId}/upload`,
      body: data,
      json: false,
    })
  },
})
