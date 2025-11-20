<script>
  import { Updating } from "@budibase/frontend-core"
  import { redirect, params } from "@roxi/routify"
  import { get } from "svelte/store"

  import { API } from "@/api"
  import { appStore } from "@/stores/builder"

  export let application

  // Set appId immediately so API calls have the correct context
  // Only update if it's different to avoid unnecessary re-renders
  if (get(appStore).appId !== application) {
    appStore.update(state => ({ ...state, appId: application }))
  }

  async function isMigrationDone() {
    const response = await API.getMigrationStatus()
    return response.migrated
  }

  async function onMigrationDone() {
    // For some reason routify params is not stripping the ? properly, so we need to check both with and without ?
    const returnUrl = $params.returnUrl || $params["?returnUrl"]
    $redirect(returnUrl)
  }
</script>

<Updating {isMigrationDone} {onMigrationDone} />
