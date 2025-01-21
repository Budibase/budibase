import {
  DownloadAttachmentResponse,
  GetSignedUploadUrlRequest,
  GetSignedUploadUrlResponse,
  ProcessAttachmentResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface AttachmentEndpoints {
  downloadAttachment: (
    datasourceId: string,
    rowId: string,
    columnName: string
  ) => Promise<DownloadAttachmentResponse>
  getSignedDatasourceURL: (
    datasourceId: string,
    bucket: string,
    key: string
  ) => Promise<GetSignedUploadUrlResponse>
  uploadAttachment: (
    tableId: string,
    data: any
  ) => Promise<ProcessAttachmentResponse>
  uploadBuilderAttachment: (data: any) => Promise<ProcessAttachmentResponse>
  externalUpload: (
    datasourceId: string,
    bucket: string,
    key: string,
    data: any
  ) => Promise<{ publicUrl: string | undefined }>
}

export const buildAttachmentEndpoints = (
  API: BaseAPIClient
): AttachmentEndpoints => {
  const endpoints: Pick<AttachmentEndpoints, "getSignedDatasourceURL"> = {
    /**
     * Generates a signed URL to upload a file to an external datasource.
     * @param datasourceId the ID of the datasource to upload to
     * @param bucket the name of the bucket to upload to
     * @param key the name of the file to upload to
     */
    getSignedDatasourceURL: async (datasourceId, bucket, key) => {
      return await API.post<
        GetSignedUploadUrlRequest,
        GetSignedUploadUrlResponse
      >({
        url: `/api/attachments/${datasourceId}/url`,
        body: { bucket, key },
      })
    },
  }

  return {
    ...endpoints,

    /**
     * Uploads an attachment to the server.
     * @param data the attachment to upload
     * @param tableId the table ID to upload to
     */
    uploadAttachment: async (tableId, data) => {
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
    externalUpload: async (datasourceId, bucket, key, data) => {
      const { signedUrl, publicUrl } = await endpoints.getSignedDatasourceURL(
        datasourceId,
        bucket,
        key
      )
      if (!signedUrl) {
        return { publicUrl: undefined }
      }
      await API.put({
        url: signedUrl,
        body: data,
        json: false,
        external: true,
        parseResponse: response => response as any,
      })
      return { publicUrl }
    },

    /**
     * Download an attachment from a row given its column name.
     * @param datasourceId the ID of the datasource to download from
     * @param rowId the ID of the row to download from
     * @param columnName the column name to download
     */
    downloadAttachment: async (datasourceId, rowId, columnName) => {
      return await API.get({
        url: `/api/${datasourceId}/rows/${rowId}/attachment/${columnName}`,
        parseResponse: response => response as any,
        suppressErrors: true,
      })
    },
  }
}
