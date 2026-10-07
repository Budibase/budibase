<svelte:options runes={true} />

<script lang="ts">
  import { Button } from "@budibase/bbui"
  import {
    MAX_FUNCTION_INPUTS,
    validateFunctionInputSchema,
  } from "@budibase/shared-core"
  import type {
    FunctionInputDefinition,
    FunctionInputType,
  } from "@budibase/types"
  import SchemaFieldRow from "@/components/common/SchemaFieldRow.svelte"
  import { getErrorMessage } from "@/helpers/errors"

  export interface Props {
    inputSchema?: FunctionInputDefinition[]
    onSave: (_inputSchema: FunctionInputDefinition[]) => Promise<void>
    onDirtyChange?: (_dirty: boolean) => void
  }

  let { inputSchema = [], onSave, onDirtyChange = () => {} }: Props = $props()
  const typeOptions: { label: string; value: FunctionInputType }[] = [
    { label: "String", value: "string" },
    { label: "Number", value: "number" },
    { label: "Boolean", value: "boolean" },
    { label: "Object", value: "object" },
    { label: "Array", value: "array" },
  ]

  let drafts = $state<FunctionInputDefinition[]>([])
  let syncedSchema = $state("")
  let saving = $state(false)
  let saveError = $state("")
  let errors = $state<string[]>([])
  let inputErrors = $state<string[][]>([])
  let dirty = $derived(JSON.stringify(drafts) !== syncedSchema)

  $effect(() => {
    const serialized = JSON.stringify(inputSchema)
    if (serialized !== syncedSchema) {
      drafts = inputSchema.map(({ name, type }) => ({
        name,
        type,
      }))
      syncedSchema = serialized
      saveError = ""
      errors = []
      inputErrors = []
    }
  })
  $effect(() => {
    onDirtyChange(dirty)
  })

  const clearResolvedErrors = () => {
    if (!inputErrors.some(messages => messages.length) && !errors.length) {
      return
    }
    const remainingErrors = validateFunctionInputSchema(drafts)
    inputErrors = inputErrors.map((messages, index) =>
      messages.filter(message =>
        remainingErrors.some(
          error => error.index === index && error.message === message
        )
      )
    )
    errors = errors.filter(message =>
      remainingErrors.some(
        error => error.index === undefined && error.message === message
      )
    )
  }

  const save = async () => {
    saveError = ""
    const validationErrors = validateFunctionInputSchema(drafts)
    inputErrors = drafts.map((_, index) =>
      validationErrors
        .filter(error => error.index === index)
        .map(error => error.message)
    )
    errors = validationErrors
      .filter(error => error.index === undefined)
      .map(error => error.message)
    if (validationErrors.length) {
      return
    }
    saving = true
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
  <div class="header">
    <h3>Inputs</h3>
    <Button primary size="S" disabled={saving || !dirty} on:click={save}
      >{saving ? "Saving..." : "Save"}</Button
    >
  </div>
  {#each drafts as input, index}
    <div class="input" role="group" aria-label={`Input ${index + 1}`}>
      <SchemaFieldRow
        name={input.name}
        type={input.type}
        options={typeOptions}
        placeholder="Enter input name"
        removeLabel={`Remove input ${index + 1}`}
        disabled={saving}
        updateOnChange
        onNameChange={name => {
          input.name = name
          clearResolvedErrors()
        }}
        onTypeChange={type => {
          input.type = type
          clearResolvedErrors()
        }}
        onRemove={() => {
          drafts = drafts.filter((_, i) => i !== index)
          inputErrors = inputErrors.filter((_, i) => i !== index)
          clearResolvedErrors()
        }}
      />
      {#if inputErrors[index]?.length}
        <div role="alert">
          {#each inputErrors[index] as error}<p>{error}</p>{/each}
        </div>
      {/if}
    </div>
  {/each}
  {#if errors.length}
    <div role="alert">
      {#each errors as error}<p>{error}</p>{/each}
    </div>
  {/if}
  {#if saveError}<p role="alert">{saveError}</p>{/if}
  <div class="actions">
    <Button
      quiet
      secondary
      icon="plus"
      disabled={saving || drafts.length >= MAX_FUNCTION_INPUTS}
      on:click={() => {
        drafts = [...drafts, { name: "", type: "string" }]
      }}>Add input</Button
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
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  h3,
  p {
    margin: 0;
  }
  p {
    color: var(--spectrum-global-color-gray-700);
    line-height: 1.5;
  }
  .input {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
  }
  [role="alert"] p,
  p[role="alert"] {
    color: var(--spectrum-global-color-red-700);
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
