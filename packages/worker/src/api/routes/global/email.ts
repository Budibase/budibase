import Router from "@koa/router"
import * as controller from "../../controllers/global/email"
import { EmailTemplatePurpose } from "../../../constants"
import { auth } from "@budibase/backend-core"
import Joi from "joi"

const router: Router = new Router()

function buildEmailSendValidation() {
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
    purpose: Joi.string().valid(...Object.values(EmailTemplatePurpose)),
    workspaceId: Joi.string().allow("", null),
    from: Joi.string().allow("", null),
    contents: Joi.string().allow("", null),
    subject: Joi.string().allow("", null),
  }).required().unknown(true))
}

router.post(
  "/api/global/email/send",
  buildEmailSendValidation(),
  auth.adminOnly,
  controller.sendEmail
)

export default router
