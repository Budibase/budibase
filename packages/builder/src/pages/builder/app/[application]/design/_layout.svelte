<script>
  import { store } from "builderStore"
  import { redirect } from "@roxi/routify"

  // Prevent access for other users than the lock holder
  $: {
    if (!$store.hasLock) {
      $redirect("../data")
    }
  }
</script>

<!-- routify:options index=2 -->
<slot />
