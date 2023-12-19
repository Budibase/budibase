<script>
  import { API } from "../api"

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

      window.location.reload()
    }, 1000)
  }

  checkMigrationsFinished()

  function migrationTimeout() {
    // TODO
    alert("Something went wrong 💀")
  }
</script>

<div class="loading">Updating the system...</div>

<style>
  .loading {
    display: flex;
    justify-content: center;
  }
</style>
