<script>
  import TableSelector from "./TableSelector.svelte"
  import FieldSelector from "./FieldSelector.svelte"
  import SchemaSetup from "./SchemaSetup.svelte"
  import RowSelector from "./RowSelector.svelte"
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
    Toggle,
    Divider,
    Icon,
  } from "@budibase/bbui"

  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import { automationStore, tables } from "@/stores/builder"
  import { environment } from "@/stores/portal"
  import WebhookDisplay from "../Shared/WebhookDisplay.svelte"
  import {
    BindingSidePanel,
    DrawerBindableSlot,
    DrawerBindableInput,
    ServerBindingPanel as AutomationBindingPanel,
    ModalBindableInput,
  } from "@/components/common/bindings"
  import CodeEditorModal from "./CodeEditorModal.svelte"
  import QueryParamSelector from "./QueryParamSelector.svelte"
  import AutomationSelector from "./AutomationSelector.svelte"
  import CronBuilder from "./CronBuilder.svelte"
  import Editor from "@/components/integration/QueryEditor.svelte"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import {
    BindingHelpers,
    BindingType,
  } from "@/components/common/bindings/utils"
  import {
    bindingsToCompletions,
    hbAutocomplete,
    EditorModes,
  } from "@/components/common/CodeEditor"
  import FilterBuilder from "@/components/design/settings/controls/FilterEditor/FilterBuilder.svelte"
  import { QueryUtils, Utils, search, memo } from "@budibase/frontend-core"
  import { getSchemaForDatasourcePlus } from "@/dataBinding"
  import { TriggerStepID, ActionStepID } from "@/constants/backend/automations"
  import { onMount, createEventDispatcher } from "svelte"
  import { writable } from "svelte/store"
  import { cloneDeep } from "lodash/fp"
  import {
    AutomationEventType,
    AutomationStepType,
    AutomationActionStepId,
    AutomationCustomIOType,
  } from "@budibase/types"
  import PropField from "./PropField.svelte"
  import { utils } from "@budibase/shared-core"

  export let automation
  export let block
  export let testData
  export let schemaProperties
  export let isTestModal = false
  export let bindings = []

  const dispatch = createEventDispatcher()

  // Stop unnecessary rendering
  const memoBlock = memo(block)

  const rowTriggers = [
    TriggerStepID.ROW_UPDATED,
    TriggerStepID.ROW_SAVED,
    TriggerStepID.ROW_DELETED,
    TriggerStepID.ROW_ACTION,
  ]

  const rowEvents = [
    AutomationEventType.ROW_DELETE,
    AutomationEventType.ROW_SAVE,
    AutomationEventType.ROW_UPDATE,
  ]

  const rowSteps = [ActionStepID.UPDATE_ROW, ActionStepID.CREATE_ROW]

  let webhookModal
  let drawer
  let inputData
  let insertAtPos, getCaretPosition
  let stepLayouts = {}

  $: memoBlock.set(block)

  $: filters = lookForFilters(schemaProperties)
  $: filterCount =
    filters?.groups?.reduce((acc, group) => {
      acc = acc += group?.filters?.length || 0
      return acc
    }, 0) || 0

  $: tempFilters = cloneDeep(filters)
  $: stepId = $memoBlock.stepId

  $: getInputData(testData, $memoBlock.inputs)
  $: tableId = inputData ? inputData.tableId : null
  $: table = tableId
    ? $tables.list.find(table => table._id === inputData.tableId)
    : { schema: {} }
  $: schema = getSchemaForDatasourcePlus(tableId, {
    searchableSchema: true,
  }).schema
  $: schemaFields = search.getFields(
    $tables.list,
    Object.values(schema || {}),
    { allowLinks: false }
  )
  $: queryLimit = tableId?.includes("datasource") ? "∞" : "1000"
  $: isTrigger = $memoBlock?.type === AutomationStepType.TRIGGER
  $: codeMode =
    stepId === AutomationActionStepId.EXECUTE_BASH
      ? EditorModes.Handlebars
      : EditorModes.JS
  $: bindingsHelpers = new BindingHelpers(getCaretPosition, insertAtPos, {
    disableWrapping: true,
  })
  $: editingJs = codeMode === EditorModes.JS
  $: requiredProperties = isTestModal
    ? []
    : $memoBlock.schema["inputs"].required

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

  // Store for any UX related data
  const stepStore = writable({})
  $: stepState = $stepStore?.[block.id]

  $: customStepLayouts($memoBlock, schemaProperties, stepState)

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
                props: {
                  panel: AutomationBindingPanel,
                  value: inputData["revision"],
                  onChange: e => {
                    onChange({ ["revision"]: e.detail })
                  },
                  updateOnChange: false,
                  forceModal: true,
                },
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
              updateOnChange: false,
              forceModal: true,
            },
          },
        ]
      }

      // A select to switch from `row` to `oldRow`
      const getRowTypeConfig = () => {
        if (!isTestModal || block.event !== AutomationEventType.ROW_UPDATE) {
          return []
        }

        if (!$stepStore?.[block.id]) {
          stepStore.update(state => ({
            ...state,
            [block.id]: {
              rowType: "row",
            },
          }))
        }

        return [
          {
            type: Select,
            tooltip: `You can configure test data for both the updated row and 
              the old row, if you need it. Just select the one you wish to alter`,
            title: "Row data",
            props: {
              value: $stepStore?.[block.id].rowType,
              onChange: e => {
                stepStore.update(state => ({
                  ...state,
                  [block.id]: {
                    rowType: e.detail,
                  },
                }))
              },
              placeholder: false,
              getOptionLabel: type => type.name,
              getOptionValue: type => type.id,
              options: [
                {
                  id: "row",
                  name: "Updated row",
                },
                { id: "oldRow", name: "Old row" },
              ],
            },
          },
        ]
      }

      const getRowSelector = () => {
        const baseProps = {
          bindings,
          isTestModal,
          isUpdateRow: block.stepId === ActionStepID.UPDATE_ROW,
        }

        if (isTestModal && stepState?.rowType === "oldRow") {
          return [
            {
              type: RowSelector,
              props: {
                row: inputData["oldRow"] || {
                  tableId: inputData["row"].tableId,
                },
                meta: {
                  fields: inputData["meta"]?.oldFields || {},
                },
                onChange: e => {
                  onChange({
                    oldRow: e.detail.row,
                    meta: {
                      fields: inputData["meta"]?.fields || {},
                      oldFields: e.detail?.meta?.fields || {},
                    },
                  })
                },
                ...baseProps,
              },
            },
          ]
        }

        return [
          {
            type: RowSelector,
            props: {
              row: inputData["row"],
              meta: inputData["meta"] || {},
              onChange: e => {
                onChange({
                  row: e.detail.row,
                  meta: {
                    fields: e.detail?.meta?.fields || {},
                    ...(isTestModal
                      ? { oldFields: inputData["meta"]?.oldFields || {} }
                      : {}),
                  },
                })
              },
              ...baseProps,
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
                  const rowKey = $stepStore?.[block.id]?.rowType || "row"
                  onChange({
                    _tableId: e.detail,
                    meta: {},
                    [rowKey]: e.detail
                      ? {
                          tableId: e.detail,
                        }
                      : {},
                  })
                },
                disabled: isTestModal,
              },
            },
            ...getIdConfig(),
            ...getRevConfig(),
            ...getRowTypeConfig(),
            {
              type: Divider,
              props: {
                noMargin: true,
              },
            },
            ...getRowSelector(),
          ],
        },
      }
    }
  }

  /**
   * Handler for row trigger automation updates.
   * @param {object} update - An automation block.inputs update object
   * @param {string} [update.tableId] - The ID of the table
   * @param {object} [update.filters] - Filter configuration for the row trigger
   * @param {object} [update.filters-def] - Filter definitions for the row trigger
   * @example
   * // Example with tableId
   * onRowTriggerUpdate({
   *   "tableId" : "ta_bb_employee"
   * })
   * @example
   * // Example with filters
   * onRowTriggerUpdate({
   *   filters: {
   *     equal: { "1:Approved": "true" }
   *   },
   *   "filters-def": [{
   *     id: "oH1T4S49n",
   *     field: "1:Approved",
   *     operator: "equal",
   *     value: "true",
   *     valueType: "Value",
   *     type: "string"
   *   }]
   * })
   */
  const onRowTriggerUpdate = async update => {
    if (
      ["tableId", AutomationCustomIOType.FILTERS, "meta"].some(key =>
        Object.hasOwn(update, key)
      )
    ) {
      try {
        let updatedAutomation

        if (
          Object.hasOwn(update, "tableId") &&
          automation.testData?.row?.tableId !== update.tableId
        ) {
          const reqSchema = getSchemaForDatasourcePlus(update.tableId, {
            searchableSchema: true,
          }).schema

          updatedAutomation = await automationStore.actions.processBlockInputs(
            block,
            {
              schema: reqSchema,
              ...update,
            }
          )

          // Reset testData when tableId changes
          updatedAutomation = {
            ...updatedAutomation,
            testData: {
              row: { tableId: update.tableId },
              oldRow: { tableId: update.tableId },
              meta: {},
              id: "",
              revision: "",
            },
          }
        } else {
          // For filters update, just process block inputs without resetting testData
          updatedAutomation = await automationStore.actions.processBlockInputs(
            block,
            update
          )
        }

        await automationStore.actions.save(updatedAutomation)

        return
      } catch (e) {
        console.error("Error saving automation", e)
        notifications.error("Error saving automation")
      }
    }
  }
  /**
   * Handler for App trigger automation updates.
   * Ensure updates to the field list are reflected in testData
    @param {object} update - An app trigger update object
    @example
    onAppTriggerUpdate({ 
      "fields" : {"myField": "123", "myArray": "cat,dog,badger"}
    })
   */
  const onAppTriggerUpdate = async update => {
    try {
      // Parse the block inputs as usual
      const updatedAutomation =
        await automationStore.actions.processBlockInputs(block, {
          schema: {},
          ...update,
        })

      // Exclude default or invalid data from the test data
      let updatedFields = {}
      for (const key of Object.keys(block?.inputs?.fields || {})) {
        if (Object.hasOwn(update.fields, key)) {
          if (key !== "") {
            updatedFields[key] = updatedAutomation.testData?.fields?.[key]
          }
        }
      }

      // Save the entire automation and reset the testData
      await automationStore.actions.save({
        ...updatedAutomation,
        testData: {
          fields: updatedFields,
        },
      })
    } catch (e) {
      console.error("Error saving automation", e)
      notifications.error("Error saving automation")
    }
  }

  /**
   * Handler for automation block input updates.
    @param {object} update - An automation inputs update object
    @example
    onChange({ 
      meta: { fields : { "Photo": { useAttachmentBinding: false }} }
      row: { "Active": true, "Order Id" : 14, ... }
    })
   */
  const onChange = Utils.sequential(async update => {
    const request = cloneDeep(update)
    // Process app trigger updates
    if (isTrigger && !isTestModal) {
      // Row trigger
      if (rowEvents.includes(block.event)) {
        await onRowTriggerUpdate(request)
        return
      }
      // App trigger
      if (block.event === AutomationEventType.APP_TRIGGER) {
        await onAppTriggerUpdate(request)
        return
      }
    }

    // We need to cache the schema as part of the definition because it is
    // used in the server to detect relationships. It would be far better to
    // instead fetch the schema in the backend at runtime.
    // If _tableId is explicitly included in the update request, the schema will be requested
    let schema
    if (request?._tableId) {
      schema = getSchemaForDatasourcePlus(request._tableId, {
        searchableSchema: true,
      }).schema
      delete request._tableId
    }
    try {
      if (isTestModal) {
        // Be sure to merge in the testData prop data, as it can contain custom
        // default data
        let newTestData = { schema, ...testData }

        // Special case for webhook, as it requires a body, but the schema already brings back the body's contents
        if (stepId === TriggerStepID.WEBHOOK) {
          newTestData = {
            ...newTestData,
            body: {
              ...update,
              ...automation.testData?.body,
            },
          }
        }
        newTestData = {
          ...newTestData,
          ...request,
        }

        const updatedAuto =
          automationStore.actions.addTestDataToAutomation(newTestData)

        // Ensure the test request has the latest info.
        dispatch("update", updatedAuto)

        await automationStore.actions.save(updatedAuto)
      } else {
        const data = { schema, ...request }
        await automationStore.actions.updateBlockInputs(block, data)
      }
    } catch (error) {
      console.error("Error saving automation", error)
      notifications.error("Error saving automation")
    }
  })

  function lookForFilters(properties) {
    if (!properties) {
      return []
    }
    let filters
    const inputs = testData ? testData : block.inputs
    for (let [key, field] of properties) {
      // need to look for the builder definition (keyed separately, see saveFilters)
      const defKey = `${key}-def`
      if (
        (field.customType === AutomationCustomIOType.FILTERS ||
          field.customType === AutomationCustomIOType.TRIGGER_FILTER) &&
        inputs?.[defKey]
      ) {
        filters = inputs[defKey]
        break
      }
    }
    return Array.isArray(filters)
      ? utils.processSearchFilters(filters)
      : filters
  }

  function saveFilters(key) {
    const update = Utils.parseFilter(tempFilters)
    const query = QueryUtils.buildQuery(update)
    onChange({
      [key]: query,
      [`${key}-def`]: update, // need to store the builder definition in the automation
    })

    drawer.hide()
  }

  function canShowField(value) {
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
      value.customType !== "trigger_filter_setting" &&
      value.type !== "signature_single" &&
      value.type !== "attachment" &&
      value.type !== "attachment_single"
    )
  }

  function getFieldLabel(key, value) {
    const requiredSuffix = requiredProperties.includes(key) ? "*" : ""
    const label = `${
      value.title || (key === "row" ? "Row" : key)
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
      {#if canShowField(stepLayouts[block.stepId].schema)}
        {#each stepLayouts[block.stepId][key].content as config}
          {#if config.title}
            <PropField label={config.title} labelTooltip={config.tooltip}>
              <svelte:component
                this={config.type}
                {...config.props}
                {bindings}
                on:change={config.props.onChange}
              />
            </PropField>
          {:else}
            <svelte:component
              this={config.type}
              {...config.props}
              {bindings}
              on:change={config.props.onChange}
            />
          {/if}
        {/each}
      {/if}
    {/each}
  {:else}
    <!-- Default Schema Property Layout -->
    {#each schemaProperties as [key, value]}
      {#if canShowField(value)}
        {@const label = getFieldLabel(key, value)}
        <div class:block-field={shouldRenderField(value)}>
          {#if key !== "fields" && value.type !== "boolean" && shouldRenderField(value)}
            <div class="label-container">
              <Label>
                {label}
              </Label>
              {#if value.customType === AutomationCustomIOType.TRIGGER_FILTER}
                <Icon
                  hoverable
                  on:click={() =>
                    window.open(
                      "https://docs.budibase.com/docs/row-trigger-filters",
                      "_blank"
                    )}
                  size="XS"
                  name="InfoOutline"
                />
              {/if}
            </div>
          {/if}
          <div>
            {#if value.type === "string" && value.enum && canShowField(value)}
              <Select
                on:change={e => onChange({ [key]: e.detail })}
                value={inputData[key]}
                placeholder={false}
                options={value.enum}
                getOptionLabel={(x, idx) =>
                  value.pretty ? value.pretty[idx] : x}
                disabled={value.readonly}
              />
            {:else if value.type === "json"}
              <Editor
                editorHeight="250"
                editorWidth="448"
                mode="json"
                value={inputData[key]?.value}
                on:change={e => onChange({ [key]: e.detail })}
                readOnly={value.readonly}
              />
            {:else if value.type === "boolean"}
              <div style="margin-top: 10px">
                <Checkbox
                  text={value.title}
                  value={inputData[key]}
                  on:change={e => onChange({ [key]: e.detail })}
                  disabled={value.readonly}
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
                disabled={value.readonly}
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
                disabled={value.readonly}
              />
            {:else if value.type === "attachment" || value.type === "signature_single"}
              <div class="attachment-field-wrapper">
                <div class="label-wrapper">
                  <Label>{label}</Label>
                </div>
                <div class="toggle-container">
                  <Toggle
                    value={inputData?.meta?.useAttachmentBinding}
                    text={"Use bindings"}
                    size={"XS"}
                    on:change={e => {
                      onChange({
                        [key]: null,
                        meta: {
                          useAttachmentBinding: e.detail,
                        },
                      })
                    }}
                  />
                </div>

                <div class="attachment-field-width">
                  {#if !inputData?.meta?.useAttachmentBinding}
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
                  {:else if isTestModal}
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
                  {/if}
                </div>
              </div>
            {:else if value.customType === AutomationCustomIOType.FILTERS || value.customType === AutomationCustomIOType.TRIGGER_FILTER}
              <ActionButton fullWidth on:click={drawer.show}>
                {filterCount > 0 ? "Update Filter" : "No Filter set"}
              </ActionButton>
              <Drawer
                bind:this={drawer}
                title="Filtering"
                forceModal
                on:drawerShow={() => {
                  tempFilters = filters
                }}
              >
                <Button cta slot="buttons" on:click={() => saveFilters(key)}>
                  Save
                </Button>

                <DrawerContent slot="body">
                  <FilterBuilder
                    filters={tempFilters}
                    {bindings}
                    {schemaFields}
                    datasource={{ type: "table", tableId }}
                    panel={AutomationBindingPanel}
                    showFilterEmptyDropdown={!rowTriggers.includes(stepId)}
                    on:change={e => (tempFilters = e.detail)}
                  />
                </DrawerContent>
              </Drawer>
            {:else if value.customType === "cron"}
              <CronBuilder
                on:change={e => onChange({ [key]: e.detail })}
                cronExpression={inputData[key]}
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
                disabled={value.readonly}
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
              <CodeEditorModal
                on:hide={() => {
                  // Push any pending changes when the window closes
                  onChange({ [key]: inputData[key] })
                }}
              >
                <div class:js-editor={editingJs}>
                  <div
                    class:js-code={editingJs}
                    style="width:100%;height:500px;"
                  >
                    <CodeEditor
                      value={inputData[key]}
                      on:change={e => {
                        // need to pass without the value inside
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
  .label-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .label-container :global(label) {
    white-space: unset;
  }

  .step-fields {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
  }

  .block-field {
    justify-content: space-between;
    display: grid;
    grid-template-columns: 1fr 320px;
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
