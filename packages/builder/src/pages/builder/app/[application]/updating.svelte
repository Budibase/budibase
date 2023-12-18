<script>
  import Spinner from "components/common/Spinner.svelte"
  import { redirect, params } from "@roxi/routify"

  import { API } from "api"

  const timeoutMs = 60000 // 1 minute
  const loadTime = Date.now()

  async function checkMigrationsFinished() {
    setTimeout(async () => {
      const response = await API.getMigrationStatus()
      if (!response.migrated) {
        if (loadTime + timeoutMs > Date.now()) {
          return checkMigrationsFinished()
        }

        return migrationTimeout()
      }

      // For some reason routify params is not stripping the ? properly, so we need to check both with and without ?
      const returnUrl = $params.returnUrl || $params["?returnUrl"]
      $redirect(returnUrl)
    }, 1000)
  }

  checkMigrationsFinished()

  function migrationTimeout() {
    // TODO
    alert("Something went wrong 💀")
  }
</script>

<div class="loading">
  <Spinner size="20" />
</div>

<style>
  .loading {
    display: flex;
    justify-content: center;
  }
</style>
