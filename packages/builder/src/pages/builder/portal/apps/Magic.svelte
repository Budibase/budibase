<script>
  import { Body, Modal, ModalContent, TextArea } from "@budibase/bbui"
  import Spinner from "@/components/common/Spinner.svelte"
  import { API } from "@/api"

  let modal, loading = false
  let content = ""
  let value, clear

  export function show() {
    modal.show()
  }

  export function hide() {
    modal.hide()
  }

  async function prompt() {
    loading = true
    const response = await API.globalPrompt(value)
    if (content.length) {
      content += "<br/>"
    }
    content += response.message?.replaceAll("\n", "<br/>") || ""
    if (response.data.length) {
      content += `<br/>The response contained ${response.data.length} rows.`
    }
    content += "<br/>"
    loading = false
  }

  async function handleKeyDown(event) {
    if (event.key === "Enter") {
      setTimeout(clear, 50)
      if (content.length) {
        content += "<br/>"
      }
      content += `<i style="color: #1473E6">${value}</i>`
      await prompt()
    }
  }
</script>

<Modal bind:this={modal} on:hide={modal}>
  <ModalContent
    title="Lets do some magic"
    size="S"
    showCancelButton={false}
    showConfirmButton={false}
    showCloseIcon={true}
  >
    <Body size="S"
    >Welcome to Budibase AI.</Body
    >
    <TextArea bind:clear size="S" on:input={(e) => {value = e.detail}} on:keydown={handleKeyDown} />
    <Body size="S">{@html content}</Body>
    {#if loading}
      <div class="center">
        <Spinner size="24" />
      </div>
    {/if}
  </ModalContent>
</Modal>

<style>
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: pre-line;
  }
</style>