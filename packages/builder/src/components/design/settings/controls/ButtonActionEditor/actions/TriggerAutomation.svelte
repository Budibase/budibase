<script>
  import { Select, Label, Input, Checkbox, Icon, Body } from "@budibase/bbui"
  import { automationStore } from "@/stores/builder"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import { TriggerStepID } from "@/constants/backend/automations"
  import { sdk as coreSdk } from "@budibase/shared-core"

  export let parameters = {}
  export let bindings = []

  let rootEle

  const AUTOMATION_STATUS = {
    NEW: "new",
    EXISTING: "existing",
  }
  let automationStatus = parameters.automationId
    ? AUTOMATION_STATUS.EXISTING
    : AUTOMATION_STATUS.NEW
  $: {
    if (automationStatus === AUTOMATION_STATUS.NEW) {
      parameters.synchronous = false
    }
    parameters.synchronous = automations.find(
      automation => automation._id === parameters.automationId
    )?.synchronous
    parameters
  }
  $: automations = rootEle
    ? $automationStore.automations
        .filter(a => a.definition.trigger?.stepId === TriggerStepID.APP)
        .map(automation => {
          const schema = Object.entries(
            automation.definition.trigger.inputs.fields || {}
          ).map(([name, type]) => ({ name, type }))

          let hasCollectBlock =
            coreSdk.automations.checkForCollectStep(automation)

          return {
            name: automation.name,
            _id: automation._id,
            schema,
            synchronous: hasCollectBlock,
            disabled: automation.disabled,
            icon: getStatusIcon(!automation.disabled),
          }
        })
    : []

  $: selectedAutomation = automations?.find(
    a => a._id === parameters?.automationId
  )
  $: selectedSchema = selectedAutomation?.schema
  $: error = parameters.timeout > 120 ? "Timeout must be less than 120s" : null

  const onFieldsChanged = field => {
    parameters.fields = { ...parameters.fields, ...field }
  }

  const onChange = value => {
    let automationId = value.detail
    parameters.synchronous = automations.find(
      automation => automation._id === automationId
    )?.synchronous
    parameters.automationId = automationId
  }

  const getStatusIcon = (enabled = true) => {
    if (!rootEle) {
      return ""
    }
    const disabledColor =
      getComputedStyle(rootEle)
        .getPropertyValue("--spectrum-alias-text-color-disabled")
        .trim() || "#FEFEFE"

    const svg = `
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="4" fill="${enabled ? "#53a761" : disabledColor}" />
      </svg>`

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }
</script>

<div class="root" bind:this={rootEle}>
  <div class="fields">
    <div class="field-name">
      <Label small>Automation</Label>
    </div>
    <div style="width: 100%">
      <Select
        on:change={onChange}
        bind:value={parameters.automationId}
        placeholder="Choose automation"
        options={automations}
        getOptionLabel={x => x.name}
        getOptionValue={x => x._id}
        useOptionIconImage
      />
      {#if selectedAutomation?.disabled}
        <div class="disabled-info">
          <Body size="XS"
            >This automation is currently disabled and will not execute until
            enabled and published.
          </Body>
        </div>
      {/if}
      {#if parameters.synchronous}
        <div class="synchronous-info">
          <Icon size="XS" name="info" />
          <Body size="XS">This automation will run synchronously</Body>
        </div>
      {/if}
    </div>
  </div>
  {#if parameters.synchronous}
    <div class="fields">
      <Label small>Timeout</Label>
      <div class="timeout-width">
        <Input type="number" {error} bind:value={parameters.timeout} />
      </div>
    </div>
  {/if}
  <div class="fields">
    {#if selectedSchema && selectedSchema.length}
      {#each selectedSchema as field, idx}
        {#if idx === 0}
          <Label small>Fields</Label>
        {:else}
          <Label small />
        {/if}
        <Input disabled value={field.name} />
        <DrawerBindableInput
          value={parameters.fields && parameters.fields[field.name]}
          {bindings}
          on:change={event => onFieldsChanged({ [field.name]: event.detail })}
        />
      {/each}
    {/if}
  </div>

  <div class="param-margin">
    <Label small />
    <Checkbox
      text="Do not display default notification"
      bind:value={parameters.notificationOverride}
    />
    <Checkbox text="Require confirmation" bind:value={parameters.confirm} />

    {#if parameters.confirm}
      <Label small>Confirm text</Label>
      <Input
        placeholder="Are you sure you want to trigger this automation?"
        bind:value={parameters.confirmText}
      />
    {/if}
  </div>
</div>

<style>
  .root {
    max-width: 800px;
    margin: 0 auto;
  }
  .timeout-width {
    width: 30%;
  }

  .param-margin {
    margin-top: var(--spacing-l);
  }

  .field-name {
    align-self: baseline;
    margin-top: var(--spacing-s);
  }

  .synchronous-info,
  .disabled-info {
    display: flex;
    gap: var(--spacing-s);
    margin-top: var(--spacing-s);
  }

  .fields {
    margin-top: var(--spacing-l);
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 15% auto auto;
    align-items: center;
  }
  .fields:first-child {
    grid-template-columns: 15% auto;
  }
</style>
