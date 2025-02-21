<script>
  import { Body, Modal, ModalContent, TextArea, Table } from "@budibase/bbui"
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
      addContent({ user: true, message: `<i>${value}</i>` })
      await prompt()
    }
  }

  function dataSchema(data) {
    if (!data || data.length === 0) {
      return {}
    }
    const keys = Object.keys(data[0])
    // assume all strings
    const schema = {}
    const ignored = ["_id", "_rev", "type", "createdAt", "updatedAt", "tableId"]
    for (let key of keys) {
      if (ignored.indexOf(key) !== -1) {
        continue
      }
      schema[key] = { type: "string", name: key }
    }
    return schema
  }
</script>

<Modal bind:this={modal} on:hide={modal}>
  <ModalContent
    title="Lets do some magic"
    size="L"
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
          <div class="message-container" class:user={element.user}>
            <div class:user-border={element.user}>
              <Body size="S">{@html element.message}</Body>
            </div>
          </div>
        {/if}
        {#if element.data && element.data.length}
          <Body size="S">Here's what I found:</Body>
          <div class="table">
            <Table compact data={element.data.filter(d => d.tableId === element.data[0].tableId)} schema={dataSchema(element.data)} />
          </div>
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
  .user {
    display: flex;
    justify-content: end !important;
  }
  .message-container {
    display: flex;
    justify-content: start;
  }
  .user-border {
    background-color: var(--grey-2);
    border-radius: 10px;
    padding: 8px;
  }
  .table {
    width: 560px;
    overflow-y: hidden;
    overflow-x: auto;
  }
</style>