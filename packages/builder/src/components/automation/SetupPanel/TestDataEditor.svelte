<script lang="ts">
  import { ActionButton, Button, TextArea } from "@budibase/bbui"
  import {
    type Automation,
    type AutomationTrigger,
  } from "@budibase/types"
  import { createEventDispatcher } from "svelte"
  import AutomationBlockSetup from "./AutomationBlockSetup.svelte"

  export let title = "Add test data"
  export let showTitle = true
  export let showRunButton = false
  export let runDisabled = false
  export let constrainWidth = false
  export let failedParse: string | null = null
  export let jsonValue = ""
  export let schemaProperties: Array<[string, Record<string, unknown>]> = []
  export let testData: Record<string, unknown> | undefined
  export let block: AutomationTrigger | undefined
  export let automation: Automation | undefined

  let tab: "values" | "json" = "values"

  const dispatch = createEventDispatcher<{
    "values-change": { testData?: Record<string, unknown> }
    "json-change": string
    "run-test": undefined
  }>()
</script>

<div class="test-data-editor">
  {#if showTitle}
    <div class="test-data-title">{title}</div>
  {/if}

  <div class="options">
    <ActionButton
      quiet
      selected={tab === "values"}
      on:click={() => (tab = "values")}
      >Use values</ActionButton
    >
    <ActionButton
      quiet
      selected={tab === "json"}
      on:click={() => (tab = "json")}
      >Use JSON</ActionButton
    >
  </div>

  {#if tab === "values"}
    <div class="tab-content-padding" class:constrain-width={constrainWidth}>
      <AutomationBlockSetup
        {schemaProperties}
        isTestModal
        {testData}
        {block}
        {automation}
        on:update={e => dispatch("values-change", e.detail)}
      />
    </div>
  {/if}

  {#if tab === "json"}
    <div class="text-area-container">
      <TextArea
        value={jsonValue}
        error={failedParse || undefined}
        on:change={e => dispatch("json-change", e.detail)}
      />
    </div>
  {/if}

  {#if showRunButton}
    <div class="run-row">
      <Button cta disabled={runDisabled} on:click={() => dispatch("run-test")}
        >Run test</Button
      >
    </div>
  {/if}
</div>

<style>
  .test-data-editor {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    padding: var(--spacing-l);
  }

  .test-data-title {
    font-weight: 500;
  }

  .options {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .tab-content-padding {
    padding: 0 var(--spacing-s);
  }

  .tab-content-padding.constrain-width {
    width: min(100%, 720px);
  }

  .text-area-container :global(textarea) {
    min-height: 300px;
    height: 300px;
  }

  .run-row {
    margin-top: auto;
    display: flex;
    justify-content: flex-start;
  }
</style>
