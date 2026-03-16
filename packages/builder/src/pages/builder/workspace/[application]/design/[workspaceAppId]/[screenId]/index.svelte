<script>
  import { redirect } from "@roxi/routify"
  import { screenStore } from "@/stores/builder"

  $redirect

  $: selectedScreenId = $screenStore.selectedScreenId

  $: if (selectedScreenId) {
    $redirect(`./${selectedScreenId}-screen`)
  }
</script>
