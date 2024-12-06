import nodeFetch from "node-fetch"
import { downloadTemplate as dlTemplate } from "../../utilities/fileSystem"
import env from "../../environment"
import {
  DownloadTemplateResponse,
  FetchGlobalTemplateResponse,
  UserCtx,
} from "@budibase/types"

// development flag, can be used to test against templates exported locally
const DEFAULT_TEMPLATES_BUCKET =
  "prod-budi-templates.s3-eu-west-1.amazonaws.com"

export async function fetch(ctx: UserCtx<void, FetchGlobalTemplateResponse>) {
  let type = env.TEMPLATE_REPOSITORY
  let response,
    error = false
  try {
    response = await nodeFetch(
      `https://${DEFAULT_TEMPLATES_BUCKET}/manifest.json`
    )
    if (response.status !== 200) {
      error = true
    }
  } catch (err) {
    error = true
  }
  // if there is an error, simply return no templates
  if (!error && response) {
    const json = await response.json()
    ctx.body = Object.values(json.templates[type])
  } else {
    ctx.body = []
  }
}

// can't currently test this, have to ignore from coverage
/* istanbul ignore next */
export async function downloadTemplate(
  ctx: UserCtx<void, DownloadTemplateResponse>
) {
  const { type, name } = ctx.params

  await dlTemplate(type, name)

  ctx.body = {
    message: `template ${type}:${name} downloaded successfully.`,
  }
}
