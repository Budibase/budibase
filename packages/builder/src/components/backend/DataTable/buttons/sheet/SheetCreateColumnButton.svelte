<script>
  import CreateColumnButton from "../CreateColumnButton.svelte"
  import { getContext, onMount } from "svelte"

  const { rows, columns, subscribe, filter, loaded } = getContext("sheet")

  let createColumnModal

  $: hasCols = !$loaded || $columns.length
  $: hasRows = !$loaded || $filter.length || $rows.length
  $: highlighted = !hasRows || !hasCols

  onMount(() => subscribe("add-column", createColumnModal.show))
</script>

<CreateColumnButton
  {highlighted}
  bind:this={createColumnModal}
  on:updatecolumns={() => rows.actions.refreshSchema()}
/>
