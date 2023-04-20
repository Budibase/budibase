import { API } from "api"
import { FIELDS } from "constants/backend"
import { _ } from "../../../../lang/i18n"

const BYTES_IN_MB = 1000000
const FILE_SIZE_LIMIT = BYTES_IN_MB * 5

const getDefaultSchema = rows => {
  const newSchema = {}

  rows.forEach(row => {
    Object.keys(row).forEach(column => {
      newSchema[column] = {
        name: column,
        type: "string",
        constraints: FIELDS["STRING"].constraints,
      }
    })
  })

  return newSchema
}

export const parseFile = e => {
  return new Promise((resolve, reject) => {
    const file = Array.from(e.target.files)[0]

    if (file.size >= FILE_SIZE_LIMIT) {
      reject($_("components.backend.TableNavigation.unitls.file_large"))
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

      if (file.type === "text/csv") {
        API.csvToJson(fileData)
          .then(rows => {
            resolveRows(rows)
          })
          .catch(() => {
            reject(
              $_("components.backend.TableNavigation.unitls.can't_convert")
            )
          })
      } else if (file.type === "application/json") {
        const parsedFileData = JSON.parse(fileData)

        if (Array.isArray(parsedFileData)) {
          resolveRows(parsedFileData)
        } else if (typeof parsedFileData === "object") {
          resolveRows(parsedFileData.rows, parsedFileData.schema)
        } else {
          reject($_("components.backend.TableNavigation.unitls.invalid_format"))
        }
      } else {
        reject($_("components.backend.TableNavigation.unitls.invalid_type"))
      }
    })

    reader.readAsText(file)
  })
}
