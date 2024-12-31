<script>
  import Editor from "@/components/integration/QueryEditor.svelte"
  import {
    ModalContent,
    Tabs,
    Tab,
    Button,
    Input,
    Select,
    Body,
    Layout,
    ActionButton,
  } from "@budibase/bbui"
  import { onMount, createEventDispatcher } from "svelte"
  import { FIELDS } from "@/constants/backend"
  import { generate } from "@/helpers/schemaGenerator"

  export let schema = {}
  export let json

  let dispatcher = createEventDispatcher()
  let mode = "Form"
  let fieldCount = 0
  let fieldKeys = [],
    fieldTypes = []
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
    // find the entries which aren't in the list
    const schemaEntries = Object.entries(schema).filter(
      ([key]) => !fieldKeys.includes(key)
    )
    for (let [key, value] of schemaEntries) {
      fieldKeys.push(key)
      fieldTypes.push(value.type)
    }
    fieldCount = fieldKeys.length
  }

  function saveSchema() {
    const newSchema = {}
    for (let [index, key] of fieldKeys.entries()) {
      // they were added to schema, rather than generated
      newSchema[key] = {
        ...schema[key],
        type: fieldTypes[index],
      }
    }
    dispatcher("save", { schema: newSchema, json })
    schema = newSchema
  }

  function removeKey(index) {
    const keyToRemove = fieldKeys[index]
    if (fieldKeys[index + 1] != null) {
      fieldKeys[index] = fieldKeys[index + 1]
      fieldTypes[index] = fieldTypes[index + 1]
    }
    fieldKeys.splice(index, 1)
    fieldTypes.splice(index, 1)
    fieldCount--
    if (json) {
      try {
        const parsed = JSON.parse(json)
        delete parsed[keyToRemove]
        json = JSON.stringify(parsed, null, 2)
      } catch (err) {
        // json not valid, ignore
      }
    }
  }

  onMount(() => {
    updateCounts()
  })
</script>

<ModalContent
  title={"JSON Schema Editor"}
  confirmText="Save Column"
  onConfirm={saveSchema}
  bind:disabled={invalid}
  size="L"
>
  <Tabs selected={mode} noPadding>
    <Tab title="Form">
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
          <ActionButton icon="Close" quiet on:click={() => removeKey(i)} />
        </div>
      {/each}
      <div class:add-field-btn={fieldCount !== 0}>
        <Button primary text on:click={() => fieldCount++}>Add Field</Button>
      </div>
    </Tab>
    <Tab title="JSON">
      <Layout noPadding gap="XS">
        <Body size="S">
          Provide a sample JSON blob here to automatically determine your
          schema.
        </Body>
        <Editor mode="json" on:change={onJsonUpdate} value={json} />
      </Layout>
    </Tab>
  </Tabs>
</ModalContent>

<style>
  .horizontal {
    display: grid;
    grid-template-columns: 30% 1fr 40px;
    grid-gap: var(--spacing-s);
    align-items: end;
  }

  .add-field-btn {
    margin-top: var(--spacing-xl);
  }
</style>
