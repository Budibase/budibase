<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover } from "@budibase/bbui"
  import ColumnsSettingContent from "./ColumnsSettingContent.svelte"
  import { FieldPermissions } from "../../../constants"

  export let allowViewReadonlyColumns = false

  const { columns, datasource } = getContext("grid")

  let open = false
  let anchor

  $: anyRestricted = $columns.filter(col => !col.visible || col.readonly).length
  $: text = anyRestricted ? `Columns (${anyRestricted} restricted)` : "Columns"

  $: permissions =
    $datasource.type === "viewV2"
      ? [
          FieldPermissions.WRITABLE,
          FieldPermissions.READONLY,
          FieldPermissions.HIDDEN,
        ]
      : [FieldPermissions.WRITABLE, FieldPermissions.HIDDEN]
  $: disabledPermissions = allowViewReadonlyColumns
    ? []
    : [FieldPermissions.READONLY]
</script>

<div bind:this={anchor}>
  <ActionButton
    icon="ColumnSettings"
    quiet
    size="M"
    on:click={() => (open = !open)}
    selected={open || anyRestricted}
    disabled={!$columns.length}
  >
    {text}
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <ColumnsSettingContent
    columns={$columns}
    {permissions}
    {disabledPermissions}
  />
</Popover>
