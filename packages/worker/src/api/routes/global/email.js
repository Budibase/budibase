const Router = require("@koa/router")
const controller = require("../../controllers/global/email")
const { EmailTemplatePurpose } = require("../../../constants")
const { joiValidator } = require("@budibase/backend-core/auth")
const { adminOnly } = require("@budibase/backend-core/auth")
const Joi = require("joi")

const router = Router()

function buildEmailSendValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    email: Joi.string().email(),
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
  adminOnly,
  controller.sendEmail
)

module.exports = router
