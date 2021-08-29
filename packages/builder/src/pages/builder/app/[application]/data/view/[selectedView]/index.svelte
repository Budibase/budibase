<script>
  import ViewDataTable from "components/backend/DataTable/ViewDataTable.svelte"
  import { views, database } from "stores/backend"
  import { _ as t } from "svelte-i18n"

  $: selectedView = $views.selected
</script>

{#if $database._id && selectedView}
  <ViewDataTable view={selectedView} />
{:else}<i>{ $t('create-your-first-table-to-start-building') }</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-4);
    margin-top: 2px;
  }
</style>
