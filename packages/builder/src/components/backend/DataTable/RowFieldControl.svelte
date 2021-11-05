<script>
  import {
    Input,
    Select,
    DatePicker,
    Toggle,
    TextArea,
    Multiselect,
  } from "@budibase/bbui"
  import Dropzone from "components/common/Dropzone.svelte"
  import { capitalise } from "helpers"
  import LinkedRowSelector from "components/common/LinkedRowSelector.svelte"

  export let defaultValue
  export let meta
  export let value = defaultValue || (meta.type === "boolean" ? false : "")
  export let readonly

  $: type = meta?.type
  $: label = meta.name ? capitalise(meta.name) : ""
</script>

{#if type === "options"}
  <Select
    {label}
    data-cy="{meta.name}-select"
    bind:value
    options={meta.constraints.inclusion}
    sort
  />
{:else if type === "datetime"}
  <DatePicker {label} bind:value />
{:else if type === "attachment"}
  <Dropzone {label} bind:value />
{:else if type === "boolean"}
  <Toggle text={label} bind:value data-cy="{meta.name}-input" />
{:else if type === "array"}
  <Multiselect bind:value {label} options={meta.constraints.inclusion} />
{:else if type === "link"}
  <LinkedRowSelector bind:linkedRows={value} schema={meta} />
{:else if type === "longform"}
  <TextArea {label} bind:value />
{:else}
  <Input
    {label}
    data-cy="{meta.name}-input"
    {type}
    bind:value
    disabled={readonly}
  />
{/if}
