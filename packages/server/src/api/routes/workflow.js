const Router = require("@koa/router")
const controller = require("../controllers/workflow")
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
    type: Joi.string().valid("workflow").required(),
    definition: Joi.object({
      steps: Joi.array().required().items(generateStepSchema(["ACTION", "LOGIC"])),
      trigger: generateStepSchema(["TRIGGER"]),
    }).required().unknown(true),
  }).unknown(true))
}

router
  .get(
    "/api/workflows/trigger/list",
    authorized(BUILDER),
    controller.getTriggerList
  )
  .get(
    "/api/workflows/action/list",
    authorized(BUILDER),
    controller.getActionList
  )
  .get(
    "/api/workflows/logic/list",
    authorized(BUILDER),
    controller.getLogicList
  )
  .get(
    "/api/workflows/definitions/list",
    authorized(BUILDER),
    controller.getDefinitionList
  )
  .get("/api/workflows", authorized(BUILDER), controller.fetch)
  .get("/api/workflows/:id", authorized(BUILDER), controller.find)
  .put(
    "/api/workflows",
    authorized(BUILDER),
    generateValidator(true),
    controller.update
  )
  .post(
    "/api/workflows",
    authorized(BUILDER),
    generateValidator(false),
    controller.create
  )
  .post("/api/workflows/:id/trigger", controller.trigger)
  .delete("/api/workflows/:id/:rev", authorized(BUILDER), controller.destroy)

module.exports = router
