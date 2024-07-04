<script>
import { notifications } from "@budibase/bbui"
import { email } from "stores/portal"
import { onMount } from "svelte"

onMount(async () => {
  try {
    await email.templates.fetch()
  } catch (error) {
    notifications.error("Error fetching email templates")
  }
})
</script>

<slot />
