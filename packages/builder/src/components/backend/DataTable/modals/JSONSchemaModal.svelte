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
  import { isPlainObject } from "lodash"
  import { FIELDS } from "@/constants/backend"
  import { generate } from "@/helpers/schemaGenerator"
  import { JsonFieldSubType } from "@budibase/types"

  export let schema = {}
  export let json
  export let subtype

  let dispatcher = createEventDispatcher()
  let mode = "Form"
  let fieldCount = 0
  let fieldKeys = [],
    fieldTypes = []
  let arrayDetected = false
  let workingSchema = {}
  let schemaWrapper
  let keyValueOptions = [
    { label: "String", value: FIELDS.STRING.type },
    { label: "Number", value: FIELDS.NUMBER.type },
    { label: "Boolean", value: FIELDS.BOOLEAN.type },
    { label: "Object", value: FIELDS.JSON.type },
    { label: "Array", value: FIELDS.ARRAY.type },
  ]
  let invalid = false

  const isSchemaEntry = value =>
    isPlainObject(value) && ("type" in value || "schema" in value)

  const unpackSchemaValue = value => {
    if (isSchemaEntry(value)) {
      return {
        wrapper: value,
        map: value.schema || {},
      }
    }

    if (
      isPlainObject(value) &&
      Object.values(value || {}).every(isSchemaEntry)
    ) {
      return {
        wrapper: null,
        map: value,
      }
    }

    return {
      wrapper: null,
      map: {},
    }
  }

  const packSchemaValue = (map, wrapper) => {
    if (isPlainObject(wrapper) && "schema" in wrapper) {
      return {
        ...wrapper,
        schema: map,
      }
    }
    return map
  }

  function updateStateFromSchema(nextSchema = {}) {
    schema = nextSchema || {}
    const { wrapper, map } = unpackSchemaValue(schema)
    schemaWrapper = wrapper
    workingSchema = map
    fieldKeys = Object.keys(workingSchema)
    fieldTypes = fieldKeys.map(
      key => workingSchema[key]?.type || FIELDS.STRING.type
    )
    fieldCount = fieldKeys.length
    if (!arrayDetected && schemaWrapper?.subtype === JsonFieldSubType.ARRAY) {
      arrayDetected = true
    }
  }

  function mergeArrayItems(items) {
    return items.reduce((acc, item) => {
      if (isPlainObject(item)) {
        acc = mergeObjects(acc, item)
      }
      return acc
    }, {})
  }

  function mergeObjects(target = {}, source = {}) {
    const result = { ...target }
    for (const [key, value] of Object.entries(source)) {
      if (Array.isArray(value)) {
        result[key] = mergeArraySamples(target[key], value)
      } else if (isPlainObject(value)) {
        result[key] = mergeObjects(target[key], value)
      } else {
        result[key] = value
      }
    }
    return result
  }

  function mergeArraySamples(existing, incoming) {
    const existingSample = Array.isArray(existing) ? existing[0] : undefined
    const incomingSample = incoming[0]
    if (isPlainObject(existingSample) || isPlainObject(incomingSample)) {
      return [
        mergeObjects(
          isPlainObject(existingSample) ? existingSample : {},
          isPlainObject(incomingSample) ? incomingSample : {}
        ),
      ]
    }
    return [incomingSample != null ? incomingSample : existingSample]
  }

  function deriveSchemaFromJson(parsedJson) {
    const jsonIsArray = Array.isArray(parsedJson)
    arrayDetected = jsonIsArray
    if (jsonIsArray) {
      const mergedItems = mergeArrayItems(parsedJson)
      if (Object.keys(mergedItems).length === 0) {
        updateStateFromSchema({})
        return
      }
      const generated = generate(mergedItems)
      updateStateFromSchema(generated || {})
      return
    }
    if (isPlainObject(parsedJson)) {
      const generated = generate(parsedJson)
      updateStateFromSchema(generated || {})
    } else {
      updateStateFromSchema({})
    }
  }

  async function onJsonUpdate({ detail }) {
    const input = detail.value
    json = input
    try {
      // check json valid first
      let inputJson = JSON.parse(input)
      deriveSchemaFromJson(inputJson)
      invalid = false
    } catch (err) {
      // json not currently valid
      invalid = true
    }
  }

  function saveSchema() {
    const newSchema = {}
    for (let [index, key] of fieldKeys.entries()) {
      // they were added to schema, rather than generated
      newSchema[key] = {
        ...workingSchema[key],
        type: fieldTypes[index],
      }
    }
    const packedSchema = packSchemaValue(newSchema, schemaWrapper)
    updateStateFromSchema(packedSchema)
    dispatcher("save", {
      schema: packedSchema,
      json,
      subtype: arrayDetected ? JsonFieldSubType.ARRAY : undefined,
    })
  }

  function removeKey(index) {
    const keyToRemove = fieldKeys[index]
    fieldKeys = fieldKeys.filter((_, i) => i !== index)
    fieldTypes = fieldTypes.filter((_, i) => i !== index)
    fieldCount = fieldKeys.length
    if (workingSchema && keyToRemove in workingSchema) {
      const updatedSchema = { ...workingSchema }
      delete updatedSchema[keyToRemove]
      const packedSchema = packSchemaValue(updatedSchema, schemaWrapper)
      updateStateFromSchema(packedSchema)
    }
    if (json) {
      try {
        const parsed = JSON.parse(json)
        if (Array.isArray(parsed)) {
          for (let item of parsed) {
            if (isPlainObject(item)) {
              delete item[keyToRemove]
            }
          }
          json = JSON.stringify(parsed, null, 2)
        } else if (isPlainObject(parsed)) {
          delete parsed[keyToRemove]
          json = JSON.stringify(parsed, null, 2)
        }
      } catch (err) {
        // json not valid, ignore
      }
    }
  }

  function addField() {
    fieldKeys = [...fieldKeys, ""]
    fieldTypes = [...fieldTypes, FIELDS.STRING.type]
    fieldCount = fieldKeys.length
  }

  onMount(() => {
    arrayDetected = subtype === JsonFieldSubType.ARRAY
    if (json) {
      try {
        deriveSchemaFromJson(JSON.parse(json))
        invalid = false
        return
      } catch (err) {
        invalid = true
      }
    }
    updateStateFromSchema(schema)
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
      {#if arrayDetected}
        <div class="array-note">
          <Body size="S">
            Array detected. Define the schema for the child objects below.
          </Body>
        </div>
      {/if}
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
          <ActionButton icon="x" quiet on:click={() => removeKey(i)} />
        </div>
      {/each}
      <div class:add-field-btn={fieldCount !== 0}>
        <Button primary text on:click={addField}>Add Field</Button>
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

  .array-note {
    margin-bottom: var(--spacing-m);
  }
</style>
