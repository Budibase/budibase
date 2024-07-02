import Router from "@koa/router"
import Joi from "joi"
import { auth } from "@budibase/backend-core"
import * as controller from "../../controllers/global/tenant"
import cloudRestricted from "../../../middleware/cloudRestricted"

const router: Router = new Router()
const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")

function buildTenantInfoValidation() {
  return auth.joiValidator.body(
    Joi.object({
      owner: Joi.object({
        email: Joi.string().required(),
        password: OPTIONAL_STRING,
        ssoId: OPTIONAL_STRING,
        givenName: OPTIONAL_STRING,
        familyName: OPTIONAL_STRING,
        budibaseUserId: OPTIONAL_STRING,
      }).required(),
      hosting: Joi.string().required(),
      tenantId: Joi.string().required(),
    }).required()
  )
}

router
  .post(
    "/api/global/tenant",
    cloudRestricted,
    buildTenantInfoValidation(),
    controller.save
  )
  .get("/api/global/tenant/:id", controller.get)

export default router
