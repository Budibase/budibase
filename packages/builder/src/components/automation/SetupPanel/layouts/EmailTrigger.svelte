<script lang="ts">
  import { DrawerBindableInput } from "@/components/common/bindings"
  import AutomationBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import { PropField } from ".."
  import { automationStore } from "@/stores/builder"
  import { Checkbox, Label, Helpers } from "@budibase/bbui"
  import {
    type AutomationStep,
    type AutomationTrigger,
    type BaseIOStructure,
  } from "@budibase/types"

  export let block: AutomationStep | AutomationTrigger | undefined
  export let bindings: any[] | undefined
  export let context: {} | undefined

  const orderedFields = ["host", "port", "secure", "username", "password", "mailbox"]

  $: inputData = automationStore.actions.getInputData(block)
  $: schema = block?.schema.inputs?.properties || {}
  $: requiredInputs = block?.schema.inputs?.required || []

  const getInputValue = (key: string) => {
    const data = inputData as Record<string, unknown>
    return data?.[key]
  }

  const getFieldLabel = (key: string, field?: BaseIOStructure) => {
    if (!field) {
      return Helpers.capitalise(key)
    }
    const requiredSuffix = requiredInputs.includes(key) ? "*" : ""
    const label = `${field.title || key} ${requiredSuffix}`
    return Helpers.capitalise(label.trim())
  }

  const handleChange = (key: string, detail: unknown) => {
    if (!block) {
      return
    }
    automationStore.actions.requestUpdate({ [key]: detail }, block)
  }
</script>

<div class="email-trigger">
  <div class="email-trigger__title">
    <Label size="S">IMAP</Label>
  </div>
  <div class="email-trigger__fields">
    {#each orderedFields as key}
      {#if schema[key] && key !== "secure"}
        <PropField
          label={getFieldLabel(key, schema[key])}
          labelTooltip={schema[key].description || ""}
          fullWidth
        >
          <DrawerBindableInput
            panel={AutomationBindingPanel}
            {bindings}
            {context}
            value={getInputValue(key)}
            key={key}
            updateOnChange={false}
            type={schema[key].customType}
            placeholder={schema[key].description}
            on:change={event => handleChange(key, event.detail)}
          />
        </PropField>
      {:else if schema[key] && key === "secure"}
        <PropField
          label={getFieldLabel(key, schema[key])}
          labelTooltip={schema[key].description || ""}
          fullWidth
        >
          <Checkbox
            value={Boolean(getInputValue(key))}
            on:change={event => handleChange(key, event.detail)}
          />
        </PropField>
      {/if}
    {/each}
  </div>
</div>

<style>
  .email-trigger__title {
    margin-bottom: var(--spacing-m);
  }

  .email-trigger__fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
</style>
