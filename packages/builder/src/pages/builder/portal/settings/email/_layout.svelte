<script>
  import { onMount } from "svelte"
  import { email } from "stores/portal"
  import { notifications } from "@budibase/bbui"

  import { _ } from "../../../../../../lang/i18n"

  onMount(async () => {
    try {
      await email.templates.fetch()
    } catch (error) {
      notifications.error(
        $_("pages.builder.portal.settings.email._layout.Error_fetching")
      )
    }
  })
</script>

<slot />
