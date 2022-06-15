const Router = require("@koa/router")
const controller = require("../../controllers/global/groups")
const joiValidator = require("../../../middleware/joi-validator")
const adminOnly = require("../../../middleware/adminOnly")
const Joi = require("joi")

const router = Router()

function buildGroupSaveValidation() {
    // prettier-ignore
    return joiValidator.body(Joi.object({
        color: Joi.string().required(),
        icon: Joi.string().required(),
        name: Joi.string().required()
    }).required())
}

router.post(
    "/api/global/groups",
    adminOnly,
    buildGroupSaveValidation(),
    controller.save
)
    .get("/api/global/groups", controller.fetch)


module.exports = router
