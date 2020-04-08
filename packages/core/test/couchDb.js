import { isUndefined, isString } from "lodash"
import initialiseNano from "nano"

export const getTestDb = async () => {
  const nano = initialiseNano("http://admin:password@127.0.0.1:5984")
  try {
    await nano.db.destroy("unit_tests")
  } catch (_) {
    // do nothing
  }
  await nano.db.create("unit_tests")
  const db = nano.use("unit_tests")
  await db.insert({ _id: "/", folderMarker, items: [] })
  return db
}

const folderMarker = "OH-YES-ITSA-FOLDER-"
const isFolder = val => {
  if (isUndefined(val)) {
    throw new Error("Passed undefined value for folder")
  }
  return val.folderMarker === folderMarker
}

export const createFile = db => async (key, content) => {
  return await db.insert({ _id: key, ...content })
}

export const updateFile = db => async (key, content) => {
  if (!content._rev) {
    throw new Error("not an update: no _rev supplied")
  }
  return await db.insert({ _id: key, ...content })
}

export const writableFileStream = db => async key => {
  throw new Error("WRITABLE STREAM: souldn't need this")
}

export const readableFileStream = db => async key => {
  throw new Error("READABLE STREAM: souldn't need this")
}

export const getFileSize = data => async path => {
  throw new Error("GET FILE SIZE: should'nt need this")
}

export const renameFile = db => async (oldKey, newKey) => {
  // used by indexing and Files  - wont be needed
  throw new Error(
    "RENAME FILE: not clear how to do this in CouchDB - we probably dont need it"
  )
}

export const loadFile = db => async key => {
  return await db.get(key)
}

export const exists = db => async key => {
  try {
    await db.head(key)
    return true
  } catch (_) {
    return false
  }
}

export const deleteFile = db => async keyOrDoc => {
  const doc = isString(keyOrDoc) ? await db.get(keyOrDoc) : keyOrDoc
  const key = isString(keyOrDoc) ? keyOrDoc : doc._id
  if (isFolder(doc))
    throw new Error("DeleteFile: Path " + key + " is a folder, not a file")
  await db.destroy(key)
}
export const createFolder = db => async key => {
  await db.insert({ _id: key, folderMarker, items: [] })
}

export const deleteFolder = db => async keyOrDoc => {
  throw new Error("DELETE FOLDER: should not be needed")
}

export const getFolderContents = db => async key => {
  const doc = await db.get(key)
  if (!isFolder(doc)) throw new Error("Not a folder: " + key)
  return doc.items
}

export default db => {
  return {
    createFile: createFile(db),
    updateFile: updateFile(db),
    loadFile: loadFile(db),
    exists: exists(db),
    deleteFile: deleteFile(db),
    createFolder: createFolder(db),
    deleteFolder: deleteFolder(db),
    readableFileStream: readableFileStream(db),
    writableFileStream: writableFileStream(db),
    renameFile: renameFile(db),
    getFolderContents: getFolderContents(db),
    getFileSize: getFileSize(db),
    datastoreType: "couchdb",
    datastoreDescription: "",
    data: db,
  }
}
