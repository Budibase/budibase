<script context="module">
  export const FieldPermissions = {
    WRITABLE: "writable",
    READONLY: "readonly",
    HIDDEN: "hidden",
  }
</script>

<script>
  import { getContext } from "svelte"
  import { ActionButton } from "@budibase/bbui"
  import ColumnsSettingContent from "./ColumnsSettingContent.svelte"
  import DetailPopover from "@/components/common/DetailPopover.svelte"

  const { tableColumns, datasource } = getContext("grid")

  let popover

  $: anyRestricted = $tableColumns.filter(
    col => !col.visible || col.readonly
  ).length
  $: text = anyRestricted ? `Columns: ${anyRestricted} restricted` : "Columns"
  $: permissions =
    $datasource.type === "viewV2"
      ? [
          FieldPermissions.WRITABLE,
          FieldPermissions.READONLY,
          FieldPermissions.HIDDEN,
        ]
      : [FieldPermissions.WRITABLE, FieldPermissions.HIDDEN]
</script>

<DetailPopover bind:this={popover} title="Column settings">
  <svelte:fragment slot="anchor" let:open>
    <ActionButton
      icon="ColumnSettings"
      quiet
      size="M"
      on:click={popover?.open}
      selected={open || anyRestricted}
      disabled={!$tableColumns.length}
      accentColor="#674D00"
    >
      {text}
    </ActionButton>
  </svelte:fragment>
  <ColumnsSettingContent columns={$tableColumns} {permissions} />
</DetailPopover>
