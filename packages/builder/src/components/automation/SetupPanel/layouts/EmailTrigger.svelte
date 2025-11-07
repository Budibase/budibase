<script lang="ts">
  import { DrawerBindableInput } from "@/components/common/bindings"
  import AutomationBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import { PropField } from ".."
  import { automationStore } from "@/stores/builder"
  import { Label, Helpers, Select } from "@budibase/bbui"
  import {
    type AutomationStep,
    type AutomationTrigger,
    type BaseIOStructure,
  } from "@budibase/types"

  export let block: AutomationStep | AutomationTrigger | undefined
  export let bindings: any[] | undefined
  export let context: {} | undefined

  type SecurityOption = { label: string; value: boolean }

  const orderedFields = [
    "host",
    "port",
    "secure",
    "username",
    "password",
    "mailbox",
  ]
  const securityOptions: SecurityOption[] = [
    { label: "SSL/TLS", value: true },
    { label: "None/STARTTLS", value: false },
  ]
  const getSecurityOptionLabel = (option: SecurityOption) => option.label
  const getSecurityOptionValue = (option: SecurityOption) => option.value

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
    <Label size="L">IMAP settings</Label>
    <p class="email-trigger__subtitle">
      Configure your inbox connection details below.
    </p>
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
            {key}
            updateOnChange={false}
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
          <Select
            value={Boolean(getInputValue(key))}
            options={securityOptions}
            placeholder={false}
            getOptionLabel={getSecurityOptionLabel}
            getOptionValue={getSecurityOptionValue}
            on:change={event => handleChange(key, event.detail)}
          />
        </PropField>
      {/if}
    {/each}
  </div>
</div>

<style>
  .email-trigger {
    padding-bottom: var(--spacing-xl);
  }

  .email-trigger__title {
    margin-bottom: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .email-trigger__subtitle {
    margin: 0;
    color: var(--spectrum-alias-label-text-color);
    font-size: 13px;
  }

  .email-trigger__fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
</style>
