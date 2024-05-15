export const buildAttachmentEndpoints = API => {
  /**
   * Generates a signed URL to upload a file to an external datasource.
   * @param datasourceId the ID of the datasource to upload to
   * @param bucket the name of the bucket to upload to
   * @param key the name of the file to upload to
   */
  const getSignedDatasourceURL = async ({ datasourceId, bucket, key }) => {
    return await API.post({
      url: `/api/attachments/${datasourceId}/url`,
      body: { bucket, key },
    })
  }

  return {
    getSignedDatasourceURL,

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
     * Uploads a file to an external datasource.
     * @param datasourceId the ID of the datasource to upload to
     * @param bucket the name of the bucket to upload to
     * @param key the name of the file to upload to
     * @param data the file to upload
     */
    externalUpload: async ({ datasourceId, bucket, key, data }) => {
      const { signedUrl, publicUrl } = await getSignedDatasourceURL({
        datasourceId,
        bucket,
        key,
      })
      await API.put({
        url: signedUrl,
        body: data,
        json: false,
        external: true,
      })
      return { publicUrl }
    },
    /**
     * Download an attachment from a row given its column name.
     * @param datasourceId the ID of the datasource to download from
     * @param rowId the ID of the row to download from
     * @param columnName the column name to download
     */
    downloadAttachment: async (datasourceId, rowId, columnName, options) => {
      return await API.get({
        url: `/api/${datasourceId}/rows/${rowId}/attachment/${columnName}`,
        parseResponse: response => response,
        suppressErrors: options?.suppressErrors,
      })
    },
  }
}
