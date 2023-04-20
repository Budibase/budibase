<script>
  import { Input, Select, Button } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { _ } from "../../../../lang/i18n"

  const dispatch = createEventDispatcher()

  export let value = {}

  $: fieldsArray = value
    ? Object.entries(value).map(([name, type]) => ({
        name,
        type,
      }))
    : []

  const typeOptions = [
    {
      label: $_("components.automation.SetupPanel.SchemaSetup.Text"),
      value: "string",
    },
    {
      label: $_("components.automation.SetupPanel.SchemaSetup.Number"),
      value: "number",
    },
    {
      label: $_("components.automation.SetupPanel.SchemaSetup.Boolean"),
      value: "boolean",
    },
    {
      label: $_("components.automation.SetupPanel.SchemaSetup.DateTime"),
      value: "datetime",
    },
    {
      label: $_("components.automation.SetupPanel.SchemaSetup.Array"),
      value: "array",
    },
  ]

  function addField() {
    const newValue = { ...value }
    newValue[""] = "string"
    dispatch("change", newValue)
  }

  function removeField(name) {
    const newValues = { ...value }
    delete newValues[name]
    dispatch("change", newValues)
  }

  const fieldNameChanged = originalName => e => {
    // reconstruct using fieldsArray, so field order is preserved
    let entries = [...fieldsArray]
    const newName = e.detail
    if (newName) {
      entries.find(f => f.name === originalName).name = newName
    } else {
      entries = entries.filter(f => f.name !== originalName)
    }
    value = entries.reduce((newVals, current) => {
      newVals[current.name.trim()] = current.type
      return newVals
    }, {})
    dispatch("change", value)
  }
</script>

<div class="root">
  <div class="spacer" />
  {#each fieldsArray as field}
    <div class="field">
      <Input
        value={field.name}
        secondary
        placeholder={$_(
          "components.automation.SetupPanel.SchemaSetup.Enter_name"
        )}
        on:change={fieldNameChanged(field.name)}
        updateOnChange={false}
      />
      <Select
        value={field.type}
        on:change={e => {
          value[field.name] = e.detail
          dispatch("change", value)
        }}
        options={typeOptions}
      />
      <i
        class="remove-field ri-delete-bin-line"
        on:click={() => removeField(field.name)}
      />
    </div>
  {/each}
  <Button quiet secondary icon="Add" on:click={addField}
    >{$_("components.automation.SetupPanel.SchemaSetup.Add_field")}</Button
  >
</div>

<style>
  .root {
    max-width: 100%;
    /* so we can show the "+" button beside the "fields" label*/
    top: -26px;
  }

  .spacer {
    height: var(--spacing-s);
  }

  .field {
    max-width: 100%;
    margin-bottom: var(--spacing-m);
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    position: relative;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>
