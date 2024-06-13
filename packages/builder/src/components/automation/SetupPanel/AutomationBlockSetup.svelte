<script>
  import TableSelector from "./TableSelector.svelte"
  import FieldSelector from "./FieldSelector.svelte"
  import SchemaSetup from "./SchemaSetup.svelte"
  import {
    Button,
    Select,
    Label,
    ActionButton,
    Drawer,
    Modal,
    notifications,
    Checkbox,
    DatePicker,
    DrawerContent,
    Helpers,
  } from "@budibase/bbui"
  import CreateWebhookModal from "components/automation/Shared/CreateWebhookModal.svelte"
  import { automationStore, selectedAutomation, tables } from "stores/builder"
  import { environment, licensing } from "stores/portal"
  import WebhookDisplay from "../Shared/WebhookDisplay.svelte"
  import {
    BindingSidePanel,
    DrawerBindableSlot,
    DrawerBindableInput,
    ServerBindingPanel as AutomationBindingPanel,
    ModalBindableInput,
  } from "components/common/bindings"
  import CodeEditorModal from "./CodeEditorModal.svelte"
  import QueryParamSelector from "./QueryParamSelector.svelte"
  import AutomationSelector from "./AutomationSelector.svelte"
  import CronBuilder from "./CronBuilder.svelte"
  import Editor from "components/integration/QueryEditor.svelte"
  import CodeEditor from "components/common/CodeEditor/CodeEditor.svelte"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import { BindingHelpers, BindingType } from "components/common/bindings/utils"
  import {
    bindingsToCompletions,
    hbAutocomplete,
    EditorModes,
  } from "components/common/CodeEditor"
  import FilterBuilder from "components/design/settings/controls/FilterEditor/FilterBuilder.svelte"
  import { LuceneUtils, Utils, memo } from "@budibase/frontend-core"
  import {
    getSchemaForDatasourcePlus,
    getEnvironmentBindings,
  } from "dataBinding"
  import { TriggerStepID, ActionStepID } from "constants/backend/automations"
  import { onMount } from "svelte"
  import { cloneDeep } from "lodash/fp"
  import { AutomationEventType } from "@budibase/types"
  import { FIELDS } from "constants/backend"
  import PropField from "./PropField.svelte"

  export let block
  export let testData
  export let schemaProperties
  export let isTestModal = false

  // Stop unnecessary rendering
  const memoBlock = memo(block)

  const rowTriggers = [
    TriggerStepID.ROW_UPDATED,
    TriggerStepID.ROW_SAVED,
    TriggerStepID.ROW_DELETED,
  ]
  const rowSteps = [ActionStepID.UPDATE_ROW, ActionStepID.CREATE_ROW]

  let webhookModal
  let drawer
  let inputData
  let insertAtPos, getCaretPosition
  let stepLayouts = {}

  $: memoBlock.set(block)
  $: filters = lookForFilters(schemaProperties) || []
  $: tempFilters = filters
  $: stepId = block.stepId
  $: bindings = getAvailableBindings(block, $selectedAutomation?.definition)
  $: getInputData(testData, $memoBlock.inputs)
  $: tableId = inputData ? inputData.tableId : null
  $: table = tableId
    ? $tables.list.find(table => table._id === inputData.tableId)
    : { schema: {} }
  $: schema = getSchemaForDatasourcePlus(tableId, {
    searchableSchema: true,
  }).schema
  $: schemaFields = Object.values(schema || {})
  $: queryLimit = tableId?.includes("datasource") ? "∞" : "1000"
  $: isTrigger = block?.type === "TRIGGER"
  $: codeMode =
    stepId === "EXECUTE_BASH" ? EditorModes.Handlebars : EditorModes.JS
  $: bindingsHelpers = new BindingHelpers(getCaretPosition, insertAtPos, {
    disableWrapping: true,
  })
  $: editingJs = codeMode === EditorModes.JS
  $: requiredProperties =
    block.schema[isTestModal ? "outputs" : "inputs"].required || []

  $: stepCompletions =
    codeMode === EditorModes.Handlebars
      ? [hbAutocomplete([...bindingsToCompletions(bindings, codeMode)])]
      : []

  const getInputData = (testData, blockInputs) => {
    // Test data is not cloned for reactivity
    let newInputData = testData || cloneDeep(blockInputs)

    // Ensures the app action fields are populated
    if (
      block.event === AutomationEventType.APP_TRIGGER &&
      !newInputData?.fields
    ) {
      newInputData = cloneDeep(blockInputs)
    }
    inputData = newInputData
    setDefaultEnumValues()
  }

  const setDefaultEnumValues = () => {
    for (const [key, value] of schemaProperties) {
      if (value.type === "string" && value.enum && inputData[key] == null) {
        inputData[key] = value.enum[0]
      }
    }
  }

  $: customStepLayouts($memoBlock, schemaProperties)

  const customStepLayouts = block => {
    if (
      rowSteps.includes(block.stepId) ||
      (rowTriggers.includes(block.stepId) && isTestModal)
    ) {
      const schema = schemaProperties.reduce((acc, entry) => {
        const [key, val] = entry
        acc[key] = val
        return acc
      }, {})

      // Optionally build the rev field config when its needed.
      const getRevConfig = () => {
        const rowRevEntry = schema["revision"]
        if (!rowRevEntry) {
          return []
        }
        const rowRevlabel = getFieldLabel("revision", rowRevEntry)

        return isTestModal
          ? [
              {
                type: DrawerBindableInput,
                title: rowRevlabel,
                panel: AutomationBindingPanel,
                value: inputData["revision"],
                onChange: e => {
                  onChange({ ["revision"]: e.detail })
                },
                bindings,
                updateOnChange: false,
                forceModal: true,
              },
            ]
          : []
      }

      const getIdConfig = () => {
        const rowIdentifier = isTestModal ? "id" : "rowId"

        const rowIdEntry = schema[rowIdentifier]
        if (!rowIdEntry) {
          return []
        }

        const rowIdlabel = getFieldLabel(rowIdentifier, rowIdEntry)

        return [
          {
            type: DrawerBindableInput,
            title: rowIdlabel,
            props: {
              panel: AutomationBindingPanel,
              value: inputData[rowIdentifier],
              onChange: e => {
                onChange({ [rowIdentifier]: e.detail })
              },
              bindings,
              updateOnChange: false,
              forceModal: true,
            },
          },
        ]
      }

      stepLayouts[block.stepId] = {
        row: {
          schema: schema["row"],
          //?layout: RowLayoutStepComponent.
          content: [
            {
              type: TableSelector,
              title: "Table",
              props: {
                isTrigger,
                value: inputData["row"]?.tableId ?? "",
                onChange: e => {
                  onChange({
                    _tableId: e.detail,
                    meta: {},
                    ["row"]: {
                      tableId: e.detail,
                    },
                  })
                },
                disabled: isTestModal,
              },
            },
            ...getIdConfig(),
            ...getRevConfig(),
            {
              type: Divider,
              props: {
                noMargin: true,
              },
            },
            {
              type: RowSelector,
              props: {
                row: inputData["row"],
                meta: inputData["meta"] || {},
                onChange: e => {
                  onChange(e.detail)
                },
                bindings,
                isTestModal,
                isUpdateRow: block.stepId === ActionStepID.UPDATE_ROW,
              },
            },
          ],
        },
      }
    }
  }

  const onChange = Utils.sequential(async update => {
    // We need to cache the schema as part of the definition because it is
    // used in the server to detect relationships. It would be far better to
    // instead fetch the schema in the backend at runtime.
    const request = cloneDeep(update)

    let schema
    if (request?._tableId) {
      schema = getSchemaForDatasourcePlus(request._tableId, {
        searchableSchema: true,
      }).schema
      delete request._tableId
    }

    try {
      if (isTestModal) {
        let newTestData = { schema }

        // Special case for webhook, as it requires a body, but the schema already brings back the body's contents
        if (stepId === TriggerStepID.WEBHOOK) {
          newTestData = {
            ...newTestData,
            body: {
              ...update,
              ...$selectedAutomation.testData?.body,
            },
          }
        }
        newTestData = {
          ...newTestData,
          ...request,
        }
        await automationStore.actions.addTestDataToAutomation(newTestData)
      } else {
        const data = { schema, ...request }
        await automationStore.actions.updateBlockInputs(block, data)
      }
    } catch (error) {
      console.error("Error saving automation", error)
      notifications.error("Error saving automation")
    }
  })

  function getAvailableBindings(block, automation) {
    if (!block || !automation) {
      return []
    }

    // Find previous steps to the selected one
    let allSteps = [...automation.steps]

    if (automation.trigger) {
      allSteps = [automation.trigger, ...allSteps]
    }
    let blockIdx = allSteps.findIndex(step => step.id === block.id)

    // Extract all outputs from all previous steps as available bindingsx§x
    let bindings = []
    let loopBlockCount = 0
    const addBinding = (name, value, icon, idx, isLoopBlock, bindingName) => {
      if (!name) return
      const runtimeBinding = determineRuntimeBinding(name, idx, isLoopBlock)
      const categoryName = determineCategoryName(idx, isLoopBlock, bindingName)

      bindings.push(
        createBindingObject(
          name,
          value,
          icon,
          idx,
          loopBlockCount,
          isLoopBlock,
          runtimeBinding,
          categoryName,
          bindingName
        )
      )
    }

    const determineRuntimeBinding = (name, idx, isLoopBlock) => {
      let runtimeName

      /* Begin special cases for generating custom schemas based on triggers */
      if (
        idx === 0 &&
        automation.trigger?.event === AutomationEventType.APP_TRIGGER
      ) {
        return `trigger.fields.${name}`
      }

      if (
        idx === 0 &&
        (automation.trigger?.event === AutomationEventType.ROW_UPDATE ||
          automation.trigger?.event === AutomationEventType.ROW_SAVE)
      ) {
        if (name !== "id" && name !== "revision") return `trigger.row.${name}`
      }
      /* End special cases for generating custom schemas based on triggers */

      if (isLoopBlock) {
        runtimeName = `loop.${name}`
      } else if (block.name.startsWith("JS")) {
        runtimeName = `steps[${idx - loopBlockCount}].${name}`
      } else {
        runtimeName = `steps.${idx - loopBlockCount}.${name}`
      }
      return idx === 0 ? `trigger.${name}` : runtimeName
    }

    const determineCategoryName = (idx, isLoopBlock, bindingName) => {
      if (idx === 0) return "Trigger outputs"
      if (isLoopBlock) return "Loop Outputs"
      return bindingName
        ? `${bindingName} outputs`
        : `Step ${idx - loopBlockCount} outputs`
    }

    const createBindingObject = (
      name,
      value,
      icon,
      idx,
      loopBlockCount,
      isLoopBlock,
      runtimeBinding,
      categoryName,
      bindingName
    ) => {
      const field = Object.values(FIELDS).find(
        field => field.type === value.type && field.subtype === value.subtype
      )

      return {
        readableBinding: bindingName
          ? `${bindingName}.${name}`
          : runtimeBinding,
        runtimeBinding,
        type: value.type,
        description: value.description,
        icon,
        category: categoryName,
        display: {
          type: field?.name || value.type,
          name,
          rank: isLoopBlock ? idx + 1 : idx - loopBlockCount,
        },
      }
    }

    for (let idx = 0; idx < blockIdx; idx++) {
      let wasLoopBlock = allSteps[idx - 1]?.stepId === ActionStepID.LOOP
      let isLoopBlock =
        allSteps[idx]?.stepId === ActionStepID.LOOP &&
        allSteps.some(x => x.blockToLoop === block.id)
      let schema = cloneDeep(allSteps[idx]?.schema?.outputs?.properties) ?? {}
      let bindingName =
        automation.stepNames?.[allSteps[idx - loopBlockCount].id]

      if (isLoopBlock) {
        schema = {
          currentItem: {
            type: "string",
            description: "the item currently being executed",
          },
        }
      }

      if (
        idx === 0 &&
        automation.trigger?.event === AutomationEventType.APP_TRIGGER
      ) {
        schema = Object.fromEntries(
          Object.keys(automation.trigger.inputs.fields || []).map(key => [
            key,
            { type: automation.trigger.inputs.fields[key] },
          ])
        )
      }
      if (
        (idx === 0 &&
          automation.trigger.event === AutomationEventType.ROW_UPDATE) ||
        (idx === 0 && automation.trigger.event === AutomationEventType.ROW_SAVE)
      ) {
        let table = $tables.list.find(
          table => table._id === automation.trigger.inputs.tableId
        )
        // We want to generate our own schema for the bindings from the table schema itself
        for (const key in table?.schema) {
          schema[key] = {
            type: table.schema[key].type,
            subtype: table.schema[key].subtype,
          }
        }
        // remove the original binding
        delete schema.row
      }
      let icon =
        idx === 0
          ? automation.trigger.icon
          : isLoopBlock
          ? "Reuse"
          : allSteps[idx].icon

      if (wasLoopBlock) {
        loopBlockCount++
        continue
      }
      Object.entries(schema).forEach(([name, value]) =>
        addBinding(name, value, icon, idx, isLoopBlock, bindingName)
      )
    }

    // Environment bindings
    if ($licensing.environmentVariablesEnabled) {
      bindings = bindings.concat(
        getEnvironmentBindings().map(binding => {
          return {
            ...binding,
            display: {
              ...binding.display,
              rank: 98,
            },
          }
        })
      )
    }
    return bindings
  }
  function lookForFilters(properties) {
    if (!properties) {
      return []
    }
    let filters
    const inputs = testData ? testData : block.inputs
    for (let [key, field] of properties) {
      // need to look for the builder definition (keyed separately, see saveFilters)
      const defKey = `${key}-def`
      if (field.customType === "filters" && inputs?.[defKey]) {
        filters = inputs[defKey]
        break
      }
    }
    return filters || []
  }

  function saveFilters(key) {
    const filters = LuceneUtils.buildLuceneQuery(tempFilters)

    onChange({
      [key]: filters,
      [`${key}-def`]: tempFilters, // need to store the builder definition in the automation
    })

    drawer.hide()
  }

  function canShowField(key, value) {
    const dependsOn = value?.dependsOn
    return !dependsOn || !!inputData[dependsOn]
  }

  function shouldRenderField(value) {
    return (
      value.customType !== "row" &&
      value.customType !== "code" &&
      value.customType !== "queryParams" &&
      value.customType !== "cron" &&
      value.customType !== "triggerSchema" &&
      value.customType !== "automationFields" &&
      value.customType !== "fields" &&
      value.type !== "signature_single" &&
      value.type !== "attachment" &&
      value.type !== "attachment_single"
    )
  }

  function getFieldLabel(key, value) {
    const requiredSuffix = requiredProperties.includes(key) ? "*" : ""
    const label = `${
      value.title || (key === "row" ? "Table" : key)
    } ${requiredSuffix}`
    return Helpers.capitalise(label)
  }

  function handleAttachmentParams(keyValueObj) {
    let params = {}
    if (keyValueObj?.length) {
      for (let param of keyValueObj) {
        params[param.url] = param.filename
      }
    }
    return params
  }

  onMount(async () => {
    try {
      await environment.loadVariables()
    } catch (error) {
      console.error(error)
    }
  })
</script>

<div class="step-fields">
  <!-- Custom Layouts -->
  {#if stepLayouts[block.stepId]}
    {#each Object.keys(stepLayouts[block.stepId] || {}) as key}
      {#if canShowField(key, stepLayouts[block.stepId].schema)}
        {#each stepLayouts[block.stepId][key].content as config}
          {#if config.title}
            <PropField label={config.title}>
              <svelte:component
                this={config.type}
                {...config.props}
                on:change={config.props.onChange}
              />
            </PropField>
          {:else}
            <svelte:component
              this={config.type}
              {...config.props}
              on:change={config.props.onChange}
            />
          {/if}
        {/each}
      {/if}
    {/each}
  {:else}
    <!-- Default Schema Property Layout -->
    {#each schemaProperties as [key, value]}
      {#if canShowField(key, value)}
        {@const label = getFieldLabel(key, value)}
        <div class:block-field={shouldRenderField(value)}>
          {#if key !== "fields" && value.type !== "boolean" && shouldRenderField(value)}
            <Label
              tooltip={value.title === "Binding / Value"
                ? "If using the String input type, please use a comma or newline separated string"
                : null}
            >
              {label}
            </Label>
          {/if}
          <div class:field-width={shouldRenderField(value)}>
            {#if value.type === "string" && value.enum && canShowField(key, value)}
              <Select
                on:change={e => onChange({ [key]: e.detail })}
                value={inputData[key]}
                placeholder={false}
                options={value.enum}
                getOptionLabel={(x, idx) =>
                  value.pretty ? value.pretty[idx] : x}
              />
            {:else if value.type === "json"}
              <Editor
                editorHeight="250"
                editorWidth="448"
                mode="json"
                value={inputData[key]?.value}
                on:change={e => onChange({ [key]: e.detail })}
              />
            {:else if value.type === "boolean"}
              <div style="margin-top: 10px">
                <Checkbox
                  text={value.title}
                  value={inputData[key]}
                  on:change={e => onChange({ [key]: e.detail })}
                />
              </div>
            {:else if value.type === "date"}
              <DrawerBindableSlot
                title={value.title ?? label}
                panel={AutomationBindingPanel}
                type={"date"}
                value={inputData[key]}
                on:change={e => onChange({ [key]: e.detail })}
                {bindings}
                allowJS={true}
                updateOnChange={false}
                drawerLeft="260px"
              >
                <DatePicker
                  value={inputData[key]}
                  on:change={e => onChange({ [key]: e.detail })}
                />
              </DrawerBindableSlot>
            {:else if value.customType === "column"}
              <Select
                on:change={e => onChange({ [key]: e.detail })}
                value={inputData[key]}
                options={Object.keys(table?.schema || {})}
              />
            {:else if value.type === "attachment" || value.type === "signature_single"}
              <div class="attachment-field-wrapper">
                <div class="label-wrapper">
                  <Label>{label}</Label>
                </div>
                <div class="attachment-field-width">
                  <KeyValueBuilder
                    on:change={e =>
                      onChange({
                        [key]: e.detail.map(({ name, value }) => ({
                          url: name,
                          filename: value,
                        })),
                      })}
                    object={handleAttachmentParams(inputData[key])}
                    allowJS
                    {bindings}
                    keyBindings
                    customButtonText={value.type === "attachment"
                      ? "Add attachment"
                      : "Add signature"}
                    keyPlaceholder={"URL"}
                    valuePlaceholder={"Filename"}
                  />
                </div>
              </div>
            {:else if value.customType === "filters"}
              <ActionButton on:click={drawer.show}>Define filters</ActionButton>
              <Drawer bind:this={drawer} title="Filtering">
                <Button cta slot="buttons" on:click={() => saveFilters(key)}>
                  Save
                </Button>
                <DrawerContent slot="body">
                  <FilterBuilder
                    {filters}
                    {bindings}
                    {schemaFields}
                    datasource={{ type: "table", tableId }}
                    panel={AutomationBindingPanel}
                    on:change={e => (tempFilters = e.detail)}
                  />
                </DrawerContent>
              </Drawer>
            {:else if value.customType === "cron"}
              <CronBuilder
                on:change={e => onChange({ [key]: e.detail })}
                value={inputData[key]}
              />
            {:else if value.customType === "automationFields"}
              <AutomationSelector
                on:change={e => onChange({ [key]: e.detail })}
                value={inputData[key]}
                {bindings}
              />
            {:else if value.customType === "queryParams"}
              <QueryParamSelector
                on:change={e => onChange({ [key]: e.detail })}
                value={inputData[key]}
                {bindings}
              />
            {:else if value.customType === "table"}
              <TableSelector
                {isTrigger}
                value={inputData[key]}
                on:change={e => onChange({ [key]: e.detail })}
              />
            {:else if value.customType === "webhookUrl"}
              <WebhookDisplay value={inputData[key]} />
            {:else if value.customType === "fields"}
              <FieldSelector
                {block}
                value={inputData[key]}
                on:change={e => onChange({ [key]: e.detail })}
                {bindings}
                {isTestModal}
              />
            {:else if value.customType === "triggerSchema"}
              <SchemaSetup
                on:change={e => onChange({ [key]: e.detail })}
                value={inputData[key]}
              />
            {:else if value.customType === "code"}
              <CodeEditorModal>
                <div class:js-editor={editingJs}>
                  <div
                    class:js-code={editingJs}
                    style="width:100%;height:500px;"
                  >
                    <CodeEditor
                      value={inputData[key]}
                      on:change={e => {
                        // need to pass without the value inside
                        onChange({ [key]: e.detail })
                        inputData[key] = e.detail
                      }}
                      completions={stepCompletions}
                      mode={codeMode}
                      autocompleteEnabled={codeMode !== EditorModes.JS}
                      bind:getCaretPosition
                      bind:insertAtPos
                      placeholder={codeMode === EditorModes.Handlebars
                        ? "Add bindings by typing {{"
                        : null}
                    />
                  </div>
                  {#if editingJs}
                    <div class="js-binding-picker">
                      <BindingSidePanel
                        {bindings}
                        allowHelpers={false}
                        addBinding={binding =>
                          bindingsHelpers.onSelectBinding(
                            inputData[key],
                            binding,
                            {
                              js: true,
                              dontDecode: true,
                              type: BindingType.RUNTIME,
                            }
                          )}
                        mode="javascript"
                      />
                    </div>
                  {/if}
                </div>
              </CodeEditorModal>
            {:else if value.customType === "loopOption"}
              <Select
                on:change={e => onChange({ [key]: e.detail })}
                autoWidth
                value={inputData[key]}
                options={["Array", "String"]}
                defaultValue={"Array"}
              />
            {:else if value.type === "string" || value.type === "number" || value.type === "integer"}
              {#if isTestModal}
                <ModalBindableInput
                  title={value.title || label}
                  value={inputData[key]}
                  panel={AutomationBindingPanel}
                  type={value.customType}
                  on:change={e => onChange({ [key]: e.detail })}
                  {bindings}
                  updateOnChange={false}
                />
              {:else}
                <div>
                  <DrawerBindableInput
                    title={value.title ?? label}
                    panel={AutomationBindingPanel}
                    type={value.customType}
                    value={inputData[key]}
                    on:change={e => onChange({ [key]: e.detail })}
                    {bindings}
                    updateOnChange={false}
                    placeholder={value.customType === "queryLimit"
                      ? queryLimit
                      : ""}
                    drawerLeft="260px"
                  />
                </div>
              {/if}
            {/if}
          </div>
        </div>
      {/if}
    {/each}
  {/if}
</div>

<Modal bind:this={webhookModal} width="30%">
  <CreateWebhookModal />
</Modal>

{#if stepId === TriggerStepID.WEBHOOK && !isTestModal}
  <Button secondary on:click={() => webhookModal.show()}>Set Up Webhook</Button>
{/if}

<style>
  .field-width {
    width: 320px;
  }

  .step-fields {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
  }

  .block-field {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .attachment-field-width {
    margin-top: var(--spacing-xs);
  }

  .label-wrapper {
    margin-top: var(--spacing-s);
  }

  .js-editor {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    width: 100%;
  }

  .js-code {
    flex: 7;
  }

  .js-binding-picker {
    flex: 3;
    margin-top: calc((var(--spacing-xl) * -1) + 1px);
  }
</style>
