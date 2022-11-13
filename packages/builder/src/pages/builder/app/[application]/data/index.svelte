<script>
  import { redirect } from "@roxi/routify"
  import { onMount } from "svelte"
  import { admin } from "stores/portal"
  import CreateDatasourceModal from "components/backend/DatasourceNavigator/modals/CreateDatasourceModal.svelte"
  import { datasources } from "stores/backend"

  let modal
  $: setupComplete =
    $datasources.list.find(x => (x._id = "bb_internal"))?.entities?.length >
      1 || $datasources.list.length > 1

  onMount(() => {
    if (!setupComplete && !$admin.isDev) {
      modal.show()
    } else {
      $redirect("./table")
    }
  })
</script>

<CreateDatasourceModal bind:modal />
