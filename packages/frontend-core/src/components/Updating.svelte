<script>
  export let isMigrationDone
  export let onMigrationDone
  export let timeoutSeconds = 60 // 1 minute

  let timedOut = false

  async function checkMigrationsFinished() {
    let totalWaitMs = 0
    while (true) {
      const waitForMs = 5000 + Math.random() * 5000
      await new Promise(resolve => setTimeout(resolve, waitForMs))
      totalWaitMs += waitForMs

      const isMigrated = await isMigrationDone()
      if (isMigrated) {
        onMigrationDone()
        return
      }

      if (totalWaitMs > timeoutSeconds * 1000) {
        timedOut = true
        return
      }
    }
  }

  checkMigrationsFinished()
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
      <br />
      Checkout the
      <a href="https://docs.budibase.com/docs/app-migrations" target="_blank"
        >documentation</a
      > on app migrations.
    {:else}
      An error occurred, please try again later.
      <br />
      Contact
      <a href="https://budibase.com/support/" target="_blank">support</a> if the
      issue persists.
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

  .subtext a {
    color: var(--grey-7);
    font-weight: 700;
  }
</style>
