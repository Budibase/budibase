import fs from "fs"
import { join } from "path"
import { ObjectStoreBuckets } from "../../constants"
import { objectStore } from "@budibase/backend-core"

/**
 * This function manages temporary template files which are stored by Koa.
 * @param {Object} template The template object retrieved from the Koa context object.
 * @returns {Object} Returns an fs read stream which can be loaded into the database.
 */
export const getTemplateStream = async (template: any) => {
  if (template.file) {
    return fs.createReadStream(template.file.path)
  } else {
    const [type, name] = template.key.split("/")
    const tmpPath = await downloadTemplate(type, name)
    return fs.createReadStream(join(tmpPath, name, "db", "dump.txt"))
  }
}

/**
 * Retrieves a template and pipes it to minio as well as making it available temporarily.
 * @param {string} type The type of template which is to be retrieved.
 * @param name
 * @return {Promise<*>}
 */
export const downloadTemplate = async (type: string, name: string) => {
  const DEFAULT_TEMPLATES_BUCKET =
    "prod-budi-templates.s3-eu-west-1.amazonaws.com"
  const templateUrl = `https://${DEFAULT_TEMPLATES_BUCKET}/templates/${type}/${name}.tar.gz`
  return objectStore.downloadTarball(
    templateUrl,
    ObjectStoreBuckets.TEMPLATES,
    type
  )
}
