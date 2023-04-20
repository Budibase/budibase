<script>
  import { _ } from "../../../../../../lang/i18n"
  import ColumnEditor from "./ColumnEditor.svelte"
</script>

<ColumnEditor
  {...$$props}
  on:change
  allowCellEditing={false}
  subject={$_(
    "components.design.settings.controls.ColumnEditor.BasicColumnEditor.Dynamic_Filter"
  )}
/>
