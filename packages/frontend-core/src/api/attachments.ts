import {
  DownloadAttachmentResponse,
  GetSignedUploadUrlRequest,
  GetSignedUploadUrlResponse,
  ProcessAttachmentResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

interface SignedDatasourceUpload extends GetSignedUploadUrlRequest {
  datasourceId: string
}

interface ExternalUpload extends SignedDatasourceUpload {
  data: Blob
}

export interface AttachmentEndpoints {
  downloadAttachment: (
    datasourceId: string,
    rowId: string,
    columnName: string
  ) => Promise<DownloadAttachmentResponse>
  getSignedDatasourceURL: (
    upload: SignedDatasourceUpload
  ) => Promise<GetSignedUploadUrlResponse>
  uploadAttachment: (
    tableId: string,
    data: any
  ) => Promise<ProcessAttachmentResponse>
  uploadBuilderAttachment: (data: any) => Promise<ProcessAttachmentResponse>
  uploadPWAZip: (
    data: FormData
  ) => Promise<{ icons: Array<{ src: string; sizes: string; type: string }> }>
  externalUpload: (
    upload: ExternalUpload
  ) => Promise<{ publicUrl: string | undefined }>
}

export const buildAttachmentEndpoints = (
  API: BaseAPIClient
): AttachmentEndpoints => {
  const endpoints: Pick<AttachmentEndpoints, "getSignedDatasourceURL"> = {
    /**
     * Generates a signed URL to upload a file to an external datasource.
     * @param upload the configured upload destination
     */
    getSignedDatasourceURL: async ({ datasourceId, ...upload }) => {
      return await API.post<
        GetSignedUploadUrlRequest,
        GetSignedUploadUrlResponse
      >({
        url: `/api/attachments/${datasourceId}/url`,
        body: upload,
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

    uploadPWAZip: async data => {
      return await API.post({
        url: "/api/pwa/process-zip",
        body: data,
        json: false,
      })
    },

    /**
     * Uploads a file to an external datasource.
     * @param upload the file and configured upload destination
     */
    externalUpload: async ({ data, ...upload }) => {
      const { signedUrl, publicUrl } =
        await endpoints.getSignedDatasourceURL(upload)
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
