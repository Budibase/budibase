const CouchDB = require("../index")
const { IncludeDocs, getLinkDocuments } = require("./linkUtils")
const { generateLinkID } = require("../utils")
const Sentry = require("@sentry/node")
const { FieldTypes } = require("../../constants")

/**
 * Creates a new link document structure which can be put to the database. It is important to
 * note that while this talks about linker/linked the link is bi-directional and for all intent
 * and purposes it does not matter from which direction the link was initiated.
 * @param {string} tableId1 The ID of the first table (the linker).
 * @param {string} tableId2 The ID of the second table (the linked).
 * @param {string} fieldName1 The name of the field in the linker table.
 * @param {string} fieldName2 The name of the field in the linked table.
 * @param {string} rowId1 The ID of the row which is acting as the linker.
 * @param {string} rowId2 The ID of the row which is acting as the linked.
 * @constructor
 */
function LinkDocument(
  tableId1,
  fieldName1,
  rowId1,
  tableId2,
  fieldName2,
  rowId2
) {
  // build the ID out of unique references to this link document
  this._id = generateLinkID(
    tableId1,
    tableId2,
    rowId1,
    rowId2,
    fieldName1,
    fieldName2
  )
  // required for referencing in view
  this.type = FieldTypes.LINK
  this.doc1 = {
    tableId: tableId1,
    fieldName: fieldName1,
    rowId: rowId1,
  }
  this.doc2 = {
    tableId: tableId2,
    fieldName: fieldName2,
    rowId: rowId2,
  }
}

class LinkController {
  constructor({ appId, tableId, row, table, oldTable }) {
    this._appId = appId
    this._db = new CouchDB(appId)
    this._tableId = tableId
    this._row = row
    this._table = table
    this._oldTable = oldTable
  }

  /**
   * Retrieves the table, if it was not already found in the eventData.
   * @returns {Promise<object>} This will return a table based on the event data, either
   * if it was in the event already, or it uses the specified tableId to get it.
   */
  async table() {
    if (this._table == null) {
      this._table =
        this._table == null ? await this._db.get(this._tableId) : this._table
    }
    return this._table
  }

  /**
   * Checks if the table this was constructed with has any linking columns currently.
   * If the table has not been retrieved this will retrieve it based on the eventData.
   * @params {object|null} table If a table that is not known to the link controller is to be tested.
   * @returns {Promise<boolean>} True if there are any linked fields, otherwise it will return
   * false.
   */
  async doesTableHaveLinkedFields(table = null) {
    if (table == null) {
      table = await this.table()
    }
    for (let fieldName of Object.keys(table.schema)) {
      const { type } = table.schema[fieldName]
      if (type === FieldTypes.LINK) {
        return true
      }
    }
    return false
  }

  /**
   * Utility function for main getLinkDocuments function - refer to it for functionality.
   */
  getRowLinkDocs(rowId) {
    return getLinkDocuments({
      appId: this._appId,
      tableId: this._tableId,
      rowId,
      includeDocs: IncludeDocs.INCLUDE,
    })
  }

  /**
   * Utility function for main getLinkDocuments function - refer to it for functionality.
   */
  getTableLinkDocs() {
    return getLinkDocuments({
      appId: this._appId,
      tableId: this._tableId,
      includeDocs: IncludeDocs.INCLUDE,
    })
  }

  // all operations here will assume that the table
  // this operation is related to has linked rows
  /**
   * When a row is saved this will carry out the necessary operations to make sure
   * the link has been created/updated.
   * @returns {Promise<object>} returns the row that has been cleaned and prepared to be written to the DB - links
   * have also been created.
   */
  async rowSaved() {
    const table = await this.table()
    const row = this._row
    const operations = []
    // get link docs to compare against
    const linkDocs = await this.getRowLinkDocs(row._id)
    for (let fieldName of Object.keys(table.schema)) {
      // get the links this row wants to make
      const rowField = row[fieldName]
      const field = table.schema[fieldName]
      if (field.type === FieldTypes.LINK && rowField != null) {
        // check which links actual pertain to the update in this row
        const thisFieldLinkDocs = linkDocs.filter(
          linkDoc =>
            linkDoc.doc1.fieldName === fieldName ||
            linkDoc.doc2.fieldName === fieldName
        )
        const linkDocIds = thisFieldLinkDocs.map(linkDoc => {
          return linkDoc.doc1.rowId === row._id
            ? linkDoc.doc2.rowId
            : linkDoc.doc1.rowId
        })
        // iterate through the link IDs in the row field, see if any don't exist already
        for (let linkId of rowField) {
          if (linkId && linkId !== "" && linkDocIds.indexOf(linkId) === -1) {
            // first check the doc we're linking to exists
            try {
              await this._db.get(linkId)
            } catch (err) {
              // skip links that don't exist
              continue
            }
            operations.push(
              new LinkDocument(
                table._id,
                fieldName,
                row._id,
                field.tableId,
                field.fieldName,
                linkId
              )
            )
          }
        }
        // find the docs that need to be deleted
        let toDeleteDocs = thisFieldLinkDocs
          .filter(doc => {
            let correctDoc =
              doc.doc1.fieldName === fieldName ? doc.doc2 : doc.doc1
            return rowField.indexOf(correctDoc.rowId) === -1
          })
          .map(doc => {
            return { ...doc, _deleted: true }
          })
        // now add the docs to be deleted to the bulk operation
        operations.push(...toDeleteDocs)
        // remove the field from this row, link doc will be added to row on way out
        delete row[fieldName]
      }
    }
    await this._db.bulkDocs(operations)
    return row
  }

  /**
   * When a row is deleted this will carry out the necessary operations to make sure
   * any links that existed have been removed.
   * @returns {Promise<object>} The operation has been completed and the link documents should now
   * be accurate. This also returns the row that was deleted.
   */
  async rowDeleted() {
    const row = this._row
    // need to get the full link docs to be be able to delete it
    const linkDocs = await this.getRowLinkDocs(row._id)
    if (linkDocs.length === 0) {
      return null
    }
    const toDelete = linkDocs.map(doc => {
      return {
        ...doc,
        _deleted: true,
      }
    })
    await this._db.bulkDocs(toDelete)
    return row
  }

  /**
   * Remove a field from a table as well as any linked rows that pertained to it.
   * @param {string} fieldName The field to be removed from the table.
   * @returns {Promise<void>} The table has now been updated.
   */
  async removeFieldFromTable(fieldName) {
    let oldTable = this._oldTable
    let field = oldTable.schema[fieldName]
    const linkDocs = await this.getTableLinkDocs()
    let toDelete = linkDocs.filter(linkDoc => {
      let correctFieldName =
        linkDoc.doc1.tableId === oldTable._id
          ? linkDoc.doc1.fieldName
          : linkDoc.doc2.fieldName
      return correctFieldName === fieldName
    })
    await this._db.bulkDocs(
      toDelete.map(doc => {
        return {
          ...doc,
          _deleted: true,
        }
      })
    )
    // remove schema from other table
    let linkedTable = await this._db.get(field.tableId)
    delete linkedTable.schema[field.fieldName]
    this._db.put(linkedTable)
  }

  /**
   * When a table is saved this will carry out the necessary operations to make sure
   * any linked tables are notified and updated correctly.
   * @returns {Promise<object>} The operation has been completed and the link documents should now
   * be accurate. Also returns the table that was operated on.
   */
  async tableSaved() {
    const table = await this.table()
    const schema = table.schema
    for (let fieldName of Object.keys(schema)) {
      const field = schema[fieldName]
      if (field.type === FieldTypes.LINK) {
        // handle this in a separate try catch, want
        // the put to bubble up as an error, if can't update
        // table for some reason
        let linkedTable
        try {
          linkedTable = await this._db.get(field.tableId)
        } catch (err) {
          continue
        }
        const linkConfig = {
          name: field.fieldName,
          type: FieldTypes.LINK,
          // these are the props of the table that initiated the link
          tableId: table._id,
          fieldName: fieldName,
        }
        if (field.autocolumn) {
          linkConfig.autocolumn = field.autocolumn
        }
        // create the link field in the other table
        linkedTable.schema[field.fieldName] = linkConfig
        const response = await this._db.put(linkedTable)
        // special case for when linking back to self, make sure rev updated
        if (linkedTable._id === table._id) {
          table._rev = response.rev
        }
      }
    }
    return table
  }

  /**
   * Update a table, this means if a field is removed need to handle removing from other table and removing
   * any link docs that pertained to it.
   * @returns {Promise<Object>} The table which has been saved, same response as with the tableSaved function.
   */
  async tableUpdated() {
    const oldTable = this._oldTable
    // first start by checking if any link columns have been deleted
    const newTable = await this.table()
    for (let fieldName of Object.keys(oldTable.schema)) {
      const field = oldTable.schema[fieldName]
      // this field has been removed from the table schema
      if (
        field.type === FieldTypes.LINK &&
        newTable.schema[fieldName] == null
      ) {
        await this.removeFieldFromTable(fieldName)
      }
    }
    // now handle as if its a new save
    return this.tableSaved()
  }

  /**
   * When a table is deleted this will carry out the necessary operations to make sure
   * any linked tables have the joining column correctly removed as well as removing any
   * now stale linking documents.
   * @returns {Promise<object>} The operation has been completed and the link documents should now
   * be accurate. Also returns the table that was operated on.
   */
  async tableDeleted() {
    const table = await this.table()
    const schema = table.schema
    for (let fieldName of Object.keys(schema)) {
      const field = schema[fieldName]
      try {
        if (field.type === FieldTypes.LINK) {
          const linkedTable = await this._db.get(field.tableId)
          delete linkedTable.schema[field.fieldName]
          await this._db.put(linkedTable)
        }
      } catch (err) {
        Sentry.captureException(err)
      }
    }
    // need to get the full link docs to delete them
    const linkDocs = await this.getTableLinkDocs()
    if (linkDocs.length === 0) {
      return null
    }
    // get link docs for this table and configure for deletion
    const toDelete = linkDocs.map(doc => {
      return {
        ...doc,
        _deleted: true,
      }
    })
    await this._db.bulkDocs(toDelete)
    return table
  }
}

module.exports = LinkController
