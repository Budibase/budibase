<script>
  import { params } from "@sveltech/routify"
  import RelationshipDataTable from "components/backend/DataTable/RelationshipDataTable.svelte"
</script>

<RelationshipDataTable modelId={$params.selectedModel} recordId={$params.selectedRecord}
                       fieldName={$params.selectedField}/>
