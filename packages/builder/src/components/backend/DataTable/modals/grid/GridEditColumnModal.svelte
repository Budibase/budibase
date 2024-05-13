<script>
  import { getContext, onMount } from "svelte"
  import CreateEditColumn from "../CreateEditColumn.svelte"

  const { rows, subscribe } = getContext("grid")

  let editableColumn

  const editColumn = column => {
    editableColumn = column
  }

  onMount(() => subscribe("edit-column", editColumn))
</script>

{#if editableColumn}
  <CreateEditColumn
    field={editableColumn}
    on:updatecolumns={rows.actions.refreshData}
  />
{/if}
