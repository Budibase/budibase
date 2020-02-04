import {
  SharedKeyCredential,
  BlockBlobURL,
  BlobURL,
  ContainerURL,
  ServiceURL,
  StorageURL,
  Aborter,
} from "@azure/storage-blob"

export const createFile = ({ containerUrl }) => async (key, content) => {
  const blobURL = BlobURL.fromContainerURL(containerURL, key)
  const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL)
  await blockBlobURL.upload(Aborter.none, content, content.length)
}

export const updateFile = opts => async (path, content) =>
  createFile(opts)(path, content)

export const loadFile = ({ containerUrl }) => async key => {
  const blobURL = BlobURL.fromContainerURL(containerUrl, key)

  const downloadBlockBlobResponse = await blobURL.download(Aborter.none, 0)

  return downloadBlockBlobResponse.readableStreamBody
    .read(content.length)
    .toString()
}

export const exists = ({ containerURL }) => async key => {
  const blobURL = BlobURL.fromContainerURL(containerURL, key)
  const getPropsResponse = await blobURL.getProperties()
  return getPropsResponse._response.StatusCode === 200
}

export const deleteFile = ({ containerURL }) => async key => {
  const blobURL = BlobURL.fromContainerURL(containerURL, key)
  await blobURL.delete(Aborter.none)
}

export const createContainer = ({ containerUrl }) => async () =>
  await containerUrl.create(Aborter.none)

export const deleteContainer = ({ containerUrl }) => async () =>
  await containerUrl.delete(Aborter.none)

const initialise = opts => {
  const sharedKeyCredential = new SharedKeyCredential(
    opts.account,
    opts.accountKey
  )

  const pipeline = StorageURL.newPipeline(sharedKeyCredential)

  const serviceURL = new ServiceURL(
    `https://${account}.blob.core.windows.net`,
    pipeline
  )

  const containerURL = ContainerURL.fromServiceURL(
    serviceURL,
    opts.containerName
  )

  return {
    containerURL,
  }
}

export default opts => {
  const access = initialise(opts)
  return {
    createFile: createFile(access),
    updateFile: updateFile(access),
    loadFile: loadFile(access),
    exists: exists(access),

    datastoreType: "azure-blob-storage",
    datastoreDescription: "",
    data,
  }
}
