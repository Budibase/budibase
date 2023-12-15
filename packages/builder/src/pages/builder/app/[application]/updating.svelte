<script>
  import Spinner from "components/common/Spinner.svelte"
  import { redirect } from "@roxi/routify"

  import { API } from "api"

  let timeout
  async function checkMigrationsFinished() {
    timeout = setTimeout(async () => {
      const response = await API.get({ url: "/api/migrations/status" })
      if (!response.migrated) {
        checkMigrationsFinished()
        return
      }

      const urlParams = new URLSearchParams(window.location.search)
      const returnUrl = urlParams.get("returnUrl")

      $redirect(returnUrl)
    }, 1000)
  }

  checkMigrationsFinished()

  setTimeout(() => {
    clearTimeout(timeout)
    // TODO
    alert("Something went wrong 💀")
  }, 60000)
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
