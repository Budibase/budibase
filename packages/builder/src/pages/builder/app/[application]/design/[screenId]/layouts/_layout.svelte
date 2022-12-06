<script>
  import { store } from "builderStore"
  import { redirect } from "@roxi/routify"

  $: {
    if (!$store.layouts?.length) {
      $redirect("../")
    }
  }
</script>

<slot />
