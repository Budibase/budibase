const Router = require("@koa/router")
const controller = require("../../controllers/global/sp2019")
const { joiValidator } = require("@budibase/backend-core/auth")
const { adminOnly } = require("@budibase/backend-core/auth")
const Joi = require("joi")


const router = Router()

function buildSP2019Validation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    siteUrl: Joi.string().allow("", null),
    username: Joi.string().allow("", null),
    password: Joi.string().allow("", null),
    domain: Joi.string().allow("", null),
  }).required().unknown(true))
}

router.post(
  "/api/global/sp2019/lists",
  buildSP2019Validation(),
  adminOnly,
  controller.sp2019Lists
)

module.exports = router
