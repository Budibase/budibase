<script>
  import TableSelector from "./TableSelector.svelte"
  import RowSelector from "./RowSelector.svelte"
  import SchemaSetup from "./SchemaSetup.svelte"
  import {
    Button,
    Input,
    Select,
    Label,
    ActionButton,
    Drawer,
    Modal,
    Detail,
    notifications,
  } from "@budibase/bbui"
  import CreateWebhookModal from "components/automation/Shared/CreateWebhookModal.svelte"

  import { automationStore } from "builderStore"
  import { tables } from "stores/backend"
  import WebhookDisplay from "../Shared/WebhookDisplay.svelte"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"
  import CodeEditorModal from "./CodeEditorModal.svelte"
  import QuerySelector from "./QuerySelector.svelte"
  import QueryParamSelector from "./QueryParamSelector.svelte"
  import CronBuilder from "./CronBuilder.svelte"
  import Editor from "components/integration/QueryEditor.svelte"
  import ModalBindableInput from "components/common/bindings/ModalBindableInput.svelte"
  import FilterDrawer from "components/design/PropertiesPanel/PropertyControls/FilterEditor/FilterDrawer.svelte"
  import { LuceneUtils } from "@budibase/frontend-core"
  import { getSchemaForTable } from "builderStore/dataBinding"
  import { Utils } from "@budibase/frontend-core"

  export let block
  export let testData
  export let schemaProperties
  export let isTestModal = false
  let webhookModal
  let drawer
  let tempFilters = lookForFilters(schemaProperties) || []
  let fillWidth = true
  let codeBindingOpen = false

  $: stepId = block.stepId
  $: bindings = getAvailableBindings(
    block || $automationStore.selectedBlock,
    $automationStore.selectedAutomation?.automation?.definition
  )
  $: inputData = testData ? testData : block.inputs
  $: tableId = inputData ? inputData.tableId : null
  $: table = tableId
    ? $tables.list.find(table => table._id === inputData.tableId)
    : { schema: {} }
  $: schema = getSchemaForTable(tableId, { searchableSchema: true }).schema
  $: schemaFields = Object.values(schema || {})
  $: queryLimit = tableId?.includes("datasource") ? "∞" : "1000"

  const onChange = Utils.sequential(async (e, key) => {
    try {
      if (isTestModal) {
        // Special case for webhook, as it requires a body, but the schema already brings back the body's contents
        if (stepId === "WEBHOOK") {
          automationStore.actions.addTestDataToAutomation({
            body: {
              [key]: e.detail,
              ...$automationStore.selectedAutomation.automation.testData.body,
            },
          })
        }
        automationStore.actions.addTestDataToAutomation({
          [key]: e.detail,
        })
        testData[key] = e.detail
        await automationStore.actions.save(
          $automationStore.selectedAutomation?.automation
        )
      } else {
        block.inputs[key] = e.detail
        await automationStore.actions.save(
          $automationStore.selectedAutomation?.automation
        )
      }
    } catch (error) {
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

    // Extract all outputs from all previous steps as available bindins
    let bindings = []
    for (let idx = 0; idx < blockIdx; idx++) {
      let wasLoopBlock = allSteps[idx]?.stepId === "LOOP"
      let isLoopBlock =
        allSteps[idx]?.stepId === "LOOP" &&
        allSteps.find(x => x.blockToLoop === block.id)

      // If the previous block was a loop block, decerement the index so the following
      // steps are in the correct order
      if (wasLoopBlock) {
        blockIdx--
      }

      let schema = allSteps[idx]?.schema?.outputs?.properties ?? {}

      // If its a Loop Block, we need to add this custom schema
      if (isLoopBlock) {
        schema = {
          currentItem: {
            type: "string",
            description: "the item currently being executed",
          },
        }
      }
      const outputs = Object.entries(schema)

      bindings = bindings.concat(
        outputs.map(([name, value]) => {
          let runtimeName = isLoopBlock
            ? `loop.${name}`
            : block.name.startsWith("JS")
            ? `steps[${idx}].${name}`
            : `steps.${idx}.${name}`
          const runtime = idx === 0 ? `trigger.${name}` : runtimeName
          return {
            label: runtime,
            type: value.type,
            description: value.description,
            category:
              idx === 0
                ? "Trigger outputs"
                : isLoopBlock
                ? "Loop Outputs"
                : `Step ${idx} outputs`,
            path: runtime,
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
    const defKey = `${key}-def`
    inputData[key] = filters
    inputData[defKey] = tempFilters
    onChange({ detail: filters }, key)
    // need to store the builder definition in the automation
    onChange({ detail: tempFilters }, defKey)
    drawer.hide()
  }
</script>

<div class="fields">
  {#each schemaProperties as [key, value]}
    <div class="block-field">
      <Label
        tooltip={value.title === "Binding / Value"
          ? "If using the String input type, please use a comma or newline separated string"
          : null}>{value.title || (key === "row" ? "Table" : key)}</Label
      >
      {#if value.type === "string" && value.enum}
        <Select
          on:change={e => onChange(e, key)}
          value={inputData[key]}
          options={value.enum}
          getOptionLabel={(x, idx) => (value.pretty ? value.pretty[idx] : x)}
        />
      {:else if value.customType === "column"}
        <Select
          on:change={e => onChange(e, key)}
          value={inputData[key]}
          options={Object.keys(table?.schema || {})}
        />
      {:else if value.customType === "filters"}
        <ActionButton on:click={drawer.show}>Define filters</ActionButton>
        <Drawer bind:this={drawer} {fillWidth} title="Filtering">
          <Button cta slot="buttons" on:click={() => saveFilters(key)}
            >Save</Button
          >
          <FilterDrawer
            slot="body"
            bind:filters={tempFilters}
            {bindings}
            {schemaFields}
            panel={AutomationBindingPanel}
          />
        </Drawer>
      {:else if value.customType === "password"}
        <Input
          type="password"
          on:change={e => onChange(e, key)}
          value={inputData[key]}
        />
      {:else if value.customType === "email"}
        {#if isTestModal}
          <ModalBindableInput
            title={value.title}
            value={inputData[key]}
            panel={AutomationBindingPanel}
            type="email"
            on:change={e => onChange(e, key)}
            {bindings}
            fillWidth
            updateOnChange={false}
          />
        {:else}
          <DrawerBindableInput
            fillWidth
            title={value.title}
            panel={AutomationBindingPanel}
            type="email"
            value={inputData[key]}
            on:change={e => onChange(e, key)}
            {bindings}
            allowJS={false}
            updateOnChange={false}
          />
        {/if}
      {:else if value.customType === "query"}
        <QuerySelector
          on:change={e => onChange(e, key)}
          value={inputData[key]}
        />
      {:else if value.customType === "cron"}
        <CronBuilder on:change={e => onChange(e, key)} value={inputData[key]} />
      {:else if value.customType === "queryParams"}
        <QueryParamSelector
          on:change={e => onChange(e, key)}
          value={inputData[key]}
          {bindings}
        />
      {:else if value.customType === "table"}
        <TableSelector
          value={inputData[key]}
          on:change={e => onChange(e, key)}
        />
      {:else if value.customType === "row"}
        <RowSelector
          {block}
          value={inputData[key]}
          on:change={e => onChange(e, key)}
          {bindings}
          {isTestModal}
        />
      {:else if value.customType === "webhookUrl"}
        <WebhookDisplay
          on:change={e => onChange(e, key)}
          value={inputData[key]}
        />
      {:else if value.customType === "triggerSchema"}
        <SchemaSetup on:change={e => onChange(e, key)} value={inputData[key]} />
      {:else if value.customType === "code"}
        <CodeEditorModal>
          <ActionButton
            on:click={() => (codeBindingOpen = !codeBindingOpen)}
            quiet
            icon={codeBindingOpen ? "ChevronDown" : "ChevronRight"}
          >
            <Detail size="S">Bindings</Detail>
          </ActionButton>
          {#if codeBindingOpen}
            <pre>{JSON.stringify(bindings, null, 2)}</pre>
          {/if}
          <Editor
            mode="javascript"
            on:change={e => {
              // need to pass without the value inside
              onChange({ detail: e.detail.value }, key)
              inputData[key] = e.detail.value
            }}
            value={inputData[key]}
          />
        </CodeEditorModal>
      {:else if value.customType === "loopOption"}
        <Select
          on:change={e => onChange(e, key)}
          autoWidth
          value={inputData[key]}
          options={["Array", "String"]}
          defaultValue={"Array"}
        />
      {:else if value.type === "string" || value.type === "number" || value.type === "integer"}
        {#if isTestModal}
          <ModalBindableInput
            title={value.title}
            value={inputData[key]}
            panel={AutomationBindingPanel}
            type={value.customType}
            on:change={e => onChange(e, key)}
            {bindings}
            updateOnChange={false}
          />
        {:else}
          <div class="test">
            <DrawerBindableInput
              fillWidth={true}
              title={value.title}
              panel={AutomationBindingPanel}
              type={value.customType}
              value={inputData[key]}
              on:change={e => onChange(e, key)}
              {bindings}
              updateOnChange={false}
              placeholder={value.customType === "queryLimit" ? queryLimit : ""}
            />
          </div>
        {/if}
      {/if}
    </div>
  {/each}
</div>
<Modal bind:this={webhookModal} width="30%">
  <CreateWebhookModal />
</Modal>

{#if stepId === "WEBHOOK"}
  <Button secondary on:click={() => webhookModal.show()}>Set Up Webhook</Button>
{/if}

<style>
  .fields {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-s);
  }

  .block-field {
    display: grid;
    grid-gap: 5px;
  }

  .test :global(.drawer) {
    width: 10000px !important;
  }
</style>
