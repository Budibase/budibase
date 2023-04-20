<script>
  import { _ } from "../../../../../../../../lang/i18n"
  import ViewDataTable from "components/backend/DataTable/ViewDataTable.svelte"
  import { views, database } from "stores/backend"

  $: selectedView = $views.selected
</script>

{#if $database._id && selectedView}
  <ViewDataTable view={selectedView} />
{:else}<i
    >{$_(
      "pages.builder.app.application.data.view.viewName.index.Create_your_first"
    )}</i
  >{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-4);
    margin-top: 2px;
  }
</style>
