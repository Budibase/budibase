import { API } from "@/api"
import { FIELDS } from "@/constants/backend"
import {
  FieldType,
  Table,
  UIFieldSchema,
  type Row,
  type TableSchema,
} from "@budibase/types"

export const BYTES_IN_MB = 1000000
export const FILE_SIZE_LIMIT = BYTES_IN_MB * 5

export interface ImportResult {
  validation: Record<string, boolean>
  allValid: boolean
  errors: Record<string, string>
  error?: string
}

export interface FileParseResponse {
  rows: Row[]
  schema: Record<string, UIFieldSchema>
  fileName: string
  fileType: string
}

export const getDefaultSchema = (rows: Row[]) => {
  const newSchema: Record<string, UIFieldSchema> = {}

  rows.forEach(row => {
    Object.keys(row).forEach(column => {
      newSchema[column] = {
        name: column,
        type: FieldType.STRING,
        constraints: FIELDS.STRING.constraints,
      }
    })
  })

  return newSchema
}

// export const async validateImport(rows, schema): Promise<ImportResult> => {
export const validateImport = async (rows: Row[], schema: TableSchema) => {
  try {
    const response = await API.validateNewTableImport(rows, schema)
    return {
      validation: response.schemaValidation,
      allValid: response.allValid,
      errors: response.errors,
    } as ImportResult
  } catch (e: any) {
    return {
      error: e.message,
      validation: {},
      allValid: false,
      errors: {},
    } as ImportResult
  }
}

export const parseJSON = (content: string) => {
  let rows,
    schema,
    jsonParseError,
    jsonContent = null

  try {
    jsonContent = JSON.parse(content)

    if (Array.isArray(jsonContent)) {
      rows = jsonContent
      schema = getDefaultSchema(rows)
    } else if (typeof jsonContent === "object") {
      const { schema: jsonSchema, rows: jsonRows } = jsonContent
      if (!jsonSchema || !jsonRows)
        throw new Error("Object requires schema & rows")
      rows = jsonRows
      schema = jsonSchema
    } else {
      throw new Error("No content")
    }
  } catch (e: any) {
    jsonParseError = `Invalid JSON: ${e.message}`
  }

  return { rows, schema, content: jsonContent, error: jsonParseError }
}

export const parseCSV = async (content: string) => {
  let rows,
    schema,
    csvParseError = null
  // Attempts to parse is as CSV
  try {
    const resp = await API.csvToJson(content)
    if (!resp.length && content) {
      csvParseError = "Invalid CSV content. No rows"
    } else {
      rows = resp
      schema = getDefaultSchema(rows)
    }
  } catch (e: any) {
    csvParseError = `CSV parse failed: ${e.message}`
  }
  return { rows, schema, error: csvParseError }
}

export const parseFile = (e: Event): Promise<FileParseResponse> => {
  const picker = e.target as HTMLInputElement
  return new Promise((resolve, reject) => {
    const file = Array.from(picker.files ?? [])[0]

    if (file.size >= FILE_SIZE_LIMIT) {
      reject("file too large")
      return
    }

    let reader = new FileReader()

    const resolveRows = (rows: Row[], schema = null) => {
      resolve({
        rows,
        schema: schema ?? getDefaultSchema(rows),
        fileName: file.name,
        fileType: file.type,
      } as FileParseResponse)
    }

    reader.addEventListener(
      "load",
      async function (e: ProgressEvent<FileReader>) {
        const fileData = e.target?.result

        if (typeof fileData !== "string" || !fileData.trim()) {
          reject("No content")
          return
        }
        if (file.type?.includes("json")) {
          const jsonResult = parseJSON(fileData)
          if (!jsonResult.error) {
            resolveRows(jsonResult.rows, jsonResult.schema)
          } else {
            reject(jsonResult.error)
          }
        } else {
          const csvResult = await parseCSV(fileData)
          if (csvResult.error) {
            reject(csvResult.error)
          } else {
            resolveRows(csvResult.rows || [])
          }
        }
      }
    )

    reader.readAsText(file)
  })
}

export const alphabetical = (a: Table, b: Table) => {
  return a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
}
