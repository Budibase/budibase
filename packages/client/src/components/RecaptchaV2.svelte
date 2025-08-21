<script lang="ts">
  import { Button, Body, notifications } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "@/api"
  import { appStore } from "@/stores"

  let token: string = ""

  $: recaptchaKey = $appStore.recaptchaKey

  onMount(() => {
    // need to cast this, there is no easy way to make Typescript aware of this
    // being added to the window function
    const captchaWindow: { grecaptcha: { render: Function } } = window as any
    captchaWindow.grecaptcha.render("recaptcha-container", {
      sitekey: recaptchaKey,
      callback: (response: string) => {
        token = response
      },
    })
  })

  async function handleSubmit(event: Event) {
    event.preventDefault()
    if (!token) {
      throw new Error("No token provided")
    }
    const { verified } = await API.recaptcha.verify(token)
    if (verified) {
      location.reload()
    } else {
      notifications.error("Recaptcha verification failed, please try again")
    }
  }
</script>

<div class="wrapper">
  <Body>Human verification step required to continue.</Body>
  <div id="recaptcha-container" />
  <div>
    <Button cta on:click={handleSubmit}>Submit</Button>
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
