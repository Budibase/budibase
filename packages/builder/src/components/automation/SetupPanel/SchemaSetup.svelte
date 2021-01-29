<script>
  import { Input, Select } from "@budibase/bbui"

  export let value = {}
  $: fieldsArray = Object.entries(value).map(([name, type]) => ({
    name,
    type,
  }))

  function addField() {
    const newValue = { ...value }
    newValue[""] = "string"
    value = newValue
  }

  function removeField(name) {
    const newValues = { ...value }
    delete newValues[name]
    value = newValues
  }

  const fieldNameChanged = originalName => e => {
    // reconstruct using fieldsArray, so field order is preserved
    let entries = [...fieldsArray]
    const newName = e.target.value
    if (newName) {
      entries.find(f => f.name === originalName).name = newName
    } else {
      entries = entries.filter(f => f.name !== originalName)
    }
    value = entries.reduce((newVals, current) => {
      newVals[current.name] = current.type
      return newVals
    }, {})
  }
</script>

<div class="root">
  <div class="add-field"><i class="ri-add-line" on:click={addField} /></div>
  <div class="spacer" />
  {#each fieldsArray as field}
    <div class="field">
      <Input
        value={field.name}
        secondary
        placeholder="Enter field name"
        on:change={fieldNameChanged(field.name)} />
      <Select
        secondary
        extraThin
        value={field.type}
        on:blur={e => (value[field.name] = e.target.value)}>
        <option>string</option>
        <option>number</option>
        <option>boolean</option>
        <option>datetime</option>
      </Select>

      <i
        class="remove-field ri-delete-bin-line"
        on:click={() => removeField(field.name)} />
    </div>
  {/each}
</div>

<style>
  .root {
    position: relative;
    max-width: 100%;
    overflow-x: auto;
    /* so we can show the "+" button beside the "fields" label*/
    top: -26px;
  }

  .spacer {
    height: var(--spacing-s);
  }

  .field {
    max-width: 100%;
    background-color: var(--grey-2);
    margin-bottom: var(--spacing-m);
    border-style: solid;
    border-width: 1px;
    border-color: var(--grey-4);
    display: grid;
    /*grid-template-rows: auto auto;
    grid-template-columns: auto;*/
    position: relative;
    overflow: hidden;
  }

  .field :global(select) {
    padding: var(--spacing-xs) 2rem var(--spacing-m) var(--spacing-s) !important;
    font-size: var(--font-size-xs);
    color: var(--grey-7);
  }

  .field :global(.pointer) {
    padding-bottom: var(--spacing-m) !important;
    color: var(--grey-2);
  }

  .field :global(input) {
    padding: var(--spacing-m) var(--spacing-xl) var(--spacing-xs)
      var(--spacing-m);
    font-size: var(--font-size-s);
    font-weight: bold;
  }

  .remove-field {
    cursor: pointer;
    color: var(--grey-6);
    position: absolute;
    top: var(--spacing-m);
    right: 3px;
  }

  .remove-field:hover {
    color: var(--black);
  }

  .add-field {
    text-align: right;
  }

  .add-field > i {
    cursor: pointer;
  }
</style>
