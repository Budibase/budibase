import { API } from "@/api"
import { FIELDS } from "@/constants/backend"

const BYTES_IN_MB = 1000000
const FILE_SIZE_LIMIT = BYTES_IN_MB * 10
export const IMPORT_ROWS_PER_CHUNK = 5000

const getDefaultSchema = rows => {
  const newSchema = {}

  rows.forEach(row => {
    Object.keys(row).forEach(column => {
      newSchema[column] = {
        name: column,
        type: "string",
        constraints: FIELDS.STRING.constraints,
      }
    })
  })

  return newSchema
}

export const parseFile = file => {
  return new Promise((resolve, reject) => {
    const fileName = file.name.toLowerCase()
    const isJson = fileName.endsWith(".json")
    if (!fileName.endsWith(".csv") && !isJson) {
      reject(new Error("Only CSV and JSON files are supported."))
      return
    }

    if (file.size >= FILE_SIZE_LIMIT) {
      reject(new Error("Files must be smaller than 10MB."))
      return
    }

    let reader = new FileReader()

    const resolveRows = (rows, schema = null) => {
      resolve({
        rows,
        schema: schema ?? getDefaultSchema(rows),
        fileName: file.name,
        fileType: file.type,
      })
    }

    reader.addEventListener("load", function (e) {
      const fileData = e.target.result
      if (isJson) {
        try {
          const parsedFileData = JSON.parse(fileData)
          if (Array.isArray(parsedFileData)) {
            resolveRows(parsedFileData)
          } else if (parsedFileData && Array.isArray(parsedFileData.rows)) {
            resolveRows(parsedFileData.rows, parsedFileData.schema)
          } else {
            reject(new Error("JSON must contain an array of rows."))
          }
        } catch {
          reject(
            new Error(
              "Cannot parse JSON. Check that the file contains valid JSON."
            )
          )
        }
      } else {
        API.csvToJson(fileData)
          .then(rows => {
            resolveRows(rows)
          })
          .catch(() => {
            reject(new Error("Cannot parse CSV."))
          })
      }
    })
    reader.addEventListener("error", () => {
      reject(new Error("Cannot read the selected file."))
    })

    reader.readAsText(file)
  })
}

export const getValidationRows = rows => {
  if (!Array.isArray(rows)) {
    return []
  }

  if (rows.length <= IMPORT_ROWS_PER_CHUNK) {
    return rows
  }

  return rows.slice(0, IMPORT_ROWS_PER_CHUNK)
}

export const chunkRows = (rows, size = IMPORT_ROWS_PER_CHUNK) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return []
  }

  const chunkSize = size > 0 ? size : IMPORT_ROWS_PER_CHUNK
  const chunks = []
  for (let i = 0; i < rows.length; i += chunkSize) {
    chunks.push(rows.slice(i, i + chunkSize))
  }
  return chunks
}

export const alphabetical = (a, b) => {
  return a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
}
