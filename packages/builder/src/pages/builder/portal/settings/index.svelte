<script>
  import { redirect } from "@roxi/routify"
  import { licensing, featureFlags } from "stores/portal"

  if ($featureFlags.AI_CUSTOM_CONFIGS && $licensing.customAIConfigsEnabled) {
    $redirect("./ai")
  } else {
    $redirect("./auth")
  }
</script>
