<script>
  import { params } from "@roxi/routify"
  import RelationshipDataTable from "components/backend/DataTable/RelationshipDataTable.svelte"
</script>

<RelationshipDataTable
  tableId={$params.tableId}
  rowId={$params.rowId}
  fieldName={decodeURI($params.field)}
/>
