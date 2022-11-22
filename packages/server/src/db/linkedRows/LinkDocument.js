const { generateLinkID } = require("../utils")
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

module.exports = LinkDocument
