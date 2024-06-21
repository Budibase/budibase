<script>
  import { Modal, ModalContent } from "@budibase/bbui"
  import { getContext, onMount } from "svelte"

  const { clipboard, subscribe, copyAllowed, pasteAllowed, selectedCellCount } =
    getContext("grid")

  let modal

  const copy = () => {
    if (!$copyAllowed) {
      return
    }
    clipboard.actions.copy()
  }

  const paste = async () => {
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

  onMount(() => subscribe("copy", copy))
  onMount(() => subscribe("paste", paste))
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Confirm bulk paste"
    confirmText="Continue"
    cancelText="Cancel"
    onConfirm={clipboard.actions.paste}
    size="M"
  >
    Are you sure you want to paste values into {$selectedCellCount} cells?
  </ModalContent>
</Modal>
