const {
  ObjectStore,
  makeSureBucketExists,
  upload,
  deleteFiles,
  streamUpload,
  retrieve,
  retrieveToTmp,
  retrieveDirectory,
  deleteFolder,
  uploadDirectory,
  downloadTarball,
  downloadTarballDirect,
} = require("@budibase/backend-core/objectStore")

/***********************************
 *              NOTE               *
 * This file purely exists so that *
 *  the object store functionality *
 *   can easily be mocked out of   *
 *  the server without mocking the *
 *      entire core library.       *
 ***********************************/

exports.ObjectStore = ObjectStore
exports.makeSureBucketExists = makeSureBucketExists
exports.upload = upload
exports.streamUpload = streamUpload
exports.retrieve = retrieve
exports.retrieveToTmp = retrieveToTmp
exports.retrieveDirectory = retrieveDirectory
exports.deleteFolder = deleteFolder
exports.uploadDirectory = uploadDirectory
exports.downloadTarball = downloadTarball
exports.downloadTarballDirect = downloadTarballDirect
exports.deleteFiles = deleteFiles
