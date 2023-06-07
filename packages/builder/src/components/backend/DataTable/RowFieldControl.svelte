<script>
  import {
    Input,
    Select,
    DatePicker,
    Toggle,
    Multiselect,
    Label,
    RichTextField,
    TextArea,
  } from "@budibase/bbui"
  import Dropzone from "components/common/Dropzone.svelte"
  import { capitalise } from "helpers"
  import LinkedRowSelector from "components/common/LinkedRowSelector.svelte"
  import Editor from "../../integration/QueryEditor.svelte"

  export let defaultValue
  export let meta
  export let value = defaultValue || (meta.type === "boolean" ? false : "")
  export let readonly
  export let error

  const resolveTimeStamp = timestamp => {
    if (!timestamp) {
      return null
    }
    let maskedDate = new Date(`0-${timestamp}`)
    if (maskedDate instanceof Date && !isNaN(maskedDate.getTime())) {
      return maskedDate
    } else {
      return null
    }
  }

  $: stringVal =
    typeof value === "object" ? JSON.stringify(value, null, 2) : value
  $: type = meta?.type
  $: label = meta.name ? capitalise(meta.name) : ""

  const timeStamp = resolveTimeStamp(value)
  const isTimeStamp = !!timeStamp || meta?.timeOnly
</script>

{#if type === "options" && meta.constraints.inclusion.length !== 0}
  <Select
    {label}
    bind:value
    options={meta.constraints.inclusion}
    sort
    {error}
  />
{:else if type === "datetime"}
  <DatePicker
    {error}
    {label}
    timeOnly={isTimeStamp}
    enableTime={!meta?.dateOnly}
    ignoreTimezones={meta?.ignoreTimezones}
    bind:value
  />
{:else if type === "attachment"}
  <Dropzone {label} {error} bind:value />
{:else if type === "boolean"}
  <Toggle text={label} {error} bind:value />
{:else if type === "array" && meta.constraints.inclusion.length !== 0}
  <Multiselect
    bind:value
    {error}
    {label}
    options={meta.constraints.inclusion}
  />
{:else if type === "link"}
  <LinkedRowSelector {error} bind:linkedRows={value} schema={meta} />
{:else if type === "longform"}
  {#if meta.useRichText}
    <RichTextField {error} {label} height="150px" bind:value />
  {:else}
    <TextArea {error} {label} height="150px" bind:value />
  {/if}
{:else if type === "json"}
  <Label>{label}</Label>
  <Editor
    editorHeight="250"
    editorWidth="320"
    mode="json"
    on:change={({ detail }) => (value = detail.value)}
    value={stringVal}
    {error}
  />
{:else}
  <Input {label} {type} {error} bind:value disabled={readonly} />
{/if}
