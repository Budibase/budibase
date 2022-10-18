import { Row } from "@budibase/types"

type Table = {
    type?: string
    views?: { [key: string]: any }
    name: string
    primary?: string[]
    schema: { [key: string]: any }
    primaryDisplay?: string
    sourceId?: string
    relatedFormula?: string[]
    constrained?: string[]
    _id?: string
    _rev?: string
    createdAt?: string
    updatedAt?: string
    indexes?: { [key: string]: any }
    dataImport?: { [key: string]: any }

}

export const generateTable = (): Table => {
    return {
        name: "Test Table",
        schema: {},
        sourceId: "bb_internal",
        type: "internal",
        dataImport: {
            valid: true,
            schema: {}
        }
    }
}

export const generateNewColumnForTable = (tableData: any): Table => {
    const newColumn = tableData
    newColumn.schema = {
        TestColumn: {
            type: "string",
            name: "TestColumn",
            constraints: {
                presence: { allowEmpty: false },
                length: { maximum: null },
                type: "string"
            }
        }
    }
    newColumn.indexes = {
        0: "TestColumn"
    }
    newColumn.updatedAt = new Date().toISOString()
    return newColumn
}

export const generateNewRowForTable = (tableId: string): Row => {
    return {
        TestColumn: "TestRow",
        tableId: tableId
    }
}
