<script>
  import { store } from "builderStore"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"

  onMount(() => {
    if ($store.layouts?.length) {
      $redirect(`./${$store.layouts[0]._id}`)
    } else {
      $redirect("../")
    }
  })
</script>
