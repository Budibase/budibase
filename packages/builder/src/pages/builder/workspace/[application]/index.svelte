<script lang="ts">
  import { redirect } from "@roxi/routify"
  import { screenStore, appStore } from "@/stores/builder"
  import { featureFlags } from "@/stores/portal"
  import { FeatureFlag } from "@budibase/types"
  import { onMount } from "svelte"

  $redirect

  onMount(() => {
    const { screens } = $screenStore
    const { appId } = $appStore
    if (!appId) return

    if ($featureFlags[FeatureFlag.WORKSPACE_HOME]) {
      $redirect(`./home${window.location.search}`)
      return
    }

    if (screens && screens.length > 0) {
      $redirect("./design")
    } else {
      $redirect("./data")
    }
  })
</script>
