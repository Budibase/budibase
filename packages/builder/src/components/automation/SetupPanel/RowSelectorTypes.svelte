<script>
  import {
    Select,
    DatePicker,
    Multiselect,
    TextArea,
    Label,
  } from "@budibase/bbui"
  import LinkedRowSelector from "components/common/LinkedRowSelector.svelte"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import ModalBindableInput from "../../common/bindings/ModalBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"
  import Editor from "components/integration/QueryEditor.svelte"

  export let onChange
  export let field
  export let schema
  export let value
  export let bindings
  export let isTestModal

  $: parsedBindings = bindings.map(binding => {
    let clone = Object.assign({}, binding)
    clone.icon = "ShareAndroid"
    return clone
  })

  function schemaHasOptions(schema) {
    return !!schema.constraints?.inclusion?.length
  }
</script>

{#if schemaHasOptions(schema) && schema.type !== "array"}
  <Select
    on:change={e => onChange(e, field)}
    label={field}
    value={value[field]}
    options={schema.constraints.inclusion}
  />
{:else if schema.type === "datetime"}
  <DatePicker
    label={field}
    value={value[field]}
    on:change={e => onChange(e, field)}
  />
{:else if schema.type === "boolean"}
  <Select
    on:change={e => onChange(e, field)}
    label={field}
    value={value[field]}
    options={[
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ]}
  />
{:else if schema.type === "array"}
  <Multiselect
    bind:value={value[field]}
    label={field}
    options={schema.constraints.inclusion}
    on:change={e => onChange(e, field)}
  />
{:else if schema.type === "longform"}
  <TextArea
    label={field}
    bind:value={value[field]}
    on:change={e => onChange(e, field)}
  />
{:else if schema.type === "json"}
  <span>
    <Label>{field}</Label>
    <Editor
      editorHeight="150"
      mode="json"
      on:change={e => {
        if (e.detail?.value !== value[field]) {
          onChange(e, field, schema.type)
        }
      }}
      value={value[field]}
    />
  </span>
{:else if schema.type === "link"}
  <LinkedRowSelector
    bind:linkedRows={value[field]}
    {schema}
    on:change={e => onChange(e, field)}
  />
{:else if schema.type === "string" || schema.type === "number"}
  <svelte:component
    this={isTestModal ? ModalBindableInput : DrawerBindableInput}
    panel={AutomationBindingPanel}
    value={value[field]}
    on:change={e => onChange(e, field)}
    label={field}
    type="string"
    bindings={parsedBindings}
    fillWidth={true}
    allowJS={true}
    updateOnChange={false}
  />
{/if}
