<script>
  import { goto } from "@roxi/routify"
  import { onMount } from "svelte"
  import CreateDatasourceModal from "components/backend/DatasourceNavigator/modals/CreateDatasourceModal.svelte"
  import { datasources } from "stores/backend"

  let modal
  $: setupComplete =
    $datasources.list.find(x => (x._id = "bb_internal")).entities.length > 1 ||
    $datasources.list.length >= 1
  $: console.log($datasources.list.length >= 1)
  $: console.log(
    $datasources.list.find(x => (x._id = "bb_internal")).entities.length > 1
  )
  onMount(() => {
    if (!setupComplete) {
      modal.show()
    } else {
      $goto("./table")
    }
  })
</script>

<CreateDatasourceModal bind:modal />
<!-- routify:options index=false -->
