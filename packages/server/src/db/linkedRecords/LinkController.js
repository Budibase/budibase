const CouchDB = require("../index")
const linkedRecords = require("./index")

/**
 * Creates a new link document structure which can be put to the database. It is important to
 * note that while this talks about linker/linked the link is bi-directional and for all intent
 * and purposes it does not matter from which direction the link was initiated.
 * @param {string} modelId1 The ID of the first model (the linker).
 * @param {string} modelId2 The ID of the second model (the linked).
 * @param {string} fieldName1 The name of the field in the linker table.
 * @param {string} fieldName2 The name of the field in the linked table.
 * @param {string} recordId1 The ID of the record which is acting as the linker.
 * @param {string} recordId2 The ID of the record which is acting as the linked.
 * @constructor
 */
function LinkDocument(
  modelId1,
  fieldName1,
  recordId1,
  modelId2,
  fieldName2,
  recordId2
) {
  // build the ID out of unique references to this link document
  this._id = `${modelId1}/${modelId2}/${fieldName1}/${fieldName2}/${recordId1}/${recordId2}`
  // required for referencing in view
  this.type = "link"
  this.doc1 = {
    modelId: modelId1,
    fieldName: fieldName1,
    recordId: recordId1,
  }
  this.doc2 = {
    modelId: modelId2,
    fieldName: fieldName2,
    recordId: recordId2,
  }
}

class LinkController {
  constructor({ instanceId, modelId, record, model }) {
    this._instanceId = instanceId
    this._db = new CouchDB(instanceId)
    this._modelId = modelId
    this._record = record
    this._model = model
  }

  /**
   * Retrieves the model, if it was not already found in the eventData.
   * @returns {Promise<object>} This will return a model based on the event data, either
   * if it was in the event already, or it uses the specified modelId to get it.
   */
  async model() {
    if (this._model == null) {
      this._model =
        this._model == null ? await this._db.get(this._modelId) : this._model
    }
    return this._model
  }

  /**
   * Checks if the model this was constructed with has any linking columns currently.
   * If the model has not been retrieved this will retrieve it based on the eventData.
   * @returns {Promise<boolean>} True if there are any linked fields, otherwise it will return
   * false.
   */
  async doesModelHaveLinkedFields() {
    const model = await this.model()
    for (let fieldName of Object.keys(model.schema)) {
      const { type } = model.schema[fieldName]
      if (type === "link") {
        return true
      }
    }
    return false
  }

  /**
   * Utility function for main getLinkDocuments function - refer to it for functionality.
   */
  getLinkDocs(recordId = null) {
    return linkedRecords.getLinkDocuments({
      instanceId: this._instanceId,
      modelId: this._modelId,
      recordId,
      includeDocs: false,
    })
  }

  // all operations here will assume that the model
  // this operation is related to has linked records
  /**
   * When a record is saved this will carry out the necessary operations to make sure
   * the link has been created/updated.
   * @returns {Promise<object>} returns the record that has been cleaned and prepared to be written to the DB - links
   * have also been created.
   */
  async recordSaved() {
    const model = await this.model()
    const record = this._record
    const operations = []
    // get link docs to compare against
    const linkVals = await this.getLinkDocs(record._id)
    for (let fieldName of Object.keys(model.schema)) {
      // get the links this record wants to make
      const recordField = record[fieldName]
      const field = model.schema[fieldName]
      if (
        field.type === "link" &&
        recordField != null &&
        recordField.length !== 0
      ) {
        // check which links actual pertain to the update in this record
        let linkDocIds = linkVals.filter(
          linkVal => linkVal.fieldName === fieldName
        )
        linkDocIds = linkDocIds.map(linkVal => linkVal.id)
        // iterate through the link IDs in the record field, see if any don't exist already
        for (let linkId of recordField) {
          if (linkId && linkId !== "" && linkDocIds.indexOf(linkId) === -1) {
            operations.push(
              new LinkDocument(
                model._id,
                fieldName,
                record._id,
                field.modelId,
                field.fieldName,
                linkId
              )
            )
          }
          // work out any that need to be deleted
          const toDeleteIds = linkDocIds.filter(
            id => recordField.indexOf(id) === -1
          )
          operations.concat(
            toDeleteIds.map(id => ({ _id: id, _deleted: true }))
          )
        }
        // replace this field with a simple entry to denote there are links
        delete record[fieldName]
      }
    }
    await this._db.bulkDocs(operations)
    return record
  }

  /**
   * When a record is deleted this will carry out the necessary operations to make sure
   * any links that existed have been removed.
   * @returns {Promise<object>} The operation has been completed and the link documents should now
   * be accurate. This also returns the record that was deleted.
   */
  async recordDeleted() {
    const record = this._record
    // need to get the full link docs to be be able to delete it
    const linkDocIds = await this.getLinkDocs(record._id).map(
      linkVal => linkVal.id
    )
    if (linkDocIds.length === 0) {
      return null
    }
    const toDelete = linkDocIds.map(id => {
      return {
        _id: id,
        _deleted: true,
      }
    })
    await this._db.bulkDocs(toDelete)
    return record
  }

  /**
   * When a model is saved this will carry out the necessary operations to make sure
   * any linked models are notified and updated correctly.
   * @returns {Promise<object>} The operation has been completed and the link documents should now
   * be accurate. Also returns the model that was operated on.
   */
  async modelSaved() {
    const model = await this.model()
    const schema = model.schema
    for (let fieldName of Object.keys(schema)) {
      const field = schema[fieldName]
      if (field.type === "link") {
        // create the link field in the other model
        const linkedModel = await this._db.get(field.modelId)
        linkedModel.schema[field.fieldName] = {
          name: field.fieldName,
          type: "link",
          // these are the props of the table that initiated the link
          modelId: model._id,
          fieldName: fieldName,
        }
        await this._db.put(linkedModel)
      }
    }
    return model
  }

  /**
   * When a model is deleted this will carry out the necessary operations to make sure
   * any linked models have the joining column correctly removed as well as removing any
   * now stale linking documents.
   * @returns {Promise<object>} The operation has been completed and the link documents should now
   * be accurate. Also returns the model that was operated on.
   */
  async modelDeleted() {
    const model = await this.model()
    const schema = model.schema
    for (let fieldName of Object.keys(schema)) {
      const field = schema[fieldName]
      if (field.type === "link") {
        const linkedModel = await this._db.get(field.modelId)
        delete linkedModel.schema[model.name]
        await this._db.put(linkedModel)
      }
    }
    // need to get the full link docs to delete them
    const linkDocIds = await this.getLinkDocs().map(linkVal => linkVal.id)
    if (linkDocIds.length === 0) {
      return null
    }
    // get link docs for this model and configure for deletion
    const toDelete = linkDocIds.map(id => {
      return {
        _id: id,
        _deleted: true,
      }
    })
    await this._db.bulkDocs(toDelete)
    return model
  }
}

module.exports = LinkController
