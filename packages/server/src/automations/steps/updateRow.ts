import * as rowController from "../../api/controllers/row"
import * as automationUtils from "../automationUtils"
import { buildCtx } from "./utils"
import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  name: "Update Row",
  tagline: "Update a {{inputs.enriched.table.name}} row",
  icon: "Refresh",
  description: "Update a row in your database",
  type: "ACTION",
  internal: true,
  stepId: AutomationActionStepId.UPDATE_ROW,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        row: {
          type: "object",
          customType: "row",
          title: "Table",
        },
        rowId: {
          type: "string",
          title: "Row ID",
        },
      },
      required: ["row", "rowId"],
    },
    outputs: {
      properties: {
        row: {
          type: "object",
          customType: "row",
          description: "The updated row",
        },
        response: {
          type: "object",
          description: "The response from the table",
        },
        success: {
          type: "boolean",
          description: "Whether the action was successful",
        },
        id: {
          type: "string",
          description: "The identifier of the updated row",
        },
        revision: {
          type: "string",
          description: "The revision of the updated row",
        },
      },
      required: ["success", "id", "revision"],
    },
  },
}

export async function run({ inputs, appId, emitter }: AutomationStepInput) {
  if (inputs.rowId == null || inputs.row == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }
  const tableId = inputs.row.tableId

  // clear any undefined, null or empty string properties so that they aren't updated
  for (let propKey of Object.keys(inputs.row)) {
    if (inputs.row[propKey] == null || inputs.row[propKey] === "") {
      delete inputs.row[propKey]
    }
  }

  // have to clean up the row, remove the table from it
  const ctx: any = buildCtx(appId, emitter, {
    body: {
      ...inputs.row,
      _id: inputs.rowId,
    },
    params: {
      rowId: inputs.rowId,
      tableId: tableId,
    },
  })

  try {
    if (tableId) {
      inputs.row = await automationUtils.cleanUpRow(tableId, inputs.row)
    }
    await rowController.patch(ctx)
    return {
      row: ctx.body,
      response: ctx.message,
      id: ctx.body._id,
      revision: ctx.body._rev,
      success: ctx.status === 200,
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
