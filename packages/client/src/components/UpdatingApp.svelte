<script>
  import { Updating } from "@budibase/frontend-core"
  import { API } from "../api"
  import { onMount } from "svelte"
  import {
    getThemeBackgroundColor,
    getThemeClassNames,
    isDarkTheme,
  } from "@budibase/shared-core"
  import { themeStore } from "@/stores"

  async function isMigrationDone() {
    const response = await API.getMigrationStatus()
    return response.migrated
  }

  async function onMigrationDone() {
    window.location.reload()
  }

  onMount(() => {
    document.getElementById("clientAppSkeletonLoader")?.remove()
  })

  const applyGlobalThemeBackground = theme => {
    const backgroundColor = getThemeBackgroundColor(theme)
    document.documentElement.style.backgroundColor = backgroundColor
    document.documentElement.style.colorScheme = isDarkTheme(theme)
      ? "dark"
      : "light"
    if (document.body) {
      document.body.style.backgroundColor = backgroundColor
    }
  }

  $: applyGlobalThemeBackground($themeStore.theme)
</script>

<div
  id="spectrum-root"
  lang="en"
  dir="ltr"
  class="spectrum spectrum--medium {getThemeClassNames($themeStore.theme)}"
>
  <Updating {isMigrationDone} {onMigrationDone} />
</div>
