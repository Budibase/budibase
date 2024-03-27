<script>
  import { Select, Label } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { FieldType } from "@budibase/types"

  export let parameters
  export let bindings = []

  $: fileBindings = bindings?.filter(
    b => b.fieldSchema?.type === FieldType.ATTACHMENT
  )

  const fileOptions = [
    {
      label: "Attachment",
      value: "attachment",
    },
    {
      label: "URL",
      value: "url",
    },
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "attachment"
    }
  })
</script>

<div class="root">
  <Label small>File</Label>
  <Select
    placeholder={null}
    bind:value={parameters.type}
    options={fileOptions}
  />
  {#if parameters.type === "attachment"}
    <Label small>Attachment</Label>
    <DrawerBindableInput
      title="Attachment"
      bindings={fileBindings}
      allowHelpers={false}
      value={parameters.attachment}
      on:change={value => (parameters.attachment = value.detail)}
    />
  {:else}
    <Label small>URL</Label>
    <DrawerBindableInput
      title="URL"
      {bindings}
      value={parameters.url}
      on:change={value => (parameters.url = value.detail)}
    />
    <Label small>File name</Label>
    <DrawerBindableInput
      title="File name"
      {bindings}
      value={parameters.fileName}
      on:change={value => (parameters.fileName = value.detail)}
    />
  {/if}
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }
</style>
