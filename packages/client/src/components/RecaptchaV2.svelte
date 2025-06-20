<script>
  import { Button } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "@/api"
  import { appStore } from "@/stores"

  let widgetId
  let token = ""

  $: recaptchaKey = $appStore.recaptchaKey

  onMount(() => {
    widgetId = window.grecaptcha.render('recaptcha-container', {
      sitekey: recaptchaKey,
      callback: (response) => {
        token = response
      }
    });
  })

  async function handleSubmit(event) {
    event.preventDefault()
    if (!token) {
      throw new Error("No token provided")
    }
    await API.recaptcha.verify(token)
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div id="recaptcha-container"></div>
  <Button>Send</Button>
  <button on:click={handleSubmit}>Send</button>
</form>
