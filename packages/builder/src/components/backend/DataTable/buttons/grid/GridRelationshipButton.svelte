<script>
import { getContext } from "svelte"
import ExistingRelationshipButton from "../ExistingRelationshipButton.svelte"

const { definition, rows } = getContext("grid")
</script>

{#if $definition}
  <ExistingRelationshipButton
    table={$definition}
    on:updatecolumns={() => rows.actions.refreshData()}
  />
{/if}
