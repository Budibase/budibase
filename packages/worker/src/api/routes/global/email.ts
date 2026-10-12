import * as controller from "../../controllers/global/email"
import { auth } from "@budibase/backend-core"
import { EmailTemplatePurpose } from "@budibase/types"
import Joi from "joi"
import { adminRoutes } from "../endpointGroups"

function buildEmailSendValidation() {
  const purposes = Object.values(EmailTemplatePurpose).filter(
    purpose => purpose !== EmailTemplatePurpose.WORKSPACE_INVITATION
  )

  // prettier-ignore
  return auth.joiValidator.body(Joi.object({
    email: Joi.string().email({
      multiple: true,
    }),
    cc: Joi.string().email({
      multiple: true,
    }).allow("", null),
    bcc: Joi.string().email({
      multiple: true,
    }).allow("", null),
    purpose: Joi.string().valid(...purposes),
    workspaceId: Joi.string().allow("", null),
    from: Joi.string().allow("", null),
    contents: Joi.string().allow("", null),
    subject: Joi.string().allow("", null),
  }).required().unknown(true))
}

adminRoutes.post(
  "/api/global/email/send",
  buildEmailSendValidation(),
  controller.sendEmail
)
