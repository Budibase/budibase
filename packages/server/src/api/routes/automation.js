const Router = require("@koa/router")
const controller = require("../controllers/automation")
const authorized = require("../../middleware/authorized")
const joiValidator = require("../../middleware/joi-validator")
const { BUILDER } = require("../../utilities/accessLevels")
const Joi = require("joi")

const router = Router()

// prettier-ignore
function generateStepSchema(allowStepTypes) {
  return Joi.object({
    stepId: Joi.string().required(),
    id: Joi.string().required(),
    description: Joi.string().required(),
    name: Joi.string().required(),
    tagline: Joi.string().required(),
    icon: Joi.string().required(),
    params: Joi.object(),
    // TODO: validate args a bit more deeply
    args: Joi.object(),
    type: Joi.string().required().valid(...allowStepTypes),
  }).unknown(true)
}

function generateValidator(existing = false) {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    live: Joi.bool(),
    _id: existing ? Joi.string().required() : Joi.string(),
    _rev: existing ? Joi.string().required() : Joi.string(),
    name: Joi.string().required(),
    type: Joi.string().valid("automation").required(),
    definition: Joi.object({
      steps: Joi.array().required().items(generateStepSchema(["ACTION", "LOGIC"])),
      trigger: generateStepSchema(["TRIGGER"]),
    }).required().unknown(true),
  }).unknown(true))
}

router
  .get(
    "/api/automations/trigger/list",
    authorized(BUILDER),
    controller.getTriggerList
  )
  .get(
    "/api/automations/action/list",
    authorized(BUILDER),
    controller.getActionList
  )
  .get(
    "/api/automations/logic/list",
    authorized(BUILDER),
    controller.getLogicList
  )
  .get(
    "/api/automations/definitions/list",
    authorized(BUILDER),
    controller.getDefinitionList
  )
  .get("/api/automations", authorized(BUILDER), controller.fetch)
  .get("/api/automations/:id", authorized(BUILDER), controller.find)
  .put(
    "/api/automations",
    authorized(BUILDER),
    generateValidator(true),
    controller.update
  )
  .post(
    "/api/automations",
    authorized(BUILDER),
    generateValidator(false),
    controller.create
  )
  .post("/api/automations/:id/trigger", controller.trigger)
  .delete("/api/automations/:id/:rev", authorized(BUILDER), controller.destroy)

module.exports = router
