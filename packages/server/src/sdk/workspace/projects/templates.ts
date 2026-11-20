import { env as coreEnv, HTTPError } from "@budibase/backend-core"
import type {
  FetchProjectTemplatesResponse,
  ProjectTemplateCompatibility,
  ProjectTemplateDeprecation,
  ProjectTemplateMetadata,
  ProjectTemplateStatus,
} from "@budibase/types"
import { createHash } from "crypto"
import nodeFetch, { type Response } from "node-fetch"
import semver from "semver"
import { Transform, type TransformCallback, Writable } from "stream"
import { pipeline } from "stream/promises"
import env from "../../../environment"
import {
  MAX_PROJECT_ARCHIVE_SIZE_BYTES,
  PROJECT_EXPORT_FORMAT_VERSION,
} from "./backups/constants"

const PROJECT_CATALOGUE_SCHEMA_VERSION = 1
const PROJECT_CATALOGUE_POINTER_PATH = "catalogue/project/v1/current.json"
const MAX_POINTER_SIZE_BYTES = 4096
const MAX_CATALOGUE_SIZE_BYTES = 1024 * 1024
const FETCH_TIMEOUT_MS = 15000
const PROJECT_TEMPLATE_KEY_PATTERN = /^project\/[a-z0-9]+(?:-[a-z0-9]+)*$/
const PROJECT_TEMPLATE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const PROJECT_TEMPLATE_VERSION_PATTERN = /^[0-9]+\.[0-9]+\.[0-9]+$/
const CATALOGUE_VERSION_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/
const SHA256_PATTERN = /^[a-f0-9]{64}$/
const SAFE_COLOR_PATTERN = /^#[a-fA-F0-9]{6}$/
const REQUIRED_FEATURE_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/
const SUPPORTED_REQUIRED_FEATURES = new Set(["projects"])
const TEMPLATE_STATUSES: ProjectTemplateStatus[] = [
  "active",
  "deprecated",
  "withdrawn",
]

export interface ProjectTemplateArtifact {
  packageVersion: number
  sizeBytes: number
  sha256: string
}

interface ProjectTemplateCatalogueEntry
  extends Omit<ProjectTemplateMetadata, "catalogueVersion"> {
  slug: string
  artifact: ProjectTemplateArtifact
}

interface ProjectTemplateCatalogue {
  catalogueVersion: string
  templates: ProjectTemplateCatalogueEntry[]
}

export interface ResolvedProjectTemplate {
  template: ProjectTemplateMetadata
  slug: string
  artifact: ProjectTemplateArtifact
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const invalidPointer = () =>
  new HTTPError("Project template catalogue pointer is invalid.", 502)

const invalidCatalogue = () =>
  new HTTPError("Project template catalogue is invalid.", 502)

const readRequiredString = ({
  value,
  maxLength,
}: {
  value: unknown
  maxLength: number
}) => {
  if (typeof value !== "string" || !value.trim() || value.length > maxLength) {
    throw invalidCatalogue()
  }
  return value.trim()
}

const readOptionalString = ({
  value,
  maxLength,
}: {
  value: unknown
  maxLength: number
}) => {
  if (value === undefined) {
    return undefined
  }
  return readRequiredString({ value, maxLength })
}

const readOptionalHttpsUrl = (value: unknown) => {
  const url = readOptionalString({ value, maxLength: 2048 })
  if (!url) {
    return undefined
  }

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
      throw invalidCatalogue()
    }
  } catch {
    throw invalidCatalogue()
  }

  return url
}

const readCompatibility = (value: unknown): ProjectTemplateCompatibility => {
  if (!isRecord(value)) {
    throw invalidCatalogue()
  }

  const minBudibaseVersion = readRequiredString({
    value: value.minBudibaseVersion,
    maxLength: 64,
  })
  const maxBudibaseVersionExclusive = readOptionalString({
    value: value.maxBudibaseVersionExclusive,
    maxLength: 64,
  })
  const requiredFeatures = value.requiredFeatures

  if (
    !semver.valid(minBudibaseVersion) ||
    (maxBudibaseVersionExclusive &&
      !semver.valid(maxBudibaseVersionExclusive)) ||
    (maxBudibaseVersionExclusive &&
      !semver.lt(minBudibaseVersion, maxBudibaseVersionExclusive)) ||
    !Array.isArray(requiredFeatures) ||
    !requiredFeatures.every(
      feature =>
        typeof feature === "string" && REQUIRED_FEATURE_PATTERN.test(feature)
    ) ||
    new Set(requiredFeatures).size !== requiredFeatures.length
  ) {
    throw invalidCatalogue()
  }

  return {
    minBudibaseVersion,
    maxBudibaseVersionExclusive,
    requiredFeatures,
  }
}

const readDeprecation = ({
  status,
  value,
}: {
  status: ProjectTemplateStatus
  value: unknown
}): ProjectTemplateDeprecation | undefined => {
  if (status !== "deprecated") {
    if (value !== undefined) {
      throw invalidCatalogue()
    }
    return undefined
  }
  if (!isRecord(value)) {
    throw invalidCatalogue()
  }

  const replacementKey = readOptionalString({
    value: value.replacementKey,
    maxLength: 200,
  })
  if (replacementKey && !PROJECT_TEMPLATE_KEY_PATTERN.test(replacementKey)) {
    throw invalidCatalogue()
  }

  return {
    message: readRequiredString({ value: value.message, maxLength: 500 }),
    replacementKey,
  }
}

const parseCatalogueEntry = (value: unknown): ProjectTemplateCatalogueEntry => {
  if (!isRecord(value) || !isRecord(value.artifact)) {
    throw invalidCatalogue()
  }

  const key = readRequiredString({ value: value.key, maxLength: 200 })
  const slug = readRequiredString({ value: value.slug, maxLength: 160 })
  const version = readRequiredString({ value: value.version, maxLength: 64 })
  const background = readOptionalString({
    value: value.background,
    maxLength: 7,
  })
  const status = readRequiredString({
    value: value.status,
    maxLength: 20,
  }) as ProjectTemplateStatus
  const { artifact } = value

  if (
    !PROJECT_TEMPLATE_KEY_PATTERN.test(key) ||
    !PROJECT_TEMPLATE_SLUG_PATTERN.test(slug) ||
    key !== `project/${slug}` ||
    !PROJECT_TEMPLATE_VERSION_PATTERN.test(version) ||
    (background && !SAFE_COLOR_PATTERN.test(background)) ||
    !TEMPLATE_STATUSES.includes(status) ||
    typeof artifact.packageVersion !== "number" ||
    !Number.isSafeInteger(artifact.packageVersion) ||
    artifact.packageVersion <= 0 ||
    typeof artifact.sizeBytes !== "number" ||
    !Number.isSafeInteger(artifact.sizeBytes) ||
    artifact.sizeBytes <= 0 ||
    artifact.sizeBytes > MAX_PROJECT_ARCHIVE_SIZE_BYTES ||
    typeof artifact.sha256 !== "string" ||
    !SHA256_PATTERN.test(artifact.sha256)
  ) {
    throw invalidCatalogue()
  }

  return {
    key,
    slug,
    version,
    packageVersion: artifact.packageVersion,
    name: readRequiredString({ value: value.name, maxLength: 100 }),
    description: readRequiredString({
      value: value.description,
      maxLength: 500,
    }),
    category: readRequiredString({ value: value.category, maxLength: 80 }),
    image: readOptionalHttpsUrl(value.image),
    icon: readOptionalString({ value: value.icon, maxLength: 80 }),
    background,
    status,
    owner: readRequiredString({ value: value.owner, maxLength: 100 }),
    compatibility: readCompatibility(value.compatibility),
    deprecation: readDeprecation({ status, value: value.deprecation }),
    artifact: {
      packageVersion: artifact.packageVersion,
      sizeBytes: artifact.sizeBytes,
      sha256: artifact.sha256,
    },
  }
}

const isCompatible = (template: ProjectTemplateCatalogueEntry) => {
  const currentVersion = semver.valid(coreEnv.VERSION)
  if (!currentVersion) {
    throw new HTTPError(
      "Project template compatibility cannot be evaluated.",
      500
    )
  }

  return (
    template.artifact.packageVersion === PROJECT_EXPORT_FORMAT_VERSION &&
    template.compatibility.requiredFeatures.every(feature =>
      SUPPORTED_REQUIRED_FEATURES.has(feature)
    ) &&
    semver.gte(currentVersion, template.compatibility.minBudibaseVersion) &&
    (!template.compatibility.maxBudibaseVersionExclusive ||
      semver.lt(
        currentVersion,
        template.compatibility.maxBudibaseVersionExclusive
      ))
  )
}

const toMetadata = ({
  template,
  catalogueVersion,
}: {
  template: ProjectTemplateCatalogueEntry
  catalogueVersion: string
}): ProjectTemplateMetadata => ({
  key: template.key,
  version: template.version,
  packageVersion: template.packageVersion,
  catalogueVersion,
  name: template.name,
  description: template.description,
  category: template.category,
  image: template.image,
  icon: template.icon,
  background: template.background,
  status: template.status,
  owner: template.owner,
  compatibility: template.compatibility,
  deprecation: template.deprecation,
})

class SizeLimitTransform extends Transform {
  bytes = 0

  constructor(private readonly maxBytes: number) {
    super()
  }

  _transform(chunk: Buffer, _encoding: string, callback: TransformCallback) {
    this.bytes += chunk.length
    if (this.bytes > this.maxBytes) {
      callback(new HTTPError("Project template response is too large.", 502))
      return
    }
    callback(null, chunk)
  }
}

export const readProjectTemplateRepositoryPath = async <T>({
  path,
  read,
  timeoutMs = FETCH_TIMEOUT_MS,
}: {
  path: string
  read: (response: Response) => Promise<T>
  timeoutMs?: number
}): Promise<T> => {
  let repositoryUrl: URL
  try {
    repositoryUrl = new URL(env.PROJECT_TEMPLATE_REPOSITORY_URL)
  } catch {
    throw new HTTPError("Project template repository is invalid.", 500)
  }

  const insecureLoopback =
    coreEnv.isDev() &&
    repositoryUrl.protocol === "http:" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(repositoryUrl.hostname)
  if (
    (repositoryUrl.protocol !== "https:" && !insecureLoopback) ||
    repositoryUrl.username ||
    repositoryUrl.password
  ) {
    throw new HTTPError("Project template repository is invalid.", 500)
  }

  const url = new URL(path, `${repositoryUrl.toString().replace(/\/$/, "")}/`)
  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), timeoutMs)
  timeout.unref()
  try {
    const response = await nodeFetch(url, {
      timeout: timeoutMs,
      redirect: "error",
      signal: abortController.signal,
    })
    if (!response.ok || !response.body) {
      throw new HTTPError("Project template repository is unavailable.", 502)
    }
    return await read(response)
  } catch (err) {
    abortController.abort()
    if (err instanceof HTTPError) {
      throw err
    }
    throw new HTTPError("Project template repository is unavailable.", 502)
  } finally {
    clearTimeout(timeout)
  }
}

const readResponse = async ({
  response,
  maxBytes,
}: {
  response: Response
  maxBytes: number
}) => {
  const chunks: Buffer[] = []
  const collector = new Writable({
    write(chunk: Buffer, _encoding, callback) {
      chunks.push(Buffer.from(chunk))
      callback()
    },
  })
  await pipeline(response.body, new SizeLimitTransform(maxBytes), collector)
  return Buffer.concat(chunks.map(chunk => new Uint8Array(chunk)))
}

const parseJson = ({
  buffer,
  invalid,
}: {
  buffer: Buffer
  invalid: () => HTTPError
}) => {
  try {
    return JSON.parse(buffer.toString("utf8")) as unknown
  } catch {
    throw invalid()
  }
}

const fetchCatalogue = async (): Promise<ProjectTemplateCatalogue> => {
  const pointerBuffer = await readProjectTemplateRepositoryPath({
    path: PROJECT_CATALOGUE_POINTER_PATH,
    read: response =>
      readResponse({ response, maxBytes: MAX_POINTER_SIZE_BYTES }),
  })
  const pointerValue = parseJson({
    buffer: pointerBuffer,
    invalid: invalidPointer,
  })
  if (!isRecord(pointerValue)) {
    throw invalidPointer()
  }

  const catalogueVersion = pointerValue.catalogueVersion
  const catalogueSha256 = pointerValue.sha256
  if (
    pointerValue.schemaVersion !== PROJECT_CATALOGUE_SCHEMA_VERSION ||
    typeof catalogueVersion !== "string" ||
    !CATALOGUE_VERSION_PATTERN.test(catalogueVersion) ||
    typeof catalogueSha256 !== "string" ||
    !SHA256_PATTERN.test(catalogueSha256)
  ) {
    throw invalidPointer()
  }

  const catalogueBuffer = await readProjectTemplateRepositoryPath({
    path: `catalogue/project/v1/releases/${catalogueVersion}.json`,
    read: response =>
      readResponse({ response, maxBytes: MAX_CATALOGUE_SIZE_BYTES }),
  })
  const actualSha256 = createHash("sha256")
    .update(new Uint8Array(catalogueBuffer))
    .digest("hex")
  if (actualSha256 !== catalogueSha256) {
    throw new HTTPError(
      "Project template catalogue checksum does not match.",
      502
    )
  }

  const catalogueValue = parseJson({
    buffer: catalogueBuffer,
    invalid: invalidCatalogue,
  })
  if (
    !isRecord(catalogueValue) ||
    catalogueValue.schemaVersion !== PROJECT_CATALOGUE_SCHEMA_VERSION ||
    catalogueValue.catalogueVersion !== catalogueVersion ||
    typeof catalogueValue.publishedAt !== "string" ||
    Number.isNaN(Date.parse(catalogueValue.publishedAt)) ||
    !Array.isArray(catalogueValue.templates)
  ) {
    throw invalidCatalogue()
  }

  const templates = catalogueValue.templates.map(parseCatalogueEntry)
  const keys = new Set(templates.map(template => template.key))
  if (keys.size !== templates.length) {
    throw invalidCatalogue()
  }

  return {
    catalogueVersion,
    templates,
  }
}

export const fetchProjectTemplates =
  async (): Promise<FetchProjectTemplatesResponse> => {
    const catalogue = await fetchCatalogue()
    return {
      catalogueVersion: catalogue.catalogueVersion,
      templates: catalogue.templates
        .filter(template => template.status !== "withdrawn")
        .filter(isCompatible)
        .map(template =>
          toMetadata({
            template,
            catalogueVersion: catalogue.catalogueVersion,
          })
        )
        .sort(
          (a, b) => a.name.localeCompare(b.name) || a.key.localeCompare(b.key)
        ),
    }
  }

export const resolveProjectTemplate = async (
  templateKey: string
): Promise<ResolvedProjectTemplate> => {
  if (!PROJECT_TEMPLATE_KEY_PATTERN.test(templateKey)) {
    throw new HTTPError("Project template key is invalid.", 400)
  }

  const catalogue = await fetchCatalogue()
  const template = catalogue.templates.find(entry => entry.key === templateKey)
  if (!template || template.status === "withdrawn") {
    throw new HTTPError(`Project template '${templateKey}' not found.`, 404)
  }
  if (!isCompatible(template)) {
    throw new HTTPError(
      `Project template '${templateKey}' is not compatible with this Budibase version.`,
      409
    )
  }

  return {
    template: toMetadata({
      template,
      catalogueVersion: catalogue.catalogueVersion,
    }),
    slug: template.slug,
    artifact: template.artifact,
  }
}
