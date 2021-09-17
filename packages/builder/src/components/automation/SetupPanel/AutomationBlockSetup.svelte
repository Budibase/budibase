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
  } from "@budibase/bbui"
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
  import { database } from "stores/backend"
  import { debounce } from "lodash"
  import ModalBindableInput from "components/common/bindings/ModalBindableInput.svelte"
  import FilterDrawer from "components/design/PropertiesPanel/PropertyControls/FilterEditor/FilterDrawer.svelte"
  // need the client lucene builder to convert to the structure API expects
  import { buildLuceneQuery } from "../../../../../client/src/utils/lucene"

  export let block
  export let webhookModal
  export let testData
  export let schemaProperties
  export let isTestModal = false
  let drawer
  let tempFilters = lookForFilters(schemaProperties) || []
  let fillWidth = true

  $: stepId = block.stepId
  $: bindings = getAvailableBindings(
    block || $automationStore.selectedBlock,
    $automationStore.selectedAutomation?.automation?.definition
  )
  $: instanceId = $database._id

  $: inputData = testData ? testData : block.inputs
  $: tableId = inputData ? inputData.tableId : null
  $: table = tableId
    ? $tables.list.find(table => table._id === inputData.tableId)
    : { schema: {} }
  $: schemaFields = table ? Object.values(table.schema) : []

  const onChange = debounce(
    async function (e, key) {
      if (isTestModal) {
        testData[key] = e.detail
      } else {
        block.inputs[key] = e.detail
        await automationStore.actions.save(
          $automationStore.selectedAutomation?.automation
        )
      }
    },
    isTestModal ? 0 : 800
  )

  function getAvailableBindings(block, automation) {
    if (!block || !automation) {
      return []
    }

    // Find previous steps to the selected one
    let allSteps = [...automation.steps]
    if (automation.trigger) {
      allSteps = [automation.trigger, ...allSteps]
    }
    const blockIdx = allSteps.findIndex(step => step.id === block.id)

    // Extract all outputs from all previous steps as available bindings
    let bindings = []
    for (let idx = 0; idx < blockIdx; idx++) {
      const outputs = Object.entries(
        allSteps[idx].schema?.outputs?.properties ?? {}
      )
      bindings = bindings.concat(
        outputs.map(([name, value]) => ({
          label: name,
          type: value.type,
          description: value.description,
          category: idx === 0 ? "Trigger outputs" : `Step ${idx} outputs`,
          path: idx === 0 ? `trigger.${name}` : `steps.${idx}.${name}`,
        }))
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
    const filters = buildLuceneQuery(tempFilters)
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
      <Label>{value.title || (key === "row" ? "Table" : key)}</Label>
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
          options={Object.keys(table.schema)}
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
          value={inputData[key]}
          on:change={e => onChange(e, key)}
          {bindings}
        />
      {:else if value.customType === "webhookUrl"}
        <WebhookDisplay value={inputData[key]} />
      {:else if value.customType === "triggerSchema"}
        <SchemaSetup on:change={e => onChange(e, key)} value={value[key]} />
      {:else if value.customType === "code"}
        <CodeEditorModal>
          <pre>{JSON.stringify(bindings, null, 2)}</pre>
          <Editor
            mode="javascript"
            on:change={e => {
              onChange(e, key)
              inputData[key] = e.detail.value
            }}
            value={inputData[key]}
          />
        </CodeEditorModal>
      {:else if value.type === "string" || value.type === "number"}
        {#if isTestModal}
          <ModalBindableInput
            title={value.title}
            value={inputData[key]}
            panel={AutomationBindingPanel}
            type={value.customType}
            on:change={e => onChange(e, key)}
            {bindings}
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
            />
          </div>
        {/if}
      {/if}
    </div>
  {/each}
</div>
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
