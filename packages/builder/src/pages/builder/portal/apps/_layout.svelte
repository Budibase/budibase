<script>
  import { notifications } from "@budibase/bbui"
  import { apps, templates, licensing } from "stores/portal"
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"

  let loaded = false

  onMount(async () => {
    try {
      // Always load latest
      await apps.load()
      await licensing.init()
      await templates.load()

      if ($templates?.length === 0) {
        notifications.error("There was a problem loading quick start templates")
      }

      // Go to new app page if no apps exists
      if (!$apps.length) {
        $goto("./create")
      }
    } catch (error) {
      notifications.error("Error loading apps and templates")
    }
    loaded = true
  })
</script>

{#if loaded}
  <slot />
{/if}
