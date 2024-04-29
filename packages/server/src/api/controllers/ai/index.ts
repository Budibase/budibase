import { BadRequestError } from "@budibase/backend-core"
import { Ctx } from "@budibase/types"
import * as tessaract from "node-tesseract-ocr"

export async function parseReceipt(ctx: Ctx): Promise<any> {
  const file = ctx.request?.files?.file
  if (!file) {
    throw new BadRequestError("No file provided")
  }

  if (Array.isArray(file)) {
    throw new BadRequestError("Only one file can be uploaded")
  }

  const data = await tessaract.recognize(file.path, {
    lang: "engbest",
  })

  ctx.body = data
}
