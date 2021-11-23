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

  export let schema = {}

  let dispatcher = createEventDispatcher()
  let mode = "Key/Value"
  let json
  let fieldCount = 0
  let fieldKeys = {},
    fieldTypes = {}
  let keyValueOptions = ["String", "Number", "Boolean", "Object", "Array"]

  $: invalid = false

  function onJsonUpdate({ detail }) {
    // TODO: make request
    const input = detail.value
    console.log(input)
  }

  function saveSchema() {
    for (let i of Object.keys(fieldKeys)) {
      const key = fieldKeys[i]
      schema[key] = {
        type: fieldTypes[i],
      }
    }
    dispatcher("save", schema)
  }

  onMount(() => {
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
  })
</script>

<ModalContent
  title={"Key/Value Schema Editor"}
  confirmText="Save Column"
  onConfirm={saveSchema}
  disabled={invalid}
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
            getOptionValue={field => field.toLowerCase()}
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
