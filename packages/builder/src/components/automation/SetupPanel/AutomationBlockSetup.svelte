<script>
  import TableSelector from "./TableSelector.svelte"
  import RowSelector from "./RowSelector.svelte"
  import SchemaSetup from "./SchemaSetup.svelte"
  import { Button, Input, Select, Label } from "@budibase/bbui"
  import { automationStore } from "builderStore"
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

  export let block
  export let webhookModal
  export let testData
  export let schemaProperties

  $: stepId = block.stepId
  $: bindings = getAvailableBindings(
    block || $automationStore.selectedBlock,
    $automationStore.selectedAutomation?.automation?.definition
  )
  $: instanceId = $database._id

  $: inputData = testData ? testData : block.inputs

  async function onChange(e, key) {
    if (testData) {
      testData[key] = e.detail
    } else {
      block.inputs[key] = e.detail
      await automationStore.actions.save({
        instanceId,
        automation: $automationStore.selectedAutomation?.automation,
      })
    }
  }

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
</script>

<div class="fields">
  {#each schemaProperties as [key, value]}
    <div class="block-field">
      <Label>{value.title || key}</Label>
      {#if value.type === "string" && value.enum}
        <Select
          on:change={e => onChange(e, key)}
          value={inputData[key]}
          options={value.enum}
          getOptionLabel={(x, idx) => (value.pretty ? value.pretty[idx] : x)}
        />
      {:else if value.customType === "password"}
        <Input
          type="password"
          on:change={e => onChange(e, key)}
          value={inputData[key]}
        />
      {:else if value.customType === "email"}
        {#if testData}
          <ModalBindableInput
            title={value.title}
            value={inputData[key]}
            panel={AutomationBindingPanel}
            type="email"
            on:change={e => onChange(e, key)}
            {bindings}
          />
        {:else}
          <DrawerBindableInput
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
          on:change={debounce(e => onChange(e, key), 800)}
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
        {#if testData}
          <ModalBindableInput
            title={value.title}
            value={inputData[key]}
            panel={AutomationBindingPanel}
            type={value.customType}
            on:change={e => onChange(e, key)}
            {bindings}
          />
        {:else}
          <DrawerBindableInput
            title={value.title}
            panel={AutomationBindingPanel}
            type={value.customType}
            value={inputData[key]}
            on:change={e => onChange(e, key)}
            {bindings}
          />
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
</style>
