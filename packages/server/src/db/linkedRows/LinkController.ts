import { IncludeDocs, getLinkDocuments } from "./linkUtils"
import { InternalTables, getUserMetadataParams } from "../utils"
import Sentry from "@sentry/node"
import { FieldTypes } from "../../constants"
import { context } from "@budibase/backend-core"
import LinkDocument from "./LinkDocument"
import {
  Database,
  FieldSchema,
  FieldType,
  LinkDocumentValue,
  RelationshipFieldMetadata,
  RelationshipType,
  Row,
  Table,
} from "@budibase/types"

type LinkControllerOpts = {
  tableId?: string
  row?: Row
  table?: Table
  oldTable?: Table
}

class LinkController {
  _db: Database
  _tableId?: string
  _row?: Row
  _table?: Table
  _oldTable?: Table

  constructor({ tableId, row, table, oldTable }: LinkControllerOpts) {
    this._db = context.getAppDB()
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
    return this._table!
  }

  /**
   * Checks if the table this was constructed with has any linking columns currently.
   * If the table has not been retrieved this will retrieve it based on the eventData.
   * @params {object|null} table If a table that is not known to the link controller is to be tested.
   * @returns {Promise<boolean>} True if there are any linked fields, otherwise it will return
   * false.
   */
  async doesTableHaveLinkedFields(table?: Table) {
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
  getRowLinkDocs(rowId: string) {
    return getLinkDocuments({
      tableId: this._tableId,
      rowId,
      includeDocs: IncludeDocs.INCLUDE,
    })
  }

  /**
   * Utility function for main getLinkDocuments function - refer to it for functionality.
   */
  async getTableLinkDocs() {
    return (await getLinkDocuments({
      tableId: this._tableId,
      includeDocs: IncludeDocs.INCLUDE,
    })) as LinkDocument[]
  }

  /**
   * Makes sure the passed in table schema contains valid relationship structures.
   */
  validateTable(table: Table) {
    const usedAlready = []
    for (let schema of Object.values(table.schema)) {
      if (schema.type !== FieldTypes.LINK) {
        continue
      }
      const unique = schema.tableId! + schema?.fieldName
      if (usedAlready.indexOf(unique) !== -1) {
        throw new Error(
          "Cannot re-use the linked column name for a linked table."
        )
      }
      usedAlready.push(unique)
    }
  }

  /**
   * Returns whether the two link schemas are equal (in the important parts, not a pure equality check)
   */
  areLinkSchemasEqual(linkSchema1: FieldSchema, linkSchema2: FieldSchema) {
    const compareFields = [
      "name",
      "type",
      "tableId",
      "fieldName",
      "autocolumn",
      "relationshipType",
    ]
    for (let field of compareFields) {
      // @ts-ignore
      if (linkSchema1[field] !== linkSchema2[field]) {
        return false
      }
    }
    return true
  }

  /**
   * Given the link field of this table, and the link field of the linked table, this makes sure
   * the state of relationship type is accurate on both.
   */
  handleRelationshipType(
    linkerField: RelationshipFieldMetadata,
    linkedField: RelationshipFieldMetadata
  ) {
    if (
      !linkerField.relationshipType ||
      linkerField.relationshipType === RelationshipType.MANY_TO_MANY
    ) {
      linkedField.relationshipType = RelationshipType.MANY_TO_MANY
      // make sure by default all are many to many (if not specified)
      linkerField.relationshipType = RelationshipType.MANY_TO_MANY
    } else if (linkerField.relationshipType === RelationshipType.MANY_TO_ONE) {
      // Ensure that the other side of the relationship is locked to one record
      linkedField.relationshipType = RelationshipType.ONE_TO_MANY
    } else if (linkerField.relationshipType === RelationshipType.ONE_TO_MANY) {
      linkedField.relationshipType = RelationshipType.MANY_TO_ONE
    }
    return { linkerField, linkedField }
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
    const row = this._row!
    const operations = []
    // get link docs to compare against
    const linkDocs = (await this.getRowLinkDocs(row._id!)) as LinkDocument[]
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

        // if 1:N, ensure that this ID is not already attached to another record
        const linkedTable = await this._db.get<Table>(field.tableId)
        const linkedSchema = linkedTable.schema[field.fieldName]

        // We need to map the global users to metadata in each app for relationships
        if (field.tableId === InternalTables.USER_METADATA) {
          const users = await this._db.allDocs(getUserMetadataParams(null, {}))
          const metadataRequired = rowField.filter(
            (userId: string) => !users.rows.some(user => user.id === userId)
          )

          // ensure non-existing user metadata is created in the app DB
          await this._db.bulkDocs(
            metadataRequired.map((userId: string) => ({ _id: userId }))
          )
        }

        // iterate through the link IDs in the row field, see if any don't exist already
        for (let linkId of rowField) {
          if (
            linkedSchema?.type === FieldType.LINK &&
            linkedSchema?.relationshipType === RelationshipType.ONE_TO_MANY
          ) {
            let links = (
              (await getLinkDocuments({
                tableId: field.tableId,
                rowId: linkId,
                includeDocs: IncludeDocs.EXCLUDE,
              })) as LinkDocumentValue[]
            ).filter(
              link =>
                link.id !== row._id && link.fieldName === linkedSchema.name
            )

            // The 1 side of 1:N is already related to something else
            // You must remove the existing relationship
            if (links.length > 0) {
              throw new Error(
                `1:N Relationship Error: Record already linked to another.`
              )
            }
          }

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
                table._id!,
                fieldName,
                row._id!,
                field.tableId!,
                field.fieldName!,
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
    const row = this._row!
    // need to get the full link docs to be be able to delete it
    const linkDocs = await this.getRowLinkDocs(row._id!)
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
  async removeFieldFromTable(fieldName: string) {
    let oldTable = this._oldTable
    let field = oldTable?.schema[fieldName] as RelationshipFieldMetadata
    const linkDocs = await this.getTableLinkDocs()
    let toDelete = linkDocs.filter(linkDoc => {
      let correctFieldName =
        linkDoc.doc1.tableId === oldTable?._id
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
    try {
      // remove schema from other table, if it exists
      let linkedTable = await this._db.get<Table>(field.tableId)
      if (field.fieldName) {
        delete linkedTable.schema[field.fieldName]
      }
      await this._db.put(linkedTable)
    } catch (error: any) {
      // ignore missing to ensure broken relationship columns can be deleted
      if (error.statusCode !== 404) {
        throw error
      }
    }
  }

  /**
   * When a table is saved this will carry out the necessary operations to make sure
   * any linked tables are notified and updated correctly.
   * @returns {Promise<object>} The operation has been completed and the link documents should now
   * be accurate. Also returns the table that was operated on.
   */
  async tableSaved() {
    const table = await this.table()
    // validate the table first
    this.validateTable(table)
    const schema = table.schema
    for (let fieldName of Object.keys(schema)) {
      const field = schema[fieldName]
      if (field.type === FieldTypes.LINK && field.fieldName) {
        // handle this in a separate try catch, want
        // the put to bubble up as an error, if can't update
        // table for some reason
        let linkedTable
        try {
          linkedTable = await this._db.get<Table>(field.tableId)
        } catch (err) {
          /* istanbul ignore next */
          continue
        }
        const fields = this.handleRelationshipType(field, {
          name: field.fieldName,
          type: FieldTypes.LINK,
          // these are the props of the table that initiated the link
          tableId: table._id!,
          fieldName: fieldName,
        } as RelationshipFieldMetadata)

        // update table schema after checking relationship types
        schema[fieldName] = fields.linkerField
        const linkedField = fields.linkedField

        if (field.autocolumn) {
          linkedField.autocolumn = field.autocolumn
          linkedField.subtype = field.subtype
        }

        // check the linked table to make sure we aren't overwriting an existing column
        const existingSchema = linkedTable.schema[field.fieldName]
        if (
          existingSchema != null &&
          !this.areLinkSchemasEqual(existingSchema, linkedField)
        ) {
          throw new Error("Cannot overwrite existing column.")
        }
        // create the link field in the other table
        linkedTable.schema[field.fieldName] = linkedField
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
    for (let fieldName of Object.keys(oldTable?.schema || {})) {
      const field = oldTable?.schema[fieldName] as FieldSchema
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
        if (field.type === FieldTypes.LINK && field.fieldName) {
          const linkedTable = await this._db.get<Table>(field.tableId)
          delete linkedTable.schema[field.fieldName]
          await this._db.put(linkedTable)
        }
      } catch (err) {
        /* istanbul ignore next */
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

export default LinkController
