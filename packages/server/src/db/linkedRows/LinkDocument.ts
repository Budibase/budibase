import { generateLinkID } from "../utils"
import { FieldTypes } from "../../constants"
import { LinkDocument } from "@budibase/types"

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
class LinkDocumentImpl implements LinkDocument {
  _id: string
  type: string
  doc1: {
    rowId: string
    fieldName: string
    tableId: string
  }
  doc2: {
    rowId: string
    fieldName: string
    tableId: string
  }
  constructor(
    tableId1: string,
    fieldName1: string,
    rowId1: string,
    tableId2: string,
    fieldName2: string,
    rowId2: string
  ) {
    this._id = generateLinkID(
      tableId1,
      tableId2,
      rowId1,
      rowId2,
      fieldName1,
      fieldName2
    )
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
}

export default LinkDocumentImpl
