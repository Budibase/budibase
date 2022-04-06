<script>
  import {
    Select,
    Toggle,
    DatePicker,
    Multiselect,
    TextArea,
  } from "@budibase/bbui"
  import LinkedRowSelector from "components/common/LinkedRowSelector.svelte"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"

  export let onChange
  export let field
  export let schema
  export let value
  export let bindings

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
  <Toggle
    text={field}
    value={value[field]}
    on:change={e => onChange(e, field)}
  />
{:else if schema.type === "array"}
  <Multiselect
    bind:value={value[field]}
    label={field}
    options={schema.constraints.inclusion}
  />
{:else if schema.type === "longform"}
  <TextArea label={field} bind:value={value[field]} />
{:else if schema.type === "link"}
  <LinkedRowSelector bind:linkedRows={value[field]} {schema} />
{:else if schema.type === "string" || schema.type === "number"}
  <DrawerBindableInput
    panel={AutomationBindingPanel}
    value={value[field]}
    on:change={e => onChange(e, field)}
    label={field}
    type="string"
    {bindings}
    fillWidth={true}
    allowJS={true}
  />
{/if}
