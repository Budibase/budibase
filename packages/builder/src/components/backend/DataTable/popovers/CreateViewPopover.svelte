<script>
  import { Button, Input, notifications, Heading } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { views as viewsStore } from "stores/backend"
  import { tables } from "stores/backend"
  import analytics from "analytics"

  export let onClosed

  let name
  let field

  $: views = $tables.list.flatMap(table => Object.keys(table.views || {}))

  function saveView() {
    if (views.includes(name)) {
      notifications.error(`View exists with name ${name}.`)
      return
    }
    viewsStore.save({
      name,
      tableId: $tables.selected._id,
      field,
    })
    notifications.success(`View ${name} created`)
    onClosed()
    analytics.captureEvent("View Created", { name })
    $goto(`../../view/${name}`)
  }
</script>

<div class="actions">
  <Heading s>Create View</Heading>
  <Input label="View Name" thin bind:value={name} />
  <div class="footer">
    <Button secondary on:click={onClosed}>Cancel</Button>
    <Button cta on:click={saveView}>Save View</Button>
  </div>
</div>

<style>
  h5 {
    margin: 0;
    font-weight: 500;
  }

  .actions {
    display: grid;
    grid-gap: var(--spacing-xl);
    padding: var(--spacing-xl);
    width: 240px;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }
</style>
