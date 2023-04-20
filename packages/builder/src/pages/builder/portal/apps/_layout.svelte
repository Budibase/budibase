<script>
  import { notifications } from "@budibase/bbui"
  import { apps, templates, licensing, groups } from "stores/portal"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"

  import { _ } from "../../../../../lang/i18n."

  // Don't block loading if we've already hydrated state
  let loaded = $apps.length > 0

  onMount(async () => {
    try {
      // Always load latest
      await Promise.all([
        licensing.init(),
        templates.load(),
        groups.actions.init(),
      ])

      if ($templates?.length === 0) {
        notifications.error(
          $_("pages.builder.portal.apps._layout.problem_loading")
        )
      }

      // Go to new app page if no apps exists
      if (!$apps.length) {
        $redirect("./onboarding")
      }
    } catch (error) {
      notifications.error($_("pages.builder.portal.apps._layout.Error_loading"))
    }
    loaded = true
  })
</script>

{#if loaded}
  <slot />
{/if}
