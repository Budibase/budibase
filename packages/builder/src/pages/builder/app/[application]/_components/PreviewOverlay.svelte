<script>
  import { onMount } from "svelte"
  import { fade, fly } from "svelte/transition"
  import { previewStore, selectedAppUrls, themeStore } from "@/stores/builder"
  import { ProgressCircle } from "@budibase/bbui"

  $: src = $selectedAppUrls.previewUrl

  const close = () => {
    previewStore.showPreview(false)
  }

  onMount(() => {
    window.isBuilder = true
    window.closePreview = () => {
      previewStore.showPreview(false)
    }
  })

  $: window.previewFullscreenUrl = src
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="preview-overlay"
  transition:fade={{ duration: 260 }}
  on:click|self={close}
>
  <div
    class="container spectrum {$themeStore.theme}"
    transition:fly={{ duration: 260, y: 130 }}
  >
    <div class="header placeholder" />
    <div class="loading placeholder">
      <ProgressCircle />
    </div>
    <iframe title="Budibase App Preview" {src} />
  </div>
</div>

<style>
  .preview-overlay {
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 9000;
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: stretch;
    padding: 48px;
  }
  .container {
    flex: 1 1 auto;
    background: var(--spectrum-global-color-gray-75);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 80px 0 rgba(0, 0, 0, 0.5);
  }
  iframe {
    position: absolute;
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
    z-index: 1;
  }
  .header {
    height: 60px;
    width: 100%;
    background: black;
    top: 0;
    position: absolute;
  }
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
  .placeholder {
    z-index: 0;
  }
</style>
