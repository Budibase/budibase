<script>
  import { Select, Label } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { FieldType } from "@budibase/types"
  import { processStringSync } from "@budibase/string-templates"

  export let parameters
  export let bindings = []

  $: fileBindings = bindings?.filter(
    b => b.fieldSchema?.type === FieldType.ATTACHMENT
  )

  let selectedAttachment

  const fileOptions = [
    {
      label: "Attachment",
      value: "attachment",
    },
    {
      label: "Url",
      value: "url",
    },
  ]

  const onAttachmentSelect = e => {
    const fileData = processStringSync(e.detail, bindings)
    parameters.value ??= {}
    parameters.value.file_name = e.detail.name
    parameters.value.url = e.detail.url
    console.log({ parameters, bindings, fileData })
  }

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
    on:change={() => {
      delete parameters.value
    }}
  />
  {#if parameters.type === "attachment"}
    <Label small>Attachment</Label>
    <DrawerBindableInput
      title="Attachment"
      bindings={fileBindings}
      allowHelpers={false}
      bind:value={selectedAttachment}
      on:change={onAttachmentSelect}
    />
  {:else}
    <Label small>URL</Label>
    <DrawerBindableInput
      title="URL"
      {bindings}
      value={parameters.value?.url}
      on:change={e =>
        (parameters.value = { ...parameters.value, url: e.detail })}
    />
    <Label small>File name</Label>
    <DrawerBindableInput
      title="File name"
      {bindings}
      value={parameters.value?.file_name}
      on:change={e =>
        (parameters.value = { ...parameters.value, file_name: e.detail })}
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
