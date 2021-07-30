<script>
  import { peekStore, dataSourceStore, routeStore } from "../store"
  import { Modal, ModalContent, Button, Divider, Layout } from "@budibase/bbui"
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
      cancelText="Close"
      showConfirmButton={false}
      size="XL"
      title="Screen Peek"
      showDivider={false}
    >
      <iframe title="Peek" bind:this={iframe} src={$peekStore.href} />
      <div slot="footer">
        <Button cta on:click={navigate}>Full screen</Button>
      </div>
    </ModalContent>
  </Modal>
{/if}

<style>
  iframe {
    margin: 0 -40px;
    border: none;
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    border-top: 1px solid var(--spectrum-global-color-gray-300);
    width: calc(100% + 80px);
    height: 640px;
    transition: width 1s ease, height 1s ease, top 1s ease, left 1s ease;
  }
</style>
