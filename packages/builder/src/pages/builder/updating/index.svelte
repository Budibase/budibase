<script>
  import Spinner from "components/common/Spinner.svelte"
  import { API } from "api"

  setInterval(async () => {
    const response = await API.get({ url: "/api/migrations/status" })
    if (!response.migrated) {
      return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const returnUrl = urlParams.get("returnUrl")

    window.location = returnUrl
  }, 1000)
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
