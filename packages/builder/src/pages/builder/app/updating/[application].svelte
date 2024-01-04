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
  <p class="loading-message">
    🛠️ We are updating the system. <br />Please wait, we will be back in a
    second!
  </p>

  <Spinner size="20" />
</div>

<style>
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: var(--spacing-xl);
    height: 100vh;
    margin: 0;
  }
  .loading-message {
    text-align: center;
    font-size: 18px;
  }
</style>
