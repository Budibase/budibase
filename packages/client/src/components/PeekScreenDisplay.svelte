<script>
  import {
    peekStore,
    dataSourceStore,
    notificationStore,
    routeStore,
  } from "../store"
  import { Modal, ModalContent, ActionButton } from "@budibase/bbui"
  import { onDestroy } from "svelte"

  let iframe
  let listenersAttached = false

  const invalidateDataSource = event => {
    const { dataSourceId } = event.detail
    dataSourceStore.actions.invalidateDataSource(dataSourceId)
  }

  const proxyNotification = event => {
    const { message, type, icon } = event.detail
    notificationStore.actions.send(message, type, icon)
  }

  const attachListeners = () => {
    // Mirror datasource invalidation to keep the parent window up to date
    iframe.contentWindow.addEventListener(
      "invalidate-datasource",
      invalidateDataSource
    )
    // Listen for a close event to close the screen peek
    iframe.contentWindow.addEventListener(
      "close-screen-modal",
      peekStore.actions.hidePeek
    )
    // Proxy notifications back to the parent window instead of iframe
    iframe.contentWindow.addEventListener("notification", proxyNotification)
  }

  const handleCancel = () => {
    peekStore.actions.hidePeek()
    iframe.contentWindow.removeEventListener(
      "invalidate-datasource",
      invalidateDataSource
    )
    iframe.contentWindow.removeEventListener(
      "close-screen-modal",
      peekStore.actions.hidePeek
    )
    iframe.contentWindow.removeEventListener("notification", proxyNotification)
  }

  const handleFullscreen = () => {
    if ($peekStore.external) {
      window.location = $peekStore.href
    } else {
      routeStore.actions.navigate($peekStore.url)
      handleCancel()
    }
  }

  $: {
    if (iframe && !listenersAttached) {
      attachListeners()
      listenersAttached = true
    } else if (!iframe) {
      listenersAttached = false
    }
  }

  onDestroy(() => {
    if (iframe) {
      handleCancel()
    }
  })
</script>

{#if $peekStore.showPeek}
  <Modal fixed on:cancel={handleCancel}>
    <div class="actions spectrum--darkest" slot="outside">
      <ActionButton size="S" quiet icon="OpenIn" on:click={handleFullscreen}>
        Full screen
      </ActionButton>
      <ActionButton size="S" quiet icon="Close" on:click={handleCancel}>
        Close
      </ActionButton>
    </div>
    <ModalContent
      showCancelButton={false}
      showConfirmButton={false}
      size="L"
      showDivider={false}
      showCloseIcon={false}
    >
      <iframe title="Peek" bind:this={iframe} src={$peekStore.href} />
    </ModalContent>
  </Modal>
{/if}

<style>
  iframe {
    margin: -40px;
    border: none;
    width: calc(100% + 80px);
    height: 640px;
    max-height: calc(100vh - 120px);
    transition: width 1s ease, height 1s ease, top 1s ease, left 1s ease;
    border-radius: var(--spectrum-global-dimension-size-100);
  }

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    top: 0;
    width: 640px;
    max-width: 100%;
  }
</style>
