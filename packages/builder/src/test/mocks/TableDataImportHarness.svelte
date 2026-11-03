<script lang="ts">
  import type { Row, TableSchema } from "@budibase/types"
  import TableDataImport from "@/components/backend/TableNavigator/TableDataImport.svelte"

  let rows: Row[] = $state([])
  let schema: TableSchema = $state({})
  let allValid = $state(true)
  let displayColumn: string | null = $state(null)
</script>

<TableDataImport bind:rows bind:schema bind:allValid bind:displayColumn />

<output data-testid="bound-rows">{JSON.stringify(rows)}</output>
<output data-testid="bound-schema">{JSON.stringify(schema)}</output>
<output data-testid="bound-all-valid">{JSON.stringify(allValid)}</output>
<output data-testid="bound-display-column"
  >{JSON.stringify(displayColumn)}</output
>
