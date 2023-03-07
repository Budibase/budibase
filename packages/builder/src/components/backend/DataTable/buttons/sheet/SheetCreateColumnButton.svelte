<script>
  import CreateColumnButton from "../CreateColumnButton.svelte"
  import { getContext, onMount } from "svelte"

  const { rows, columns, subscribe, filter } = getContext("sheet")

  let createColumnModal

  $: highlighted = !$filter.length && (!$rows.length || !$columns.length)

  onMount(() => subscribe("add-column", createColumnModal.show))
</script>

<CreateColumnButton
  {highlighted}
  bind:this={createColumnModal}
  on:updatecolumns={() => rows.actions.refreshSchema()}
/>
