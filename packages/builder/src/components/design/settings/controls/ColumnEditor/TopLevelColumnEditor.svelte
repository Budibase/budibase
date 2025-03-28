<script lang="ts">
  import ColumnEditor from "./ColumnEditor.svelte"
  import type { TableSchema } from "@budibase/types"

  const getTopLevelSchemaFields = (schema: TableSchema) => {
    return Object.values(schema).filter(fieldSchema => !fieldSchema.nestedJSON)
  }
</script>

<ColumnEditor
  {...$$props}
  on:change
  allowCellEditing={false}
  getSchemaFields={getTopLevelSchemaFields}
/>
