<script lang="ts">
  import {
    type BaseIOStructure,
    type AutomationStep,
    type AutomationTrigger,
    AutomationActionStepId,
    AutomationCustomIOType,
    AutomationIOType,
    AutomationStepType,
  } from "@budibase/types"
  import {
    AutomationSelector,
    CronBuilder,
    DateSelector,
    ExecuteScript,
    ExecuteScriptV2,
    FieldSelector,
    FileSelector,
    FilterSelector,
    PropField,
    QueryParamSelector,
    SchemaSetup,
    TableSelector,
  } from "."
  import { getFieldLabel, getInputValue } from "./layouts"
  import { automationStore, tables } from "@/stores/builder"
  import {
    type AutomationSchemaConfig,
    type FieldProps,
    type FormUpdate,
    type FileSelectorMeta,
    type StepInputs,
    SchemaFieldTypes,
    customTypeToSchema,
    typeToSchema,
  } from "@/types/automations"
  import { Select, Checkbox } from "@budibase/bbui"
  import {
    DrawerBindableInput,
    ServerBindingPanel as AutomationBindingPanel,
  } from "@/components/common/bindings"
  import Editor from "@/components/integration/QueryEditor.svelte"
  import WebhookDisplay from "@/components/automation/Shared/WebhookDisplay.svelte"
  import CategorySelector from "./CategorySelector.svelte"

  export let block: AutomationStep | AutomationTrigger | undefined = undefined
  export let context: {} | undefined
  export let bindings: any[] | undefined = undefined

  const SchemaTypes: AutomationSchemaConfig = {
    [SchemaFieldTypes.ENUM]: {
      comp: Select,
      props: (opts: FieldProps = {} as FieldProps) => {
        const field = opts.field
        return {
          placeholder: false,
          options: field.enum,
          getOptionLabel: (x: string, idx: number) => {
            return field.pretty ? field.pretty[idx] : x
          },
          disabled: field.readonly,
        }
      },
    },
    [SchemaFieldTypes.TABLE]: {
      comp: TableSelector,
      props: (opts: FieldProps = {} as FieldProps) => {
        const field = opts.field
        return {
          isTrigger,
          disabled: field.readonly,
        }
      },
    },
    [SchemaFieldTypes.FILTER]: {
      comp: FilterSelector,
      props: (opts: FieldProps = {} as FieldProps) => {
        const { key } = opts
        return {
          key,
        }
      },
      onChange: (e: CustomEvent<FormUpdate>) => {
        const update = e.detail
        if (block) {
          automationStore.actions.requestUpdate(update, block)
        }
      },
    },
    [SchemaFieldTypes.COLUMN]: {
      comp: Select,
      props: (opts: FieldProps = {} as FieldProps) => {
        const field = opts.field
        return {
          options: Object.keys(table?.schema || {}),
          disabled: field.readonly,
        }
      },
    },
    [SchemaFieldTypes.CODE_V2]: {
      comp: ExecuteScriptV2,
      fullWidth: true,
    },
    [SchemaFieldTypes.LONGFORM]: {
      comp: DrawerBindableInput,
      props: (opts: FieldProps = {} as FieldProps) => {
        const { key, field } = opts
        return {
          title: field.title ?? getFieldLabel(key, field),
          panel: AutomationBindingPanel,
          type: field.customType,
          updateOnChange: false,
          multiline: true,
          placeholder: field?.description,
        }
      },
    },
    [SchemaFieldTypes.BOOL]: {
      comp: Checkbox,
    },
    [SchemaFieldTypes.DATE]: {
      comp: DateSelector,
      props: (opts: FieldProps = {} as FieldProps) => {
        const { field, key } = opts
        return {
          title: field.title ?? getFieldLabel(key, field),
          disabled: field.readonly,
        }
      },
    },
    [SchemaFieldTypes.TRIGGER_SCHEMA]: {
      comp: SchemaSetup,
      fullWidth: true,
    },
    [SchemaFieldTypes.JSON]: {
      comp: Editor,
      props: (opts: FieldProps = {} as FieldProps) => {
        const { field, value: editorBody } = opts
        return {
          value: editorBody?.value,
          editorHeight: "250",
          editorWidth: "448",
          mode: "json",
          readOnly: field.readonly,
        }
      },
    },
    [SchemaFieldTypes.FILE]: {
      comp: FileSelector,
      props: (opts: FieldProps = {} as FieldProps) => {
        const { field } = opts
        const meta = getInputValue(inputData, "meta") as FileSelectorMeta
        return {
          buttonText:
            field.type === "attachment" ? "Add attachment" : "Add signature",
          useAttachmentBinding: meta?.useAttachmentBinding,
        }
      },
      onChange: (e: CustomEvent<FormUpdate>) => {
        const update = e.detail
        if (block) {
          automationStore.actions.requestUpdate(update, block)
        }
      },
      fullWidth: true,
    },
    [SchemaFieldTypes.CRON]: {
      comp: CronBuilder,
      props: (opts: FieldProps = {} as FieldProps) => {
        const { value } = opts
        return {
          cronExpression: value,
        }
      },
    },
    [SchemaFieldTypes.LOOP_OPTION]: {
      comp: Select,
      props: () => {
        return {
          autoWidth: true,
          options: ["Array", "String"],
          defaultValue: "Array",
        }
      },
    },
    [SchemaFieldTypes.AUTOMATION_FIELDS]: {
      comp: AutomationSelector,
      props: (opts: FieldProps = {} as FieldProps) => {
        const { field } = opts
        return {
          title: field.title,
        }
      },
      fullWidth: true,
      wrapped: false,
    },
    [SchemaFieldTypes.WEBHOOK_URL]: {
      comp: WebhookDisplay,
    },
    [SchemaFieldTypes.QUERY_PARAMS]: {
      comp: QueryParamSelector,
      fullWidth: true,
      title: "Query*",
    },
    [SchemaFieldTypes.CODE]: {
      comp: ExecuteScript,
      fullWidth: true,
    },
    [SchemaFieldTypes.STRING]: {
      comp: DrawerBindableInput,
      props: (opts: FieldProps = {} as FieldProps) => {
        const { key, field } = opts
        return {
          title: field.title ?? getFieldLabel(key, field),
          panel: AutomationBindingPanel,
          type: field.customType,
          updateOnChange: false,
        }
      },
    },
    [SchemaFieldTypes.QUERY_LIMIT]: {
      comp: DrawerBindableInput,
      props: (opts: FieldProps = {} as FieldProps) => {
        const { key, field } = opts
        return {
          title: field.title ?? getFieldLabel(key, field),
          panel: AutomationBindingPanel,
          type: field.customType,
          updateOnChange: false,
          placeholder: queryLimit,
        }
      },
    },
    // Not a core schema type.
    [SchemaFieldTypes.FIELDS]: {
      comp: FieldSelector,
      props: () => {
        return {
          isTestModal: false,
        }
      },
      fullWidth: true,
    },
    [SchemaFieldTypes.CATEGORIES]: {
      comp: CategorySelector,
      fullWidth: true,
    },
  }

  $: isTrigger = block?.type === AutomationStepType.TRIGGER

  // The step input properties
  $: inputData = automationStore.actions.getInputData(block)

  // Automation definition properties
  $: schemaProperties = Object.entries(block?.schema?.inputs?.properties || {})

  // Used for field labelling
  $: requiredProperties = block ? block.schema["inputs"].required : []

  $: tableId = inputData && "tableId" in inputData ? inputData.tableId : null
  $: table = tableId
    ? $tables.list.find(table => table._id === tableId)
    : { schema: {} }

  $: queryLimit = tableId?.includes("datasource") ? "∞" : "1000"

  const canShowField = (value: BaseIOStructure, inputData?: StepInputs) => {
    if (!inputData) {
      console.error("Cannot determine field visibility without field data")
      return false
    }
    const dependsOn = value?.dependsOn
    return !dependsOn || !!getInputValue(inputData, dependsOn)
  }

  const defaultChange = (
    update: FormUpdate,
    block?: AutomationTrigger | AutomationStep
  ) => {
    if (block) {
      automationStore.actions.requestUpdate(update, block)
    }
  }

  /**
   *
   * Build the core props used to page the Automation Schema field.
   *
   * @param key
   * @param field
   * @param block
   */
  const schemaToUI = (
    key: string,
    field: BaseIOStructure,
    block?: AutomationStep | AutomationTrigger
  ) => {
    if (!block) {
      console.error("Could not process UI elements.")
      return {}
    }
    const type = getFieldType(field, block)
    const config = type ? SchemaTypes[type] : null
    const title =
      config?.title ||
      getFieldLabel(key, field, requiredProperties?.includes(key))
    const value = getInputValue(inputData, key)
    const meta = getInputValue(inputData, "meta")

    return {
      meta,
      config,
      value,
      title,
      props: config?.props
        ? config.props({ key, field, block, value, meta, title })
        : {},
    }
  }

  /**
   * Determine the correct UI element based on the automation
   * schema configuration.
   *
   * @param field
   * @param block
   */
  const getFieldType = (
    field: BaseIOStructure,
    block: AutomationStep | AutomationTrigger
  ) => {
    // Direct customType map
    const customType = field.customType && customTypeToSchema[field.customType]
    if (customType) {
      return customType
    }

    // Direct type map
    const fieldType = field.type && typeToSchema[field.type]
    if (fieldType) {
      return fieldType
    }

    // Enum Field
    if (field.type === AutomationIOType.STRING && field.enum) {
      return SchemaFieldTypes.ENUM
    }

    // JS V2
    if (
      field.customType === AutomationCustomIOType.CODE &&
      block?.stepId === AutomationActionStepId.EXECUTE_SCRIPT_V2
    ) {
      return SchemaFieldTypes.CODE_V2
    }

    // Filter step or trigger
    if (
      field.customType === AutomationCustomIOType.FILTERS ||
      field.customType === AutomationCustomIOType.TRIGGER_FILTER
    ) {
      return SchemaFieldTypes.FILTER
    }

    // Default string/number UX
    if (
      field.type === AutomationIOType.STRING ||
      field.type === AutomationIOType.NUMBER
    ) {
      // "integer" removed as it isnt present in the type
      return SchemaFieldTypes.STRING
    }
  }
</script>

{#each schemaProperties as [key, field]}
  {#if canShowField(field, inputData)}
    {@const { config, props, value, title } = schemaToUI(key, field, block)}
    {#if config}
      {#if config.wrapped === false}
        <svelte:component
          this={config.comp}
          {bindings}
          {block}
          {context}
          {key}
          {...{ value, ...props }}
          on:change={config.onChange ??
            (e => {
              defaultChange({ [key]: e.detail }, block)
            })}
        />
      {:else}
        <PropField label={title} fullWidth labelTooltip={config.tooltip || ""}>
          <svelte:component
            this={config.comp}
            {bindings}
            {block}
            {context}
            {key}
            {...{ value, ...props }}
            on:change={config.onChange ??
              (e => {
                defaultChange({ [key]: e.detail }, block)
              })}
          />
        </PropField>
      {/if}
    {/if}
  {/if}
{/each}
