<script>
  import ExistingRelationshipButton from "../ExistingRelationshipButton.svelte"
  import { getContext } from "svelte"

  const { table, rows } = getContext("grid")
</script>

{#if $table}
  <ExistingRelationshipButton
    table={$table}
    on:updatecolumns={() => rows.actions.refreshData()}
  />
{/if}
