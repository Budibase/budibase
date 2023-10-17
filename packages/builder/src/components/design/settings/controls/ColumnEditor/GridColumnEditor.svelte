<script>
  import ColumnEditor from "./ColumnEditor.svelte"
</script>

<ColumnEditor
  {...$$props}
  on:change
  allowCellEditing={false}
  allowReorder={false}
/>
