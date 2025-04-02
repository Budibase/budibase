<script>
  import { onMount } from "svelte"
  import { appStore } from "@/stores"

  const STORAGE_KEY_PREFIX = "pwa-install-declined"

  let showButton = false

  function checkForDeferredPrompt() {
    const appId = $appStore.appId
    const storageKey = `${STORAGE_KEY_PREFIX}-${appId}`

    if (localStorage.getItem(storageKey) === "true") {
      return false
    }

    if (window.deferredPwaPrompt) {
      showButton = true
      return true
    }
    return false
  }

  async function installPWA() {
    if (!window.deferredPwaPrompt) return

    window.deferredPwaPrompt.prompt()
    const { outcome } = await window.deferredPwaPrompt.userChoice

    if (outcome === "accepted") {
      showButton = false
    } else if (outcome === "dismissed") {
      const appId = $appStore.appId
      const storageKey = `${STORAGE_KEY_PREFIX}-${appId}`
      localStorage.setItem(storageKey, "true")
      showButton = false
    }

    window.deferredPwaPrompt = null
  }

  onMount(() => {
    checkForDeferredPrompt()
  })
</script>

{#if showButton}
  <div class="install-prompt">
    <button class="install-button" on:click={installPWA}>Install App</button>
  </div>
{/if}

<style>
  .install-prompt {
    position: fixed;
    bottom: 5px;
    left: 20px;
    z-index: 1000;
    display: flex;
    align-items: center;
  }

  .install-button {
    padding: 10px 15px;
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .install-button:hover {
    background-color: #4338ca;
  }
</style>
