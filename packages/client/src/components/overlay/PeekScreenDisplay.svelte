<script>
  import {
    peekStore,
    dataSourceStore,
    notificationStore,
    routeStore,
    stateStore,
  } from "stores"
  import { Modal, ModalContent, ActionButton } from "@budibase/bbui"
  import { onDestroy } from "svelte"

  const MessageTypes = {
    NOTIFICATION: "notification",
    CLOSE_SCREEN_MODAL: "close-screen-modal",
    INVALIDATE_DATASOURCE: "invalidate-datasource",
    UPDATE_STATE: "update-state",
  }

  let iframe
  let listenersAttached = false

  const proxyInvalidation = event => {
    const { dataSourceId, options } = event.detail
    dataSourceStore.actions.invalidateDataSource(dataSourceId, options)
  }

  const proxyNotification = event => {
    const { message, type, icon, autoDismiss } = event.detail
    notificationStore.actions.send(message, type, icon, autoDismiss)
  }

  const proxyStateUpdate = event => {
    const { type, key, value, persist } = event.detail
    if (type === "set") {
      stateStore.actions.setValue(key, value, persist)
    } else if (type === "delete") {
      stateStore.actions.deleteValue(key)
    }
  }

  function receiveMessage(message) {
    const handlers = {
      [MessageTypes.NOTIFICATION]: () => {
        proxyNotification(message.data)
      },
      [MessageTypes.CLOSE_SCREEN_MODAL]: () => {
        peekStore.actions.hidePeek()
        if (message.data?.url) {
          routeStore.actions.navigate(message.data.url)
        }
      },
      [MessageTypes.INVALIDATE_DATASOURCE]: () => {
        proxyInvalidation(message.data)
      },
      [MessageTypes.UPDATE_STATE]: () => {
        proxyStateUpdate(message.data)
      },
    }

    const messageHandler = handlers[message.data.type]
    if (messageHandler) {
      messageHandler(message)
    } else {
      console.warn("Unknown event type", message?.data?.type)
    }
  }

  const attachListeners = () => {
    // Mirror datasource invalidation to keep the parent window up to date
    window.addEventListener("message", receiveMessage)
  }

  const handleCancel = () => {
    peekStore.actions.hidePeek()
    window.removeEventListener("message", receiveMessage)
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
