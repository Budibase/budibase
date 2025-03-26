<script lang="ts">
  import { API } from "@/api"
  import { keepOpen, Modal, ModalContent, TextArea } from "@budibase/bbui"

  let modal: Modal
  let prompt: string =
    "I need a ticketing system where employees can submit tickets. A ticket has a title, description, priority, status, and an assigned technician"
  let result: string

  export function show() {
    modal.show()
  }

  export async function generate() {
    result = ""

    const { response } = await API.generateTables({ prompt })
    result = response ?? ""
    return keepOpen
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="AI generation"
    size="XL"
    confirmText="Generate"
    onConfirm={generate}
    showCancelButton={false}
  >
    <TextArea label="Table Name" bind:value={prompt} />
    <TextArea label="Result" value={result} disabled minHeight={350} />
  </ModalContent>
</Modal>
