import { destroy } from "../../api/controllers/row"
import { buildCtx } from "./utils"
import { getError } from "../automationUtils"
import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  description: "Delete a row from your database",
  icon: "TableRowRemoveCenter",
  name: "Delete Row",
  tagline: "Delete a {{inputs.enriched.table.name}} row",
  type: "ACTION",
  stepId: AutomationActionStepId.DELETE_ROW,
  internal: true,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        tableId: {
          type: "string",
          customType: "table",
          title: "Table",
        },
        id: {
          type: "string",
          title: "Row ID",
        },
      },
      required: ["tableId", "id"],
    },
    outputs: {
      properties: {
        row: {
          type: "object",
          customType: "row",
          description: "The deleted row",
        },
        response: {
          type: "object",
          description: "The response from the table",
        },
        success: {
          type: "boolean",
          description: "Whether the deletion was successful",
        },
      },
      required: ["row", "success"],
    },
  },
}

export async function run({ inputs, appId, emitter }: AutomationStepInput) {
  if (inputs.id == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }

  let ctx: any = buildCtx(appId, emitter, {
    body: {
      _id: inputs.id,
      _rev: inputs.revision,
    },
    params: {
      tableId: inputs.tableId,
    },
  })

  try {
    await destroy(ctx)
    return {
      response: ctx.body,
      row: ctx.row,
      success: ctx.status === 200,
    }
  } catch (err) {
    return {
      success: false,
      response: getError(err),
    }
  }
}
