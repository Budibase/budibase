import Router from "@koa/router"
import Joi from "joi"
import * as controller from "../controllers/ai"
import { auth, permissions } from "@budibase/backend-core"
import authorized from "../../middleware/authorized"

const router: Router = new Router()

function aiPromptValidator() {
  return auth.joiValidator.body(
    Joi.object({
      prompt: Joi.string().required(),
      model: Joi.string().required().valid("ChatGPT"),
    }).unknown(false)
  )
}

router
  .post(
    "/api/ai/prompt",
    function(ctx: any, next: any) {
      return next()
    },
    // authorized(permissions.BUILDER),
    aiPromptValidator(),
    controller.prompt
  )
  .post(
    "/api/ai/summarizetext",
    function(ctx: any, next: any) {
      return next()
    },
    // authorized(permissions.BUILDER),
    aiPromptValidator(),
    controller.summariseText
  )

export default router
