<script>
  import { API } from "api"

  export let onMigrationDone
  export let timeoutSeconds = 3 * 60 // 3 minutes

  const loadTime = Date.now()
  let timedOut = false

  async function checkMigrationsFinished() {
    setTimeout(async () => {
      const response = await API.getMigrationStatus()

      const timeoutMs = timeoutSeconds * 1000
      if (!response.migrated) {
        if (loadTime + timeoutMs > Date.now()) {
          return checkMigrationsFinished()
        }

        return migrationTimeout()
      }

      onMigrationDone()
    }, 1000)
  }

  checkMigrationsFinished()

  function migrationTimeout() {
    timedOut = true
  }
</script>

<div class="loading" class:timeout={timedOut}>
  <span class="header">
    {#if !timedOut}
      System update
    {:else}
      Something went wrong!
    {/if}
  </span>
  <span class="subtext">
    {#if !timedOut}
      Please wait and we will be back in a second!
    {:else}
      An error occurred, please try again later.
      <br />
      Contact support if the issue persists.
    {/if}</span
  >
</div>

<style>
  .loading {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: var(--spacing-l);
    height: 100vh;
    text-align: center;
    font-size: 18px;
  }
  .header {
    font-weight: 700;
  }
  .timeout .header {
    color: rgb(196, 46, 46);
  }
  .subtext {
    font-size: 16px;
    color: var(--grey-7);
  }
</style>
