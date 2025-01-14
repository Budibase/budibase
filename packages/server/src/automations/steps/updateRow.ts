import { EventEmitter } from "events"
import * as rowController from "../../api/controllers/row"
import * as automationUtils from "../automationUtils"
import { buildCtx } from "./utils"
import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationFeature,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
  UpdateRowStepInputs,
  UpdateRowStepOutputs,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
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
export async function run({
  inputs,
  appId,
  emitter,
}: {
  inputs: UpdateRowStepInputs
  appId: string
  emitter: EventEmitter
}): Promise<UpdateRowStepOutputs> {
  if (inputs.rowId == null || inputs.row == null) {
    return {
      success: false,
      response: {
        message: "Invalid inputs",
      },
    }
  }
  const tableId = inputs.row.tableId
    ? decodeURIComponent(inputs.row.tableId)
    : inputs.row.tableId

  // Base update
  let rowUpdate: Record<string, any>

  // Legacy
  // Find previously set values and add them to the update. Ensure empty relationships
  // are added to the update if clearRelationships is true
  const legacyUpdated = Object.keys(inputs.row || {}).reduce(
    (acc: Record<string, any>, key: string) => {
      const isEmpty = inputs.row[key] == null || inputs.row[key]?.length === 0
      const fieldConfig = inputs.meta?.fields || {}

      if (isEmpty) {
        if (
          Object.hasOwn(fieldConfig, key) &&
          fieldConfig[key].clearRelationships === true
        ) {
          // Explicitly clear the field on update
          acc[key] = []
        }
      } else {
        // Keep non-empty values
        acc[key] = inputs.row[key]
      }
      return acc
    },
    {}
  )

  // The source of truth for inclusion in the update is: inputs.meta?.fields
  const parsedUpdate = Object.keys(inputs.meta?.fields || {}).reduce(
    (acc: Record<string, any>, key: string) => {
      const fieldConfig = inputs.meta?.fields?.[key] || {}
      // Ignore legacy config.
      if (Object.hasOwn(fieldConfig, "clearRelationships")) {
        return acc
      }
      acc[key] =
        !inputs.row[key] || inputs.row[key]?.length === 0 ? "" : inputs.row[key]
      return acc
    },
    {}
  )

  rowUpdate = {
    tableId,
    ...parsedUpdate,
    ...legacyUpdated,
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
        tableId: tableId,
      },
    })
    await rowController.patch(ctx)
    return {
      row: ctx.body,
      response: ctx.message,
      id: ctx.body._id,
      revision: ctx.body._rev,
      success: !!ctx.body._id,
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
