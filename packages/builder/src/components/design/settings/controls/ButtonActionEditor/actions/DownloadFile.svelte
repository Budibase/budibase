<script>
  import { Select, Label } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import { FieldType } from "@budibase/types"
  import { tables, viewsV2 } from "@/stores/builder"

  export let parameters
  export let bindings = []

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

  $: tableOptions = $tables.list.map(table => ({
    label: table.name,
    resourceId: table._id,
    schema: table.schema,
  }))
  $: viewOptions = $viewsV2.list.map(view => ({
    label: view.name,
    resourceId: view.id,
    schema: view.schema,
  }))
  $: options = [...(tableOptions || []), ...(viewOptions || [])]

  $: selectedTable =
    parameters.tableId && options.find(t => t.resourceId === parameters.tableId)
  $: attachmentColumns =
    selectedTable &&
    Object.values(selectedTable.schema).filter(c =>
      [FieldType.ATTACHMENTS, FieldType.ATTACHMENT_SINGLE].includes(c.type)
    )

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
    <Label>Table</Label>
    <Select
      placeholder={null}
      bind:value={parameters.tableId}
      {options}
      getOptionLabel={table => table.label}
      getOptionValue={table => table.resourceId}
    />
    <Label small>Column</Label>
    <Select
      disabled={!attachmentColumns?.length}
      placeholder={parameters.tableId && !attachmentColumns?.length
        ? "This table has no attachment columns"
        : undefined}
      bind:value={parameters.attachmentColumn}
      options={attachmentColumns?.map(c => c.name)}
    />

    <Label small>Row ID</Label>
    <DrawerBindableInput
      {bindings}
      title="Row ID"
      value={parameters.rowId}
      on:change={value => (parameters.rowId = value.detail)}
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
    max-width: 800px;
    margin: 0 auto;
  }
</style>
