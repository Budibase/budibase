const Router = require("@koa/router")
const controller = require("../../controllers/admin/email")
const { EmailTemplatePurpose } = require("../../../constants")
const joiValidator = require("../../../middleware/joi-validator")
const Joi = require("joi")

const router = Router()

function buildEmailSendValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    email: Joi.string().email(),
    purpose: Joi.string().valid(...Object.values(EmailTemplatePurpose)),
    groupId: Joi.string().allow("", null),
    fromt: Joi.string().allow("", null),
    contents: Joi.string().allow("", null),
    subject: Joi.string().allow("", null),
  }).required().unknown(true))
}

router.post(
  "/api/admin/email/send",
  buildEmailSendValidation(),
  controller.sendEmail
)

module.exports = router
