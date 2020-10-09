<script>
  import { params } from "@sveltech/routify"
  import RelationshipDataTable from "components/backend/DataTable/RelationshipDataTable.svelte"
</script>

<RelationshipDataTable
  tableId={$params.selectedTable}
  recordId={$params.selectedRecord}
  fieldName={decodeURI($params.selectedField)} />
