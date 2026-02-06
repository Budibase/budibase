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

export const parseFile = e => {
  return new Promise((resolve, reject) => {
    const file = Array.from(e.target.files)[0]

    if (file.size >= FILE_SIZE_LIMIT) {
      reject("file too large")
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
      if (file.type?.includes("json")) {
        const parsedFileData = JSON.parse(fileData)

        if (Array.isArray(parsedFileData)) {
          resolveRows(parsedFileData)
        } else if (typeof parsedFileData === "object") {
          resolveRows(parsedFileData.rows, parsedFileData.schema)
        } else {
          reject("invalid json format")
        }
      } else {
        API.csvToJson(fileData)
          .then(rows => {
            resolveRows(rows)
          })
          .catch(() => {
            reject("cannot parse csv")
          })
      }
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
