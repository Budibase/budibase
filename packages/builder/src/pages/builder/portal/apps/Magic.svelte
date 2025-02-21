<script>
  import { Body, Modal, ModalContent, TextArea } from "@budibase/bbui"
  import Spinner from "@/components/common/Spinner.svelte"
  import { API } from "@/api"

  let modal, loading = false
  let value, clear
  let content = []

  export function show() {
    modal.show()
  }

  export function hide() {
    modal.hide()
  }

  function addContent(element) {
    content = [...content, element]
  }

  async function prompt() {
    loading = true
    const response = await API.globalPrompt(value)
    addContent({ message: response.message?.replaceAll("\n", "<br/>") || "" })
    if (response.data.length) {
      addContent({ data: response.data })
    }
    addContent({ newline: true })
    loading = false
  }

  async function handleKeyDown(event) {
    if (event.key === "Enter") {
      setTimeout(clear, 50)
      addContent({ message: `<i style="color: #1473E6">${value}</i>` })
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
    <div>
      {#each content as element}
        {#if element.newline}
          <br />
        {/if}
        {#if element.message}
          <Body size="S">{@html element.message}</Body>
        {/if}
        {#if element.data}
          <Body size="S">Response contained {element.data.length} rows.</Body>
        {/if}
      {/each}
    </div>
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