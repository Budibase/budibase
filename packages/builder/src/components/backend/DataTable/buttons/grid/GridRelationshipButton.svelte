<script>
  import ExistingRelationshipButton from "../ExistingRelationshipButton.svelte"
  import { getContext } from "svelte"

  const { definition, rows } = getContext("grid")
</script>

{#if $definition}
  <ExistingRelationshipButton
    table={$definition}
    on:updatecolumns={() => rows.actions.refreshData()}
  />
{/if}
