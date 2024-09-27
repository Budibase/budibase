<script>
  import { redirect } from "@roxi/routify"
  import { licensing } from "stores/portal"

  if ($licensing.customAIConfigsEnabled) {
    $redirect("./ai")
  } else {
    $redirect("./auth")
  }
</script>
