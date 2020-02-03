import { getNew, getNewChild } from "./getNew"
import { load } from "./load"
import { validate } from "./validate"
import { getContext } from "./getContext"
import { save } from "./save"
import { deleteRecord } from "./delete"
import { uploadFile } from "./uploadFile"
import { downloadFile } from "./downloadFile"
import { customId, setCustomId } from "./customId"

const api = app => ({
  getNew: getNew(app),
  getNewChild: getNewChild(app),
  save: save(app),
  load: load(app),
  delete: deleteRecord(app, false),
  validate: validate(app),
  getContext: getContext(app),
  uploadFile: uploadFile(app),
  downloadFile: downloadFile(app),
  customId: customId(app),
  setCustomId: setCustomId(app),
})

export const getRecordApi = app => api(app)

export default getRecordApi
