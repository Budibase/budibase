import { readStaticFile } from "../../utilities/fileSystem"
import {
  EmailTemplatePurpose,
  TemplateType,
  TemplatePurpose,
  GLOBAL_OWNER,
} from "../index"
import { join } from "path"
import { db as dbCore, tenancy } from "@budibase/backend-core"
import { Template } from "@budibase/types"

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
  id,
}: { ownerId?: string; type?: string; id?: string } = {}) {
  const db = tenancy.getGlobalDB()
  const response = await db.allDocs(
    dbCore.getTemplateParams(ownerId || GLOBAL_OWNER, id, {
      include_docs: true,
    })
  )
  let templates = response.rows.map(row => row.doc)
  // should only be one template with ID
  if (id) {
    return templates[0]
  }
  if (type) {
    templates = templates.filter(template => template.type === type)
  }
  return addBaseTemplates(templates, type)
}

export async function getTemplateByPurpose(type: string, purpose: string) {
  const templates = await getTemplates({ type })
  return templates.find((template: Template) => template.purpose === purpose)
}
