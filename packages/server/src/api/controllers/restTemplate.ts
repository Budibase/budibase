import { readFile, unlink } from "fs/promises"
import { HTTPError } from "@budibase/backend-core"
import type {
  CustomRestTemplateFileExtension,
  CustomRestTemplateId,
  DeleteCustomRestTemplateResponse,
  FetchCustomRestTemplatesResponse,
  UploadCustomRestTemplateRequest,
  UploadCustomRestTemplateResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../sdk"
import { createImporter } from "./query/import"

const getUploadDetails = (file: unknown) => {
  if (!file || typeof file !== "object") {
    return undefined
  }
  const upload = file as {
    filepath?: string
    originalFilename?: string | null
  }
  if (!upload.filepath || !upload.originalFilename) {
    return undefined
  }
  return {
    filepath: upload.filepath,
    filename: upload.originalFilename,
  }
}

const getFileExtension = (
  filename: string
): CustomRestTemplateFileExtension => {
  const extension = filename.split(".").pop()?.toLowerCase()
  if (extension === "json") {
    return "json"
  }
  if (extension === "yaml" || extension === "yml") {
    return "yaml"
  }
  throw new HTTPError("OpenAPI template must be a YAML or JSON file", 400)
}

const isCustomRestTemplateId = (
  restTemplateId: string
): restTemplateId is CustomRestTemplateId =>
  /^rest_template_[a-z0-9]+(?:-[a-z0-9]+)*$/.test(restTemplateId)

export const fetch = async (
  ctx: UserCtx<void, FetchCustomRestTemplatesResponse>
) => {
  ctx.body = await sdk.restTemplates.fetch()
}

export const upload = async (
  ctx: UserCtx<
    UploadCustomRestTemplateRequest,
    UploadCustomRestTemplateResponse
  >
) => {
  const file = ctx.request.files?.file
  if (!file || Array.isArray(file)) {
    throw new HTTPError("Exactly one OpenAPI template file is required", 400)
  }

  const uploadDetails = getUploadDetails(file)
  if (!uploadDetails) {
    throw new HTTPError("Invalid OpenAPI template upload", 400)
  }

  try {
    const name = ctx.request.body.name
    const description = ctx.request.body.description
    if (typeof name !== "string" || !name.trim()) {
      throw new HTTPError("Template name is required", 400)
    }
    if (typeof description !== "string") {
      throw new HTTPError("Template description is required", 400)
    }

    const fileExtension = getFileExtension(uploadDetails.filename)
    const data = await readFile(uploadDetails.filepath, "utf8")
    let importer
    let info
    try {
      importer = await createImporter({ data })
      const source = importer.getSource().getImportSource()
      if (source !== "openapi2.0" && source !== "openapi3.0") {
        throw new Error("Unsupported OpenAPI source")
      }
      info = importer.getInfo()
    } catch {
      throw new HTTPError("File must contain a valid OpenAPI schema", 400)
    }

    ctx.body = {
      template: await sdk.restTemplates.create({
        name,
        description,
        data,
        fileExtension,
        operationsCount: info.endpoints.length,
      }),
    }
  } finally {
    await unlink(uploadDetails.filepath).catch(() => {})
  }
}

export const destroy = async (
  ctx: UserCtx<
    void,
    DeleteCustomRestTemplateResponse,
    { restTemplateId: string }
  >
) => {
  const { restTemplateId } = ctx.params
  if (!isCustomRestTemplateId(restTemplateId)) {
    throw new HTTPError("Invalid custom REST template ID", 400)
  }

  const removalResult = await sdk.restTemplates.removeIfUnused(restTemplateId)
  if (removalResult === "missing") {
    throw new HTTPError("Custom REST template not found", 404)
  }
  if (removalResult === "in_use") {
    throw new HTTPError(
      "Custom REST template cannot be deleted while it is in use",
      409
    )
  }
  ctx.body = {
    message: `Custom REST template ${restTemplateId} deleted`,
  }
}
