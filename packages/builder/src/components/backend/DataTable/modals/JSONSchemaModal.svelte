<script>
  import Editor from "../../../integration/QueryEditor.svelte"
  import {
    ModalContent,
    Tabs,
    Tab,
    Button,
    Input,
    Select,
  } from "@budibase/bbui"
  import { onMount, createEventDispatcher } from "svelte"
  import { FIELDS } from "constants/backend"
  import { generate } from "builderStore/schemaGenerator"

  export let schema = {}
  export let json

  let dispatcher = createEventDispatcher()
  let mode = "Key/Value"
  let fieldCount = 0
  let fieldKeys = {},
    fieldTypes = {}
  let keyValueOptions = [
    { label: "String", value: FIELDS.STRING.type },
    { label: "Number", value: FIELDS.NUMBER.type },
    { label: "Boolean", value: FIELDS.BOOLEAN.type },
    { label: "Object", value: FIELDS.JSON.type },
    { label: "Array", value: FIELDS.ARRAY.type },
  ]
  let invalid = false

  async function onJsonUpdate({ detail }) {
    const input = detail.value
    json = input
    try {
      // check json valid first
      let inputJson = JSON.parse(input)
      schema = generate(inputJson)
      updateCounts()
      invalid = false
    } catch (err) {
      // json not currently valid
      invalid = true
    }
  }

  function updateCounts() {
    if (!schema) {
      schema = {}
    }
    let i = 0
    for (let [key, value] of Object.entries(schema)) {
      fieldKeys[i] = key
      fieldTypes[i] = value.type
      i++
    }
    fieldCount = i
  }

  function saveSchema() {
    for (let i of Object.keys(fieldKeys)) {
      const key = fieldKeys[i]
      // they were added to schema, rather than generated
      if (!schema[key]) {
        schema[key] = {
          type: fieldTypes[i],
        }
      }
    }
    dispatcher("save", { schema, json })
  }

  onMount(() => {
    updateCounts()
  })
</script>

<ModalContent
  title={"Key/Value Schema Editor"}
  confirmText="Save Column"
  onConfirm={saveSchema}
  bind:disabled={invalid}
  size="L"
>
  <Tabs selected={mode} noPadding>
    <Tab title="Key/Value">
      {#each Array(fieldCount) as _, i}
        <div class="horizontal">
          <Input outline label="Key" bind:value={fieldKeys[i]} />
          <Select
            label="Type"
            options={keyValueOptions}
            bind:value={fieldTypes[i]}
            getOptionValue={field => field.value}
            getOptionLabel={field => field.label}
          />
        </div>
      {/each}
      <div class:add-field-btn={fieldCount !== 0}>
        <Button primary text on:click={() => fieldCount++}>Add Field</Button>
      </div>
    </Tab>
    <Tab title="JSON">
      <Editor mode="json" on:change={onJsonUpdate} value={json} />
    </Tab>
  </Tabs>
</ModalContent>

<style>
  .horizontal {
    display: grid;
    grid-template-columns: 30% 1fr;
    grid-gap: var(--spacing-s);
    align-items: center;
  }

  .add-field-btn {
    margin-top: var(--spacing-xl);
  }
</style>
