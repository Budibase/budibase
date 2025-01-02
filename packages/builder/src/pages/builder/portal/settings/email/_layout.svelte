<script>
  import { onMount } from "svelte"
  import { email } from "@/stores/portal"
  import { notifications } from "@budibase/bbui"

  onMount(async () => {
    try {
      await email.fetchTemplates()
    } catch (error) {
      notifications.error("Error fetching email templates")
    }
  })
</script>

<slot />
