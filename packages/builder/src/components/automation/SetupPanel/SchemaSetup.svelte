<script>
  import { Input } from "@budibase/bbui"

  export let value = {}
  $: fieldsArray = Object.entries(value).map(([name, type]) => ({
    name,
    type,
  }))

  let addNewName = ""
  let addNewType = "string"

  function addField() {
    if (!addNewName) return
    if (value[addNewName.trim()]) {
      addNewName = ""
      return
    }
    const newValue = { ...value }
    newValue[addNewName.trim()] = "string"
    value = newValue
    addNewName = ""
  }

  function onInputEnter(e) {
    if (e.key === "Enter") {
      addField()
    }
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
  {#each fieldsArray as field}
    <i
      class="remove-field ri-delete-bin-line"
      on:click={() => removeField(field.name)} />
    <input
      value={field.name}
      on:change={fieldNameChanged(field.name)}
      class="grid-field" />
    <select
      value={field.type}
      on:blur={e => (value[field.name] = e.target.value)}
      class="grid-field">
      <option>string</option>
      <option>number</option>
      <option>boolean</option>
      <option>datetime</option>
    </select>
  {/each}
  <div class="new-field" on:keyup={onInputEnter}>
    <Input
      primary
      small
      bind:value={addNewName}
      placeholder="Enter field name" />
  </div>
  <!--button on:click={addField}>Add</button-->
</div>

<style>
  .root {
    display: grid;
    grid-template-columns: auto 1fr auto;
  }

  .remove-field {
    cursor: pointer;
    color: var(--grey-6);
    margin: auto 4px auto 0;
  }

  .remove-field:hover {
    color: var(--black);
  }

  .new-field {
    grid-column: 1 / span 3;
    max-width: 100%;
  }

  .grid-field {
    min-width: 50px;
    font-family: inherit;
    font-size: inherit;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid var(--grey-4);
    border-radius: 0px;
  }
</style>
