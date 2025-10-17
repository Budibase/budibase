<script>
  import { Updating } from "@budibase/frontend-core"
  import { redirect, params } from "@roxi/routify"

  import { API } from "@/api"

  // Workaround for Routify 2 + Svelte 5 compatibility
  // See: https://github.com/roxiness/routify/issues/563
  $params
  $redirect

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
