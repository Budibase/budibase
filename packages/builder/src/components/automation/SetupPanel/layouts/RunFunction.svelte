<script lang="ts">
  import { automationStore, functionStore } from "@/stores/builder"
  import type { AutomationContext } from "@/stores/builder/automations"
  import type {
    AutomationStep,
    EnrichedBinding,
    ExecuteFunctionStepInputs,
    FunctionResponse,
  } from "@budibase/types"
  import { Body, Button, Icon, ProgressCircle, Select } from "@budibase/bbui"
  import { onMount } from "svelte"
  import FunctionInputsEditor from "../FunctionInputsEditor.svelte"
  import PropField from "../PropField.svelte"

  export let bindings: EnrichedBinding[] | undefined = undefined
  export let block: AutomationStep | undefined = undefined
  export let context: AutomationContext | undefined = undefined

  const readinessLabels = {
    ready: "Ready",
    build_required: "Build required",
    build_failed: "Build failed",
  }

  $: inputData = automationStore.actions.getInputData(block) as
    | Partial<ExecuteFunctionStepInputs>
    | undefined
  $: functions = $functionStore.functions
  $: selectedFunction = functions.find(fn => fn._id === inputData?.functionId)
  $: selectedFunctionMissing =
    !!inputData?.functionId && !$functionStore.loading && !selectedFunction

  const getOptionLabel = (fn: FunctionResponse) =>
    `${fn.name} · ${readinessLabels[fn.readiness]}`
  const getOptionValue = (fn: FunctionResponse) => fn._id

  const update = (value: Partial<ExecuteFunctionStepInputs>) => {
    if (block) {
      automationStore.actions.requestUpdate(value, block)
    }
  }

  onMount(() => {
    functionStore.fetch()
  })
</script>

<div class="run-function-layout">
  <PropField label="Function *" fullWidth>
    {#if $functionStore.loading}
      <div class="loading">
        <ProgressCircle size="S" />
        <Body size="S">Loading Functions...</Body>
      </div>
    {:else if $functionStore.error}
      <div class="message error" role="alert">
        <Icon name="warning-circle" size="S" />
        <Body size="S">{$functionStore.error}</Body>
        <Button secondary on:click={() => functionStore.fetch()}>Retry</Button>
      </div>
    {:else}
      <Select
        value={inputData?.functionId}
        options={functions}
        {getOptionLabel}
        {getOptionValue}
        placeholder="Select a Function"
        on:change={event => update({ functionId: event.detail })}
      />
    {/if}
  </PropField>

  {#if selectedFunctionMissing}
    <div class="message error" role="alert">
      <Icon name="warning-circle" size="S" />
      <Body size="S">
        This Function was deleted or is unavailable. Select another Function.
      </Body>
    </div>
  {:else if selectedFunction?.readiness === "build_required"}
    <div class="message warning" role="status">
      <Icon name="warning-circle" size="S" />
      <Body size="S">
        This Function must be built before the automation can run it.
      </Body>
    </div>
  {:else if selectedFunction?.readiness === "build_failed"}
    <div class="message error" role="alert">
      <Icon name="warning-circle" size="S" />
      <Body size="S">
        The latest Function build failed. Fix and rebuild it before running this
        automation.
      </Body>
    </div>
  {:else if !$functionStore.loading && !functions.length}
    <div class="message warning" role="status">
      <Icon name="info" size="S" />
      <Body size="S">
        Create and build a Function before configuring this step.
      </Body>
    </div>
  {/if}

  <PropField label="Inputs *" fullWidth>
    <FunctionInputsEditor
      value={inputData?.inputs}
      bindings={bindings || []}
      {context}
      onchange={inputs => update({ inputs })}
    />
  </PropField>
</div>

<style>
  .run-function-layout {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
  .loading,
  .message {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .loading {
    min-height: 32px;
  }
  .message {
    padding: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--radius-m);
  }
  .message :global(.spectrum-Body) {
    flex: 1;
  }
  .message.warning {
    border-color: var(--spectrum-global-color-orange-400);
    color: var(--spectrum-global-color-orange-800);
  }
  .message.error {
    border-color: var(--spectrum-global-color-red-400);
    color: var(--spectrum-global-color-red-700);
  }
</style>
