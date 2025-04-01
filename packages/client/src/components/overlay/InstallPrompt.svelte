<script>
  import { onMount } from "svelte"
  let deferredPrompt
  let showButton = false

  onMount(() => {
    window.addEventListener("beforeinstallprompt", e => {
      console.log("[PWA] beforeinstallprompt fired!", e)
      e.preventDefault()
      deferredPrompt = e
      showButton = true
    })
  })

  async function installPWA() {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      showButton = false
    }
    deferredPrompt = null
  }
</script>

{#if showButton}
  <button class="install-button" on:click={installPWA}> Install App </button>
{/if}

<style>
  .install-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }
</style>
