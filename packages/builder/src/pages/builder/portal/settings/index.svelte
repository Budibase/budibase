<script>
  import { redirect } from "@roxi/routify"
  import { featureFlags } from "stores/portal"

  if ($featureFlags.AI_CUSTOM_CONFIGS) {
    $redirect("./ai")
  } else {
    $redirect("./auth")
  }
</script>
