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
    groupId: Joi.string().allow("", null),
    purpose: Joi.string().allow(...Object.values(EmailTemplatePurpose)),
  }).required().unknown(true))
}

router.post(
  "/api/admin/email/send",
  buildEmailSendValidation(),
  controller.sendEmail
)

module.exports = router
