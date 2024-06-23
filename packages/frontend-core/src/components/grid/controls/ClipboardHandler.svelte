<script>
  import { Modal, ModalContent, ProgressBar } from "@budibase/bbui"
  import { getContext, onMount } from "svelte"
  import { sleep } from "../../../utils/utils"

  const { clipboard, subscribe, copyAllowed, pasteAllowed, selectedCellCount } =
    getContext("grid")
  const duration = 260

  let modal
  let progressPercentage = 0
  let pasting = false

  const handleCopyRequest = () => {
    if (!$copyAllowed) {
      return
    }
    clipboard.actions.copy()
  }

  const handlePasteRequest = async () => {
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
    pasting = true
    await clipboard.actions.paste(progress => {
      progressPercentage = progress * 100
    })
    await sleep(duration)
    pasting = false
  }

  onMount(() => subscribe("copy", handleCopyRequest))
  onMount(() => subscribe("paste", handlePasteRequest))
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Confirm bulk paste"
    confirmText="Continue"
    cancelText="Cancel"
    onConfirm={performBulkPaste}
    size="M"
  >
    Are you sure you want to paste? This will update multiple values.
    {#if pasting}
      <ProgressBar
        size="L"
        value={progressPercentage}
        {duration}
        width="100%"
      />
    {/if}
  </ModalContent>
</Modal>
