<script>
  import { Label, ActionButton, Button, Select, Input } from "@budibase/bbui"
  import { store, currentAsset } from "builderStore"
  import { getBindableProperties } from "builderStore/dataBinding"
  import { createEventDispatcher } from "svelte"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

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
        value={field[0]}
        on:change={event => updateFieldName(idx, event.detail)}
        options={schemaFields.map(field => field.name)}
      />
    {:else}
      <Input
        thin
        secondary
        value={field[0]}
        on:change={event => updateFieldName(idx, event.detail)}
      />
    {/if}
    <Label small>{valueLabel}</Label>
    <DrawerBindableInput
      title={`Value for "${field[0]}"`}
      value={field[1]}
      bindings={bindableProperties}
      on:change={event => updateFieldValue(idx, event.detail)}
    />
    <ActionButton
      size="S"
      quiet
      icon="Delete"
      on:click={() => removeField(field[0])}
    />
  {/each}
  <div>
    <Button icon="AddCircle" size="S" cta on:click={addField}>
      Add
      {fieldLabel}
    </Button>
  </div>
{/if}
