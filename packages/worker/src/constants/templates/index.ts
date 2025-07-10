import { readStaticFile } from "../../utilities/fileSystem"
import { TemplateType, TemplatePurpose, GLOBAL_OWNER } from "../index"
import { join } from "path"
import { db as dbCore, tenancy, context } from "@budibase/backend-core"
import { Template, EmailTemplatePurpose } from "@budibase/types"
import yaml from "yaml"

export const EmailTemplates = {
  [EmailTemplatePurpose.PASSWORD_RECOVERY]: readStaticFile(
    join(__dirname, "passwordRecovery.hbs")
  ),
  [EmailTemplatePurpose.INVITATION]: readStaticFile(
    join(__dirname, "invitation.hbs")
  ),
  [EmailTemplatePurpose.BASE]: readStaticFile(join(__dirname, "base.hbs")),
  [EmailTemplatePurpose.WELCOME]: readStaticFile(
    join(__dirname, "welcome.hbs")
  ),
  [EmailTemplatePurpose.CUSTOM]: readStaticFile(join(__dirname, "custom.hbs")),
  [EmailTemplatePurpose.CORE]: readStaticFile(join(__dirname, "core.hbs")),
}

export const removeWhitespaceBetweenTags = (content: string) => {
  return content.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim()
}

export async function loadTemplateConfig(pathTo: string) {
  let templateConfig: Record<string, string>

  try {
    console.log("Loading email templates:", pathTo)
    const config = readStaticFile(pathTo)
    const parsed = yaml.parse(config)

    if (!parsed || !parsed.templates) {
      console.log(`No email templates found: ${pathTo}`)
      return
    }

    // Remove core as it contains licensed content
    // Unlikely, but just to be certain
    const { core, ...rest } = parsed.templates
    templateConfig = rest
  } catch (e: any) {
    console.log("There was a problem parsing email templates: ", e.message)
    return
  }

  await context.doInTenant(tenancy.getTenantId(), async () => {
    try {
      const templates = await getTemplates({ type: "email" })

      const updates: Template[] = templates.reduce(
        (acc: Template[], template: Template) => {
          const config = templateConfig[template.purpose]
          if (config) {
            // Need to normalise the text spacing for comparison
            const configContent = removeWhitespaceBetweenTags(config)
            const templateContent = removeWhitespaceBetweenTags(
              template.contents
            )

            // If the template is exactly the same, ignore it.
            if (configContent === templateContent) return acc
            const owner = template.ownerId || GLOBAL_OWNER
            // Create/Update template docs
            acc.push({
              ...template,
              contents: config,
              ...(!template._id
                ? { _id: dbCore.generateTemplateID(owner) }
                : {}),
              ownerId: owner,
            })
          }
          return acc
        },
        []
      )

      if (updates.length) {
        const updateList = updates.map(u => u.purpose)
        const db = tenancy.getGlobalDB()
        await db.bulkDocs(updates)
        console.log(`Email templates updated: ${updateList.join(",")}`)
      } else {
        console.log(`Email templates unchanged`)
      }
    } catch (e: any) {
      console.log("Error persisting email templates", e.message)
    }
  })
}

export function addBaseTemplates(templates: Template[], type?: string) {
  let purposeList
  switch (type) {
    case TemplateType.EMAIL:
      purposeList = Object.values(EmailTemplatePurpose)
      break
    default:
      purposeList = Object.values(TemplatePurpose)
      break
  }
  for (let purpose of purposeList) {
    // check if a template exists already for purpose
    if (templates.find(template => template.purpose === purpose)) {
      continue
    }
    if (EmailTemplates[purpose]) {
      templates.push({
        contents: EmailTemplates[purpose],
        purpose,
        type,
      })
    }
  }
  return templates
}

export async function getTemplates({
  ownerId,
  type,
}: { ownerId?: string; type?: string } = {}) {
  const db = tenancy.getGlobalDB()
  const response = await db.allDocs<Template>(
    dbCore.getTemplateParams(ownerId || GLOBAL_OWNER, undefined, {
      include_docs: true,
    })
  )
  let templates = response.rows.map(row => row.doc!)
  if (type) {
    templates = templates.filter(template => template.type === type)
  }
  return addBaseTemplates(templates, type)
}

export async function getTemplateByID(id: string, ownerId?: string) {
  const db = tenancy.getGlobalDB()
  const response = await db.allDocs<Template>(
    dbCore.getTemplateParams(ownerId || GLOBAL_OWNER, id, {
      include_docs: true,
    })
  )
  let templates = response.rows.map(row => row.doc!)
  // should only be one template with ID
  return templates[0]
}

export async function getTemplateByPurpose(type: string, purpose: string) {
  const templates = await getTemplates({ type })
  return templates.find((template: Template) => template.purpose === purpose)
}
