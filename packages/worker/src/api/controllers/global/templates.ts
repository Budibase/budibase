import { v4 } from "uuid"
import {
  TemplateMetadata,
  TemplateBindings,
  GLOBAL_OWNER,
} from "../../../constants"
import {
  addBaseTemplates,
  getTemplateByID,
  getTemplates,
} from "../../../constants/templates"
import { tenancy, db as dbCore, objectStore } from "@budibase/backend-core"
import {
  DeleteGlobalTemplateResponse,
  FetchGlobalTemplateByOwnerIDResponse,
  FetchGlobalTemplateByTypeResponse,
  FetchGlobalTemplateDefinitionResponse,
  FetchGlobalTemplateResponse,
  FindGlobalTemplateResponse,
  SaveGlobalTemplateRequest,
  SaveGlobalTemplateResponse,
  GlobalTemplateBinding,
  GlobalTemplateDefinition,
  UserCtx,
  Ctx,
  EmailTemplatePurpose,
} from "@budibase/types"
import { join } from "path"
import fs from "fs"
import yaml from "yaml"

export async function save(
  ctx: UserCtx<SaveGlobalTemplateRequest, SaveGlobalTemplateResponse>
) {
  const db = tenancy.getGlobalDB()
  let template = ctx.request.body
  if (!template.ownerId) {
    template.ownerId = GLOBAL_OWNER
  }
  if (!template._id) {
    template._id = dbCore.generateTemplateID(template.ownerId)
  }

  const response = await db.put(template)
  ctx.body = {
    ...template,
    _rev: response.rev,
  }
}

export async function definitions(
  ctx: UserCtx<void, FetchGlobalTemplateDefinitionResponse>
) {
  const bindings: Record<string, GlobalTemplateBinding[]> = {}
  const info: Record<string, GlobalTemplateDefinition> = {}
  for (let template of TemplateMetadata.email) {
    bindings[template.purpose] = template.bindings
    info[template.purpose] = {
      name: template.name,
      description: template.description,
      category: template.category,
    }
  }

  ctx.body = {
    info,
    bindings: {
      ...bindings,
      common: Object.values(TemplateBindings),
    },
  }
}

export async function fetch(ctx: UserCtx<void, FetchGlobalTemplateResponse>) {
  ctx.body = await getTemplates()
}

export async function fetchByType(
  ctx: UserCtx<void, FetchGlobalTemplateByTypeResponse>
) {
  ctx.body = await getTemplates({
    type: ctx.params.type,
  })
}

export async function fetchByOwner(
  ctx: UserCtx<void, FetchGlobalTemplateByOwnerIDResponse>
) {
  // @ts-ignore
  ctx.body = await getTemplates({
    ownerId: ctx.params.ownerId,
  })
}

export async function find(ctx: UserCtx<void, FindGlobalTemplateResponse>) {
  ctx.body = await getTemplateByID(ctx.params.id)
}

export async function destroy(
  ctx: UserCtx<void, DeleteGlobalTemplateResponse>
) {
  const db = tenancy.getGlobalDB()
  await db.remove(ctx.params.id, ctx.params.rev)
  ctx.body = { message: `Template ${ctx.params.id} deleted.` }
}

function templatesToYaml(
  templates: Array<{ contents: string; purpose: string }>
): string {
  const doc = new yaml.Document()

  // Build the template object
  const templatesObj: Record<string, yaml.Scalar> = {}
  templates.forEach(template => {
    const scalar = new yaml.Scalar(template.contents)
    scalar.type = "BLOCK_LITERAL"
    templatesObj[template.purpose] = scalar
  })

  // Set the document contents
  doc.contents = doc.createNode({ templates: templatesObj })

  return doc.toString()
}

export async function exportTemplates(ctx: Ctx) {
  const { params } = ctx

  // Limited to email for now
  if (params.type === "email") {
    // default|custom
    const { type = "default" } = ctx.request?.body || {}

    // Load either original or customised templates
    const allTemplates =
      type === "custom" ? await getTemplates() : addBaseTemplates([], "email")

    const filtered = allTemplates.filter(
      ({ purpose }) => purpose !== EmailTemplatePurpose.CORE
    )
    // Outline all the type keys
    const header = `# Template types: ${filtered.map(t => t.purpose).join(", ")} :) \n\n`
    const yamlContent = templatesToYaml(filtered)
    try {
      // Combine header and content
      const finalYaml = header + yamlContent
      ctx.attachment(
        `${type === "custom" ? "bb_email_templates" : "bb_default_email_templates"}.yaml`
      )
      const path = join(objectStore.budibaseTempDir(), v4())
      fs.writeFileSync(path, finalYaml)
      ctx.body = fs.createReadStream(path)
    } catch (err: any) {
      ctx.throw(
        err.status,
        `Could not download email templates: ${err.message}`
      )
    }
  }
}
