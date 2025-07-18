<script>
  import { Button, Body } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "@/api"
  import { appStore } from "@/stores"

  let token = ""

  $: recaptchaKey = $appStore.recaptchaKey

  onMount(() => {
    window.grecaptcha.render("recaptcha-container", {
      sitekey: recaptchaKey,
      callback: response => {
        token = response
      },
    })
  })

  async function handleSubmit(event) {
    event.preventDefault()
    if (!token) {
      throw new Error("No token provided")
    }
    const { verified } = await API.recaptcha.verify(token)
    if (verified) {
      location.reload()
    }
  }
</script>

<div class="wrapper">
  <Body>Human verification step required to continue.</Body>
  <div id="recaptcha-container" />
  <div>
    <Button cta on:click={handleSubmit}>Send</Button>
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    align-items: center;
  }
</style>
