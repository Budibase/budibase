<script>
  import { params } from "@roxi/routify"
  import RelationshipDataTable from "components/backend/DataTable/RelationshipDataTable.svelte"
</script>

<RelationshipDataTable
  tableId={$params.selectedTable}
  rowId={$params.selectedRow}
  fieldName={decodeURI($params.selectedField)} />
