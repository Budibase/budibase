<script>
  // accepts an array of field names, and outputs an object of { FieldName: value }
  import { DataList, Label, TextButton, Spacer, Select } from "@budibase/bbui"
  import { store, backendUiStore } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  import { CloseCircleIcon, AddIcon } from "components/common/Icons"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/replaceBindings"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let parameterFields
  export let schemaFields

  const emptyField = () => ({ name: "", value: "" })

  // this statement initialises fields from parameters.fields
  $: fields =
    fields ||
    Object.keys(parameterFields || { "": "" }).map(name => ({
      name,
      value:
        (parameterFields &&
          runtimeToReadableBinding(
            bindableProperties,
            parameterFields[name].value
          )) ||
        "",
    }))

  $: bindableProperties = fetchBindableProperties({
    componentInstanceId: $store.currentComponentInfo._id,
    components: $store.components,
    screen: $store.currentPreviewItem,
    models: $backendUiStore.models,
  })

  const addField = () => {
    const newFields = fields.filter(f => f.name)
    newFields.push(emptyField())
    fields = newFields
    rebuildParameters()
  }

  const removeField = field => () => {
    fields = fields.filter(f => f !== field)
    rebuildParameters()
  }

  const rebuildParameters = () => {
    // rebuilds paramters.fields every time a field name or value is added
    // as UI below is bound to "fields" array, but we need to output a { key: value }
    const newParameterFields = {}
    for (let field of fields) {
      if (field.name) {
        // value and type is needed by the client, so it can parse
        // a string into a correct type
        newParameterFields[field.name] = {
          type: schemaFields.find(f => f.name === field.name).type,
          value: readableToRuntimeBinding(bindableProperties, field.value),
        }
      }
    }
    dispatch("fieldschanged", newParameterFields)
  }

  // just wraps binding in {{ ... }}
  const toBindingExpression = bindingPath => `{{ ${bindingPath} }}`
</script>

{#if fields}
  {#each fields as field}
    <Label size="m" color="dark">Field</Label>
    <Select secondary bind:value={field.name} on:blur={rebuildParameters}>
      <option value="" />
      {#each schemaFields as schemaField}
        <option value={schemaField.name}>{schemaField.name}</option>
      {/each}
    </Select>
    <Label size="m" color="dark">Value</Label>
    <DataList secondary bind:value={field.value} on:blur={rebuildParameters}>
      <option value="" />
      {#each bindableProperties as bindableProp}
        <option value={toBindingExpression(bindableProp.readableBinding)}>
          {bindableProp.readableBinding}
        </option>
      {/each}
    </DataList>
    <div class="remove-field-container">
      <TextButton text small on:click={removeField(field)}>
        <CloseCircleIcon />
      </TextButton>
    </div>
  {/each}

  <div>
    <Spacer small />

    <TextButton text small blue on:click={addField}>
      Add Field
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
