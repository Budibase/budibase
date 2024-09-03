<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover } from "@budibase/bbui"
  import ColumnsSettingContent from "./ColumnsSettingContent.svelte"
  import { licensing } from "stores/portal"

  const { columns } = getContext("grid")

  let open = false
  let anchor

  $: anyRestricted = $columns.filter(col => !col.visible || col.readonly).length
  $: text = anyRestricted ? `Columns: ${anyRestricted} restricted` : "Columns"
</script>

<div bind:this={anchor}>
  <ActionButton
    icon="ColumnSettings"
    quiet
    size="M"
    on:click={() => (open = !open)}
    selected={open || anyRestricted}
    disabled={!$columns.length}
    accentColor="#674D00"
  >
    {text}
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <ColumnsSettingContent
    columns={$columns}
    allowViewReadonlyColumns={$licensing.isViewReadonlyColumnsEnabled}
  />
</Popover>
