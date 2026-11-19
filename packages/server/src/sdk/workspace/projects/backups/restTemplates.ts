import kebabCase from "lodash/kebabCase"
import isEqual from "lodash/isEqual"
import { load as loadYaml } from "js-yaml"
import { z } from "zod"
import { context, HTTPError } from "@budibase/backend-core"
import { isCustomRestTemplateId } from "@budibase/shared-core"
import {
  SourceName,
  type CustomRestTemplateDocument,
  type CustomRestTemplateFileExtension,
  type CustomRestTemplateId,
  type Datasource,
} from "@budibase/types"
import { createImporter } from "../../../../api/controllers/query/import"
import sdk from "../../.."

export interface ProjectRestTemplate {
  id: CustomRestTemplateId
  name: string
  description: string
  fileExtension: CustomRestTemplateFileExtension
  data: string
}

const projectRestTemplateSchema: z.ZodType<ProjectRestTemplate> = z.object({
  id: z.custom<CustomRestTemplateId>(
    value => typeof value === "string" && isCustomRestTemplateId(value)
  ),
  name: z.string().refine(name => !!kebabCase(name)),
  description: z.string(),
  fileExtension: z.enum(["json", "yaml"]),
  data: z.string(),
})

const getTemplateIds = (datasources: Datasource[]) =>
  new Set(
    datasources
      .filter(datasource => datasource.source === SourceName.REST)
      .map(datasource => datasource.restTemplateId)
      .filter(isCustomRestTemplateId)
  )

export const exportProjectRestTemplates = async ({
  datasources,
}: {
  datasources: Datasource[]
}): Promise<ProjectRestTemplate[]> => {
  const db = context.getWorkspaceDB()
  return await Promise.all(
    [...getTemplateIds(datasources)].map(async id => {
      const document = await db.tryGet<CustomRestTemplateDocument>(id)
      if (!document) {
        throw new HTTPError("Custom REST template not found", 404)
      }
      return {
        id,
        name: document.name,
        description: document.description,
        fileExtension: document.fileExtension,
        data: await sdk.restTemplates.getSpec(id),
      }
    })
  )
}

export const validateProjectRestTemplates = async ({
  value,
  datasources,
}: {
  value: unknown
  datasources: Datasource[]
}): Promise<ProjectRestTemplate[]> => {
  const result = z.array(projectRestTemplateSchema).safeParse(value)
  if (!result.success) {
    throw new HTTPError("Project package contains invalid REST templates.", 400)
  }
  const expectedIds = getTemplateIds(datasources)
  for (const template of result.data) {
    if (!expectedIds.delete(template.id)) {
      throw new HTTPError(
        "Project package contains invalid REST templates.",
        400
      )
    }
    try {
      const importer = await createImporter({ data: template.data })
      const source = importer.getSource().getImportSource()
      if (source !== "openapi2.0" && source !== "openapi3.0") {
        throw new Error("Unsupported OpenAPI source")
      }
    } catch {
      throw new HTTPError(
        "Project package contains an invalid OpenAPI spec.",
        400
      )
    }
  }
  if (expectedIds.size) {
    throw new HTTPError(
      "Project package is missing custom REST templates.",
      400
    )
  }
  return result.data
}

export const importProjectRestTemplates = async ({
  templates,
  idMap,
  createdTemplateIds,
}: {
  templates: ProjectRestTemplate[]
  idMap: Map<string, string>
  createdTemplateIds: CustomRestTemplateId[]
}) => {
  if (!templates.length) {
    return
  }
  const existingTemplates = await sdk.restTemplates.fetch()
  const existingIds = new Set(existingTemplates.map(template => template.id))
  const names = new Set(
    existingTemplates.map(template => kebabCase(template.name))
  )
  const specsById = new Map<CustomRestTemplateId, unknown>()
  if (templates.some(template => !existingIds.has(template.id))) {
    for (const existing of existingTemplates) {
      if (isCustomRestTemplateId(existing.id)) {
        specsById.set(
          existing.id,
          loadYaml(await sdk.restTemplates.getSpec(existing.id), { json: true })
        )
      }
    }
  }
  for (const template of templates) {
    if (existingIds.has(template.id)) {
      continue
    }
    const document = loadYaml(template.data, { json: true })
    const matchingId = [...specsById].find(([, existing]) =>
      isEqual(existing, document)
    )?.[0]
    if (matchingId) {
      idMap.set(template.id, matchingId)
      continue
    }
    let name = template.name
    let suffix = 1
    while (names.has(kebabCase(name))) {
      name = `${template.name} (${suffix++})`
    }
    const importer = await createImporter({ data: template.data })
    const imported = await sdk.restTemplates.create({
      name,
      description: template.description,
      fileExtension: template.fileExtension,
      data: template.data,
      operationsCount: importer.getInfo().endpoints.length,
    })
    if (!isCustomRestTemplateId(imported.id)) {
      throw new Error("Expected a custom REST template ID")
    }
    createdTemplateIds.push(imported.id)
    idMap.set(template.id, imported.id)
    names.add(kebabCase(name))
    specsById.set(imported.id, document)
  }
}
