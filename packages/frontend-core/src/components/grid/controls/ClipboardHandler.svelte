<script>
  import { Modal, ModalContent, ProgressBar } from "@budibase/bbui"
  import { getContext, onMount } from "svelte"
  import { sleep } from "../../../utils/utils"
  import { get } from "svelte/store"

  const {
    clipboard,
    subscribe,
    copyAllowed,
    pasteAllowed,
    selectedCellCount,
    focusedCellAPI,
  } = getContext("grid")
  const duration = 260

  let modal
  let progressPercentage = 0
  let processing = false

  const handleCopyRequest = () => {
    if (!$copyAllowed) {
      return
    }
    clipboard.actions.copy()
  }

  const handlePasteRequest = async () => {
    // If a cell is active then let the native paste action take over
    if (get(focusedCellAPI)?.isActive()) {
      return
    }
    progressPercentage = 0
    if (!$pasteAllowed) {
      return
    }

    // Prompt if paste will update multiple cells
    const multiCellPaste = $selectedCellCount > 1
    const prompt = $clipboard.multiCellCopy || multiCellPaste
    if (prompt) {
      modal?.show()
    } else {
      clipboard.actions.paste()
    }
  }

  const performBulkPaste = async () => {
    processing = true
    await clipboard.actions.paste(progress => {
      progressPercentage = progress * 100
    })
    await sleep(duration)
    processing = false
  }

  onMount(() => subscribe("copy", handleCopyRequest))
  onMount(() => subscribe("paste", handlePasteRequest))
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Confirm paste"
    confirmText="Continue"
    cancelText="Cancel"
    onConfirm={performBulkPaste}
    size="M"
  >
    Are you sure you want to paste? This will update multiple values.
    {#if processing}
      <ProgressBar
        size="L"
        value={progressPercentage}
        {duration}
        width="100%"
      />
    {/if}
  </ModalContent>
</Modal>
