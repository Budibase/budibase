declare module "downloadjs" {
  const download: (
    data: Blob | string,
    filename?: string,
    mimeType?: string
  ) => boolean

  export default download
}
