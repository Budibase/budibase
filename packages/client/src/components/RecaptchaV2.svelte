<script lang="ts">
  import { Button, Body, notifications } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { API } from "@/api"
  import { appStore } from "@/stores"
  import {
    resolveTranslationGroup,
    resolveWorkspaceTranslations,
  } from "@budibase/shared-core"

  let token: string = ""

  $: recaptchaKey = $appStore.recaptchaKey
  $: translationOverrides = resolveWorkspaceTranslations(
    $appStore.application?.translationOverrides
  )
  $: recaptchaLabels = resolveTranslationGroup(
    "recaptcha",
    translationOverrides
  )

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
      notifications.error(recaptchaLabels.error)
    }
  }
</script>

<div class="wrapper">
  <Body>{recaptchaLabels.prompt}</Body>
  <div id="recaptcha-container" />
  <div>
    <Button cta on:click={handleSubmit}>{recaptchaLabels.submit}</Button>
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
