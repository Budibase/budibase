<script>
  import { peekStore, dataSourceStore, routeStore } from "../store"
  import { Modal, ModalContent, Button } from "@budibase/bbui"
  import { onDestroy } from "svelte"

  let iframe
  let fullscreen = false

  const invalidateDataSource = event => {
    const { dataSourceId } = event.detail
    dataSourceStore.actions.invalidateDataSource(dataSourceId)
  }

  const handleCancel = () => {
    iframe.contentWindow.removeEventListener(
      "invalidate-datasource",
      invalidateDataSource
    )
    peekStore.actions.hidePeek()
    fullscreen = false
  }

  const navigate = () => {
    if ($peekStore.external) {
      window.location = $peekStore.href
    } else {
      routeStore.actions.navigate($peekStore.url)
    }
    peekStore.actions.hidePeek()
  }

  $: {
    if (iframe) {
      iframe.contentWindow.addEventListener(
        "invalidate-datasource",
        invalidateDataSource
      )
    }
  }

  onDestroy(() => {
    if (iframe) {
      iframe.contentWindow.removeEventListener(
        "invalidate-datasource",
        invalidateDataSource
      )
    }
  })
</script>

{#if $peekStore.showPeek}
  <Modal fixed on:cancel={handleCancel}>
    <ModalContent
      showCancelButton={false}
      showConfirmButton={false}
      size="XL"
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
    transition: width 1s ease, height 1s ease, top 1s ease, left 1s ease;
    border-radius: var(--spectrum-global-dimension-size-100);
  }

  @media (max-width: 600px) {
    iframe {
      max-height: calc(100vh - 80px);
    }
  }
</style>
