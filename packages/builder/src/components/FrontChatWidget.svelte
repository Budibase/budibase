<script>
  import { featureFlags } from "@/stores/portal"
  import { FeatureFlag } from "@budibase/types"
  import { onMount } from "svelte"

  const COMPANION_CONTAINER_ID = "companion-container"
  const COMPANION_SCRIPT_ID = "front-companion-script"
  const COMPANION_SRC = "https://companion.frontapp.com/assets/boot.bundle.js"
  const COMPANION_TOKEN = "eyJjbyI6NzQ5Nzg3OCwiY2EiOjI4Mjc0NTgyfQ"

  onMount(() => {
    if (!$featureFlags[FeatureFlag.FRONT_COMPANION]) {
      return
    }

    let container = document.getElementById(COMPANION_CONTAINER_ID)
    if (!container) {
      container = document.createElement("div")
      container.id = COMPANION_CONTAINER_ID
      document.body.appendChild(container)
    }
    container.style.position = "fixed"
    container.style.right = "16px"
    container.style.bottom = "16px"
    container.style.zIndex = "2147483000"
    container.style.pointerEvents = "auto"

    if (document.getElementById(COMPANION_SCRIPT_ID)) {
      return
    }

    const script = document.createElement("script")
    script.type = "module"
    script.id = COMPANION_SCRIPT_ID
    script.src = COMPANION_SRC
    script.dataset.containerId = COMPANION_CONTAINER_ID
    script.dataset.token = COMPANION_TOKEN
    script.dataset.autoInit = ""
    script.dataset.layout = "widget-right"
    document.body.appendChild(script)
  })
</script>
