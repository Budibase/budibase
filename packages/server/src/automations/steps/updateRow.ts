import * as rowController from "../../api/controllers/row"
import * as automationUtils from "../automationUtils"
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
  name: "Update Row",
  tagline: "Update a {{inputs.enriched.table.name}} row",
  icon: "Refresh",
  description: "Update a row in your database",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  stepId: AutomationActionStepId.UPDATE_ROW,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        meta: {
          type: AutomationIOType.OBJECT,
          title: "Field settings",
        },
        row: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.ROW,
          title: "Table",
        },
        rowId: {
          type: AutomationIOType.STRING,
          title: "Row ID",
        },
      },
      required: ["row", "rowId"],
    },
    outputs: {
      properties: {
        row: {
          type: AutomationIOType.OBJECT,
          customType: AutomationCustomIOType.ROW,
          description: "The updated row",
        },
        response: {
          type: AutomationIOType.OBJECT,
          description: "The response from the table",
        },
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the action was successful",
        },
        id: {
          type: AutomationIOType.STRING,
          description: "The identifier of the updated row",
        },
        revision: {
          type: AutomationIOType.STRING,
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

  // Base update
  let rowUpdate: Record<string, any> = {
    tableId,
  }

  // Column checking - explicit clearing of empty fields
  if (inputs?.meta?.columns) {
    rowUpdate = inputs?.meta?.columns.reduce(
      (acc: Record<string, any>, key: string) => {
        acc[key] =
          !inputs.row[key] || inputs.row[key]?.length === 0
            ? null
            : inputs.row[key]
        return acc
      },
      {}
    )
  } else {
    // Legacy - clear any empty string column values so that they aren't updated
    rowUpdate = {
      ...inputs.row,
    }
    for (let propKey of Object.keys(rowUpdate)) {
      const clearRelationships =
        inputs.meta?.fields?.[propKey]?.clearRelationships
      if (
        (rowUpdate[propKey] == null || rowUpdate[propKey]?.length === 0) &&
        !clearRelationships
      ) {
        delete rowUpdate[propKey]
      }
    }
  }

  try {
    if (tableId) {
      rowUpdate = await automationUtils.cleanUpRow(tableId, rowUpdate)

      rowUpdate = await automationUtils.sendAutomationAttachmentsToStorage(
        tableId,
        rowUpdate
      )
    }
    // have to clean up the row, remove the table from it
    const ctx: any = buildCtx(appId, emitter, {
      body: {
        ...rowUpdate,
        _id: inputs.rowId,
      },
      params: {
        rowId: inputs.rowId,
        tableId,
      },
    })
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
