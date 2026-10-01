<svelte:options runes={true} />

<script lang="ts">
  import { getErrorMessage } from "@/helpers/errors"
  import { Button, Checkbox, Input, Select, TextArea } from "@budibase/bbui"
  import {
    FUNCTION_INPUT_TYPES,
    MAX_FUNCTION_INPUTS,
    validateFunctionInputSchema,
  } from "@budibase/shared-core"
  import type { FunctionInputDefinition } from "@budibase/types"

  export interface Props {
    inputSchema?: FunctionInputDefinition[]
    onSave: (_inputSchema: FunctionInputDefinition[]) => Promise<void>
    onDirtyChange?: (_dirty: boolean) => void
  }

  let { inputSchema = [], onSave, onDirtyChange = () => {} }: Props = $props()
  let drafts = $state<FunctionInputDefinition[]>([])
  let syncedSchema = $state("")
  let saving = $state(false)
  let saveError = $state("")
  let errors = $derived(validateFunctionInputSchema(drafts))
  let dirty = $derived(JSON.stringify(drafts) !== syncedSchema)

  $effect(() => {
    const serialized = JSON.stringify(inputSchema)
    if (serialized !== syncedSchema) {
      drafts = inputSchema.map(input => ({ ...input }))
      syncedSchema = serialized
      saveError = ""
    }
  })
  $effect(() => {
    onDirtyChange(dirty)
  })

  const save = async () => {
    saving = true
    saveError = ""
    try {
      await onSave(drafts.map(input => ({ ...input })))
    } catch (error) {
      saveError = getErrorMessage(error) || "Unable to save inputs"
    } finally {
      saving = false
    }
  }
</script>

<div class="inputs-panel">
  <h3>Inputs</h3>
  <p>
    Define the inputs your Function accepts. Changes require a new build.
    Optional inputs may be omitted or set to null.
  </p>
  {#if !drafts.length}
    <p>No inputs defined. Your Function accepts a generic JSON object.</p>
  {/if}
  {#each drafts as input, index}
    <fieldset disabled={saving}>
      <legend>Input {index + 1}</legend>
      <Input
        label="Name"
        bind:value={input.name}
        disabled={saving}
        placeholder="customerId"
      />
      <Select
        label="Type"
        options={FUNCTION_INPUT_TYPES}
        placeholder={false}
        bind:value={input.type}
        disabled={saving}
      />
      <Checkbox text="Required" bind:value={input.required} disabled={saving} />
      <TextArea
        label="Description (optional)"
        bind:value={input.description}
        disabled={saving}
        updateOnChange
        height={64}
      />
      <Button
        secondary
        size="S"
        disabled={saving}
        on:click={() => {
          drafts = drafts.filter((_, i) => i !== index)
        }}>Remove input {index + 1}</Button
      >
    </fieldset>
  {/each}
  {#if errors.length}
    <div role="alert">
      {#each errors as error}<p>{error}</p>{/each}
    </div>
  {/if}
  {#if saveError}<p role="alert">{saveError}</p>{/if}
  <div class="actions">
    <Button
      secondary
      size="S"
      disabled={saving || drafts.length >= MAX_FUNCTION_INPUTS}
      on:click={() => {
        drafts = [...drafts, { name: "", type: "string", required: true }]
      }}>Add input</Button
    >
    <Button
      primary
      size="S"
      disabled={saving || !dirty || errors.length > 0}
      on:click={save}>{saving ? "Saving..." : "Save inputs"}</Button
    >
  </div>
</div>

<style>
  .inputs-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 13px;
  }
  h3,
  p {
    margin: 0;
  }
  p {
    color: var(--spectrum-global-color-gray-700);
    line-height: 1.5;
  }
  fieldset {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 6px;
    min-width: 0;
  }
  [role="alert"] p,
  p[role="alert"] {
    color: var(--spectrum-global-color-red-700);
  }
  .actions {
    display: flex;
    gap: 8px;
  }
</style>
