<script>
  import { onMount } from "svelte"
  import { appStore, featuresStore } from "@/stores"

  const STORAGE_KEY_PREFIX = "pwa-install-declined"

  let showButton = false
  $: pwaEnabled = $featuresStore.pwaEnabled
  function checkForDeferredPrompt() {
    if (!pwaEnabled) {
      return false
    }

    const appId = $appStore.appId
    const storageKey = `${STORAGE_KEY_PREFIX}-${appId}`

    if (localStorage.getItem(storageKey) === "true") {
      return false
    }

    if (typeof window !== "undefined" && window.deferredPwaPrompt) {
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

  onMount(async () => {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/app/service-worker.js", {
          scope: "/app/",
        })
      } catch (error) {
        console.error("Service worker registration failed:", error)
      }
    }

    checkForDeferredPrompt()
  })
</script>

{#if showButton}
  <div class="install-prompt">
    <button class="openMenu" on:click={installPWA}>Install app</button>
  </div>
{/if}

<style>
  .install-prompt {
    position: fixed;
    bottom: 5px;
    right: 10px;
    z-index: 1000;
  }

  .openMenu {
    cursor: pointer;
    background-color: var(--bb-indigo);
    border-radius: 100px;
    color: white;
    border: none;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 18px;
    transition: background-color 130ms ease-out;
  }

  .openMenu:hover {
    background-color: var(--bb-indigo-light);
  }
</style>
