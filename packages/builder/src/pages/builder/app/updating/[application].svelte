<script>
  import { redirect, params } from "@roxi/routify"

  import { API } from "api"

  const timeoutMs = 180000 // 3 minutes
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

      // For some reason routify params is not stripping the ? properly, so we need to check both with and without ?
      const returnUrl = $params.returnUrl || $params["?returnUrl"]
      $redirect(returnUrl)
    }, 1000)
  }

  checkMigrationsFinished()

  function migrationTimeout() {
    timedOut = true
  }

  $: text = !timedOut ? "System update" : "Something went wrong!"
  $: subtext = !timedOut
    ? "Please wait and we will be back in a second!"
    : "An error occurred, please try again later"
</script>

<div class="loading" class:timeout={timedOut}>
  <span class="header">{text}</span>
  <span class="subtext">{subtext}</span>
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
