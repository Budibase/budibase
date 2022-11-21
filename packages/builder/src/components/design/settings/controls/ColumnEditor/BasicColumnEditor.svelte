<script>
  import ColumnEditor from "./ColumnEditor.svelte"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()
</script>

<ColumnEditor
  {...$$props}
  on:change={e => dispatch("change", e.detail)}
  allowCellEditing={false}
  subject="Dynamic Filter"
/>
