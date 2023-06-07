import { save } from "../../api/controllers/row"
import { cleanUpRow, getError } from "../automationUtils"
import { buildCtx } from "./utils"
import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationIOType,
  AutomationStepInput,
  AutomationStepSchema,
  AutomationStepType,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  name: "Create Row",
  tagline: "Create a {{inputs.enriched.table.name}} row",
  icon: "TableRowAddBottom",
  description: "Add a row to your database",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  stepId: AutomationActionStepId.CREATE_ROW,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        row: {
          type: AutomationIOType.OBJECT,
          properties: {
            tableId: {
              type: AutomationIOType.STRING,
              customType: AutomationCustomIOType.TABLE,
            },
          },
          customType: AutomationCustomIOType.ROW,
          title: "Table",
          required: ["tableId"],
        },
      },
      required: ["row"],
    },
    outputs: {
      properties: {
        row: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.ROW,
          description: "The new row",
        },
        response: {
          type: AutomationIOType.OBJECT,
          description: "The response from the table",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the row creation was successful",
        },
        id: {
          type: AutomationIOType.STRING,
          description: "The identifier of the new row",
        },
        revision: {
          type: AutomationIOType.STRING,
          description: "The revision of the new row",
        },
      },
      required: ["success", "id", "revision"],
    },
  },
}

export async function run({ inputs, appId, emitter }: AutomationStepInput) {
  if (inputs.row == null || inputs.row.tableId == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }
  // have to clean up the row, remove the table from it
  const ctx: any = buildCtx(appId, emitter, {
    body: inputs.row,
    params: {
      tableId: inputs.row.tableId,
    },
  })

  try {
    inputs.row = await cleanUpRow(inputs.row.tableId, inputs.row)
    await save(ctx)
    return {
      row: inputs.row,
      response: ctx.body,
      id: ctx.body._id,
      revision: ctx.body._rev,
      success: ctx.status === 200,
    }
  } catch (err) {
    return {
      success: false,
      response: getError(err),
    }
  }
}
