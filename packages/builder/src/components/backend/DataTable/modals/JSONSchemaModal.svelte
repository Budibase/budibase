<script>
  import Editor from "../../../integration/QueryEditor.svelte"
  import {
    ModalContent,
    Tabs,
    Tab,
    Button,
    Input,
    Select,
    notifications,
  } from "@budibase/bbui"
  import { onMount, createEventDispatcher } from "svelte"
  import { post } from "builderStore/api"

  export let schema = {}

  let dispatcher = createEventDispatcher()
  let mode = "Key/Value"
  let json
  let fieldCount = 0
  let fieldKeys = {},
    fieldTypes = {}
  let keyValueOptions = ["String", "Number", "Boolean", "Object", "Array"]
  let invalid = false

  async function onJsonUpdate({ detail }) {
    const input = detail.value
    json = input
    try {
      // check json valid first
      let inputJson = JSON.parse(input)
      const response = await post("/api/tables/schema/generate", {
        json: inputJson,
      })
      if (response.status !== 200) {
        const error = (await response.text()).message
        notifications.error(error)
      } else {
        schema = await response.json()
        updateCounts()
        invalid = false
      }
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
      schema[key] = {
        type: fieldTypes[i],
      }
    }
    dispatcher("save", schema)
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
