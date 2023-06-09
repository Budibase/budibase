import { destroy } from "../../api/controllers/row"
import { buildCtx } from "./utils"
import { getError } from "../automationUtils"
import {
  AutomationActionStepId,
  AutomationStepInput,
  AutomationStepSchema,
  AutomationStepType,
  AutomationIOType,
  AutomationCustomIOType,
  AutomationFeature,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  description: "Delete a row from your database",
  icon: "TableRowRemoveCenter",
  name: "Delete Row",
  tagline: "Delete a {{inputs.enriched.table.name}} row",
  type: AutomationStepType.ACTION,
  stepId: AutomationActionStepId.DELETE_ROW,
  internal: true,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  inputs: {},
  schema: {
    inputs: {
      properties: {
        tableId: {
          type: AutomationIOType.STRING,
          customType: AutomationCustomIOType.TABLE,
          title: "Table",
        },
        id: {
          type: AutomationIOType.STRING,
          title: "Row ID",
        },
      },
      required: ["tableId", "id"],
    },
    outputs: {
      properties: {
        row: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.ROW,
          description: "The deleted row",
        },
        response: {
          type: AutomationIOType.OBJECT,
          description: "The response from the table",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
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
