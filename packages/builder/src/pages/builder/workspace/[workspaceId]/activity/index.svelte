<script lang="ts">
  import { featureFlags } from "@/stores/portal"
  import { redirect } from "@roxi/routify"
  import { getEnabledActivityTabs } from "./activityTabs"

  $redirect

  const [firstTab] = getEnabledActivityTabs($featureFlags)
  $redirect(firstTab?.url ?? "../home")
</script>
