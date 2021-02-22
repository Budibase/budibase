<script>
  import { Label, TextButton, Spacer, Select, Input } from "@budibase/bbui"
  import { store, currentAsset } from "builderStore"
  import { getBindableProperties } from "builderStore/dataBinding"
  import { CloseCircleIcon, AddIcon } from "components/common/Icons"
  import { createEventDispatcher } from "svelte"
  import DrawerBindableInput from "components/common/DrawerBindableInput.svelte"

  const dispatch = createEventDispatcher()

  export let parameterFields
  export let schemaFields
  export let fieldLabel = "Column"
  export let valueLabel = "Value"

  let fields = Object.entries(parameterFields || {})
  $: onChange(fields)
  $: bindableProperties = getBindableProperties(
    $currentAsset,
    $store.selectedComponentId
  )

  const addField = () => {
    fields = [...fields.filter(field => field[0]), ["", ""]]
  }

  const removeField = name => {
    fields = fields.filter(field => field[0] !== name)
  }

  const updateFieldValue = (idx, value) => {
    fields[idx][1] = value
    fields = fields
  }

  const updateFieldName = (idx, name) => {
    fields[idx][0] = name
    fields = fields
  }

  const onChange = fields => {
    const newParamFields = {}
    fields
      .filter(field => field[0])
      .forEach(([field, value]) => {
        newParamFields[field] = value
      })
    dispatch("change", newParamFields)
  }
</script>

{#if fields}
  {#each fields as field, idx}
    <Label small>{fieldLabel}</Label>
    {#if schemaFields}
      <Select
        thin
        secondary
        value={field[0]}
        on:change={event => updateFieldName(idx, event.target.value)}>
        <option value="" />
        {#each schemaFields as schemaField}
          <option value={schemaField.name}>{schemaField.name}</option>
        {/each}
      </Select>
    {:else}
      <Input
        thin
        secondary
        value={field[0]}
        on:change={event => updateFieldName(idx, event.target.value)} />
    {/if}
    <Label small>{valueLabel}</Label>
    <DrawerBindableInput
      title={`Value for "${field[0]}"`}
      value={field[1]}
      bindings={bindableProperties}
      on:change={event => updateFieldValue(idx, event.detail)} />
    <div class="remove-field-container">
      <TextButton text small on:click={() => removeField(field[0])}>
        <CloseCircleIcon />
      </TextButton>
    </div>
  {/each}
  <div>
    <Spacer small />
    <TextButton text small blue on:click={addField}>
      Add
      {fieldLabel}
      <div style="height: 20px; width: 20px;">
        <AddIcon />
      </div>
    </TextButton>
  </div>
{/if}

<style>
  .remove-field-container :global(button) {
    vertical-align: bottom;
  }
</style>
