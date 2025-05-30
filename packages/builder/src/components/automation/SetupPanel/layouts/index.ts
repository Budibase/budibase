import APIRequest from "./APIRequest.svelte"
import { DrawerBindableInput } from "@/components/common/bindings"
import { automationStore, selectedAutomation } from "@/stores/builder"
import { Divider, Helpers, Select } from "@budibase/bbui"
import {
  AutomationActionStepId,
  AutomationEventType,
  AutomationStep,
  AutomationStepType,
  AutomationTrigger,
  BaseIOStructure,
  isTrigger,
  Row,
} from "@budibase/types"
import AutomationBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
import { RowSelector, TableSelector } from "../"
import { get, Writable } from "svelte/store"
import {
  type StepInputs,
  type SchemaConfigProps,
  type FormUpdate,
} from "@/types/automations"
import RowFetch from "../RowFetch.svelte"

export const getInputValue = (inputData: StepInputs, key: string) => {
  const idxInput = inputData as Record<string, unknown>
  return idxInput?.[key]
}

// We do not enforce required fields.
export const getFieldLabel = (
  key: string,
  value: BaseIOStructure,
  isRequired = false
) => {
  const requiredSuffix = isRequired ? "*" : ""
  const label = `${
    value.title || (key === "row" ? "Row" : key)
  } ${requiredSuffix}`
  return Helpers.capitalise(label)
}

/**
 * Returns a custom step layout. This generates an array of ui elements
 * intended to be rendered as a uniform column
 * If you intend to have a completely unique UX,
 *
 * @param block
 * @param stepState
 * @param isTest
 * @returns
 */

export const getCustomStepLayout = (
  block: AutomationStep | AutomationTrigger | undefined,
  stepState: Writable<Record<string, any>>,
  isTest = false
): SchemaConfigProps[] | undefined => {
  if (!block) {
    return
  }

  // Use the test data for test mode otherwise resolve trigger/step inputs by block
  const fieldData = isTest
    ? get(selectedAutomation)?.data?.testData
    : automationStore.actions.getInputData(block)

  const coreDivider = {
    comp: Divider,
    props: () => ({
      noMargin: true,
    }),
    wrapped: false,
  }

  const getIdConfig = (rowIdentifier: string): SchemaConfigProps[] => {
    const schema =
      block.type === AutomationStepType.TRIGGER
        ? block.schema.outputs.properties
        : block.schema.inputs.properties

    const rowIdEntry = schema[rowIdentifier]
    if (!rowIdEntry) {
      return []
    }

    const rowIdlabel = getFieldLabel(rowIdentifier, rowIdEntry)

    const layout: SchemaConfigProps[] = [
      {
        comp: DrawerBindableInput,
        title: rowIdlabel,
        onChange: (e: CustomEvent<FormUpdate>) => {
          const update = { [rowIdentifier]: e.detail }
          if (block) {
            automationStore.actions.requestUpdate(update, block)
          }
        },
        props: () => {
          return {
            panel: AutomationBindingPanel,
            value: getInputValue(fieldData, rowIdentifier),
            updateOnChange: false,
          }
        },
      },
    ]

    return layout
  }

  const getRowSelector = (): SchemaConfigProps[] => {
    const row: Row = getInputValue(fieldData, "row") as Row
    const meta: Record<string, unknown> = getInputValue(
      fieldData,
      "meta"
    ) as Record<string, unknown>

    return [
      {
        comp: RowSelector,
        wrapped: false,
        props: () => ({
          row,
          meta: meta || {},
          componentWidth: 280,
          fullWidth: true,
        }),
        onChange: (e: CustomEvent<FormUpdate>) => {
          if (block) {
            const metaUpdate = e.detail?.meta as Record<string, unknown>

            automationStore.actions.requestUpdate(
              {
                row: e.detail.row,
                meta: {
                  fields: metaUpdate?.fields || {},
                },
              },
              block
            )
          }
        },
      },
    ]
  }

  const getTableSelector = (): SchemaConfigProps[] => {
    const row: Row = getInputValue(fieldData, "row") as Row
    return [
      {
        comp: TableSelector,
        title: "Table",
        onChange: (e: CustomEvent) => {
          const rowKey = get(stepState)[block.id]?.rowType || "row"
          automationStore.actions.requestUpdate(
            {
              _tableId: e.detail,
              meta: {},
              [rowKey]: e.detail
                ? {
                    tableId: e.detail,
                  }
                : {},
            },
            block
          )
        },
        props: () => ({
          isTrigger: isTrigger(block),
          value: row?.tableId ?? "",
          disabled: isTest,
        }),
      },
    ]
  }

  // STEP
  if (automationStore.actions.isRowStep(block)) {
    const layout: SchemaConfigProps[] = [
      ...getTableSelector(),
      ...getIdConfig("rowId"),
      coreDivider,
      ...getRowSelector(),
    ]
    return layout
  } else if (automationStore.actions.isRowTrigger(block) && isTest) {
    // TRIGGER/TEST - Will be used to replace the test modal
    const schema = block.schema.outputs.properties

    const getRevConfig = (): SchemaConfigProps[] => {
      // part of outputs for row type
      const rowRevEntry = schema["revision"]
      if (!rowRevEntry) {
        return []
      }
      const rowRevlabel = getFieldLabel("revision", rowRevEntry)
      const selected = get(selectedAutomation)
      const triggerOutputs = selected.data?.testData

      return [
        {
          comp: DrawerBindableInput,
          title: rowRevlabel,
          onChange: (e: CustomEvent<FormUpdate>) => {
            const update = { ["revision"]: e.detail }
            if (block) {
              automationStore.actions.requestUpdate(update, block)
            }
          },
          props: () => ({
            panel: AutomationBindingPanel,
            value: triggerOutputs ? triggerOutputs["revision"] : undefined,
            updateOnChange: false,
          }),
        },
      ]
    }

    // A select to switch from `row` to `oldRow`
    const getRowTypeConfig = (): SchemaConfigProps[] => {
      if (block.event !== AutomationEventType.ROW_UPDATE) {
        return []
      }

      if (!get(stepState)?.[block.id]?.rowType) {
        stepState.update(state => ({
          ...state,
          [block.id]: {
            rowType: "row",
          },
        }))
      }

      type RowType = { name: string; id: string }

      return [
        {
          comp: Select,
          tooltip: `You can configure test data for both the updated row and
          the old row, if you need it. Just select the one you wish to alter`,
          title: "Row data",
          props: () => ({
            value: get(stepState)?.[block.id].rowType,
            placeholder: false,
            getOptionLabel: (type: RowType) => type.name,
            getOptionValue: (type: RowType) => type.id,
            options: [
              {
                id: "row",
                name: "Updated row",
              },
              { id: "oldRow", name: "Old row" },
            ] as RowType[],
          }),
          onChange: (e: CustomEvent) => {
            if (e.detail === get(stepState)?.[block.id].rowType) {
              return
            }
            stepState.update(state => ({
              ...state,
              [block.id]: {
                rowType: e.detail,
              },
            }))
          },
        },
      ]
    }

    const getTriggerRowSelector = (): SchemaConfigProps[] => {
      const rowKey = get(stepState)?.[block.id]?.rowType ?? "row"
      const rowData: Row = getInputValue(fieldData, rowKey) as Row
      const row: Row = getInputValue(fieldData, "row") as Row
      const meta: Record<string, unknown> = getInputValue(
        fieldData,
        "meta"
      ) as Record<string, unknown>
      return [
        {
          comp: RowSelector,
          wrapped: false,
          props: () => ({
            componentWidth: 280,
            row: rowData || {
              tableId: row?.tableId,
            },
            meta: {
              fields: meta?.oldFields || {},
            },
          }),
          onChange: (e: CustomEvent<FormUpdate>) => {
            const metaUpdate = e.detail?.meta as Record<string, unknown>

            const update = {
              [rowKey]: e.detail.row,
              meta: {
                fields: meta?.fields || {},
                oldFields:
                  (metaUpdate?.fields as Record<string, unknown>) || {},
              },
            }
            if (block) {
              automationStore.actions.requestUpdate(update, block)
            }
          },
        },
      ]
    }

    const layout: SchemaConfigProps[] = [
      ...getTableSelector(),
      {
        comp: RowFetch,
        title: "Row",
        props: () => {
          return {
            tableId: "ta_bb_employee",
            meta: getInputValue(fieldData, "meta"),
          }
        },
        onChange: () => {},
      },
      ...getIdConfig("id"),
      ...getRevConfig(),
      ...getRowTypeConfig(),
      coreDivider,
      ...getTriggerRowSelector(),
    ]
    return layout
  } else if (block.stepId === AutomationActionStepId.API_REQUEST) {
    return [
      {
        comp: APIRequest,
        wrapped: false,
      },
    ]
  }
}
