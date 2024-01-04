<script>
  import { API } from "../api"

  const timeoutMs = 60000 // 1 minute
  const loadTime = Date.now()

  let timedOut = false

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
    timedOut = true
  }
</script>

<div class="loading">
  {#if !timedOut}
    <p class="loading-message">
      🛠️ We are updating the system. <br />Please wait, we will be back in a
      second!
    </p>
  {:else}
    <p class="loading-message timeout">
      An error occurred. Please try again later.
    </p>
  {/if}
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
  .timeout {
    color: rgb(196, 46, 46);
  }
</style>
