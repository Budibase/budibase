const Router = require("@koa/router")
const StatusCodes = require("../../utilities/statusCodes")
const joiValidator = require("../../middleware/joi-validator")
const Joi = require("joi")
const {
  listScreens,
  saveScreen,
  buildPage,
  renameScreen,
  deleteScreen,
} = require("../../utilities/builder")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")

const router = Router()

function generateSaveValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _css: Joi.string().allow(""),
    name: Joi.string().required(),
    route: Joi.string().required(),
    props: Joi.object({
      _id: Joi.string().required(),
      _component: Joi.string().required(),
      _children: Joi.array().required(),
      _instanceName: Joi.string().required(),
      _styles: Joi.object().required(),
      type: Joi.string().optional(),
      table: Joi.string().optional(),
    }).required().unknown(true),
  }).unknown(true))
}

function generatePatchValidation() {
  return joiValidator.body(
    Joi.object({
      oldname: Joi.string().required(),
      newname: Joi.string().required(),
    }).unknown(true)
  )
}

router.post(
  "/_builder/api/:appId/pages/:pageName",
  authorized(BUILDER),
  async ctx => {
    await buildPage(
      ctx.config,
      ctx.params.appId,
      ctx.params.pageName,
      ctx.request.body
    )
    ctx.response.status = StatusCodes.OK
  }
)

router.get(
  "/_builder/api/:appId/pages/:pagename/screens",
  authorized(BUILDER),
  async ctx => {
    ctx.body = await listScreens(
      ctx.config,
      ctx.params.appId,
      ctx.params.pagename
    )
    ctx.response.status = StatusCodes.OK
  }
)

router.post(
  "/_builder/api/:appId/pages/:pagename/screen",
  authorized(BUILDER),
  generateSaveValidation(),
  async ctx => {
    ctx.body = await saveScreen(
      ctx.config,
      ctx.params.appId,
      ctx.params.pagename,
      ctx.request.body
    )
    ctx.response.status = StatusCodes.OK
  }
)

router.patch(
  "/_builder/api/:appname/pages/:pagename/screen",
  authorized(BUILDER),
  generatePatchValidation(),
  async ctx => {
    await renameScreen(
      ctx.config,
      ctx.params.appname,
      ctx.params.pagename,
      ctx.request.body.oldname,
      ctx.request.body.newname
    )
    ctx.response.status = StatusCodes.OK
  }
)

router.delete(
  "/_builder/api/pages/:pagename/screens/:id",
  authorized(BUILDER),
  async ctx => {
    await deleteScreen(
      ctx.config,
      ctx.user.appId,
      ctx.params.pagename,
      ctx.params.id
    )

    ctx.response.status = StatusCodes.OK
  }
)

module.exports = router
