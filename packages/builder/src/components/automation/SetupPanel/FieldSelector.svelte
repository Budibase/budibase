<script>
  import { createEventDispatcher } from "svelte"
  import PropField from "./PropField.svelte"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import ModalBindableInput from "../../common/bindings/ModalBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"
  import { DatePicker, Select } from "@budibase/bbui"
  import { FieldType } from "@budibase/types"

  const dispatch = createEventDispatcher()

  export let value = {}
  export let bindings
  export let block
  export let isTestModal

  const { STRING, NUMBER, ARRAY } = FieldType

  let schemaFields = []
  let editableValue

  $: editableValue = { ...value }

  $: {
    let fields = {}
    for (const [key, type] of Object.entries(block?.inputs?.fields ?? {})) {
      fields = {
        ...fields,
        [key]: {
          type: type,
          name: key,
          fieldName: key,
          constraints: { type: type },
        },
      }

      if (editableValue[key] === type) {
        editableValue[key] = INITIAL_VALUES[type.toUpperCase()]
      }
    }

    schemaFields = Object.entries(fields)
  }

  const INITIAL_VALUES = {
    BOOLEAN: null,
    NUMBER: null,
    DATETIME: null,
    STRING: "",
    ARRAY: "",
  }

  const onChange = (e, field) => {
    if (e.detail !== editableValue[field]) {
      editableValue[field] = e.detail
      dispatch("change", editableValue)
    }
  }
</script>

{#if schemaFields?.length && isTestModal}
  <div class="fields">
    {#each schemaFields as [field, schema]}
      <PropField label={field}>
        {#if [STRING, NUMBER, ARRAY].includes(schema.type)}
          <svelte:component
            this={isTestModal ? ModalBindableInput : DrawerBindableInput}
            panel={AutomationBindingPanel}
            value={editableValue[field]}
            on:change={e => onChange(e, field)}
            type="string"
            {bindings}
            allowJS={true}
            updateOnChange={false}
            title={schema.name}
            autocomplete="off"
          />
        {:else if schema.type === "boolean"}
          <Select
            on:change={e => onChange(e, field)}
            value={editableValue[field]}
            options={[
              { label: "True", value: "true" },
              { label: "False", value: "false" },
            ]}
          />
        {:else if schema.type === "datetime"}
          <DatePicker
            value={editableValue[field]}
            on:change={e => onChange(e, field)}
          />
        {/if}
      </PropField>
    {/each}
  </div>
{/if}

<style>
  .fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
</style>
