export const buildAttachmentEndpoints = API => ({
  /**
   * Uploads an attachment to the server.
   * @param data the attachment to upload
   * @param tableId the table ID to upload to
   */
  uploadAttachment: async ({ data, tableId }) => {
    return await API.post({
      url: `/api/attachments/${tableId}/upload`,
      body: data,
      json: false,
    })
  },

  /**
   * Uploads an attachment to the server as a builder user from the builder.
   * @param data the data to upload
   */
  uploadBuilderAttachment: async data => {
    return await API.post({
      url: "/api/attachments/process",
      body: data,
      json: false,
    })
  },

  /**
   * Generates a signed URL to upload a file to an external datasource.
   */
  getSignedDatasourceURL: async (datasourceId, bucket, key) => {
    return await API.post({
      url: `/api/attachments/${datasourceId}/url`,
      body: { bucket, key },
    })
  },

  /**
   * Uploads a file to an external datasource.
   */
  externalUpload: async (datasourceId, bucket, key, data) => {
    const { signedUrl, publicUrl } = await API.getSignedDatasourceURL(
      datasourceId,
      bucket,
      key
    )
    await API.put({
      url: signedUrl,
      body: data,
      json: false,
      external: true,
    })
    return { publicUrl }
  },
})
