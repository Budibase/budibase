<script>
  import { store } from "builderStore"
  import { Button } from "@budibase/bbui"
  import Modal from "../../common/Modal.svelte"
  import HandlerSelector from "./HandlerSelector.svelte"
  import IconButton from "../../common/IconButton.svelte"
  import ActionButton from "../../common/ActionButton.svelte"
  import PlusButton from "../../common/PlusButton.svelte"
  import Select from "../../common/Select.svelte"
  import Input from "../../common/Input.svelte"
  import getIcon from "../../common/icon"
  import { CloseIcon } from "components/common/Icons/"
  import { EVENT_TYPE_MEMBER_NAME } from "../../common/eventHandlers"

  export let event = []
  export let eventType
  export let onClose
  export let onChange

  let draftEventHandler = { parameters: [] }

  $: handlers = event || []

  const closeModal = () => {
    onClose()
    draftEventHandler = { parameters: [] }
    handlers = []
  }

  const updateEventHandler = (updatedHandler, index) => {
    handlers[index] = updatedHandler
  }

  const updateDraftEventHandler = updatedHandler => {
    draftEventHandler = updatedHandler
  }

  const deleteEventHandler = index => {
    handlers.splice(index, 1)
  }

  const createNewEventHandler = handler => {
    const newHandler = handler || {
      parameters: {},
      [EVENT_TYPE_MEMBER_NAME]: "",
    }
    handlers.push(newHandler)
    handlers = handlers
  }

  const deleteEvent = () => {
    handlers = []
    onChange([])
    closeModal()
  }

  const saveEventData = () => {
    onChange(handlers)
    closeModal()
  }
</script>

<div class="container">
  <div class="body">
    <div class="heading">
      <h3>{eventType} Event</h3>
    </div>

    <div class="section">
      <h4>Event Action(s)</h4>
      <HandlerSelector
        newHandler
        onChanged={updateDraftEventHandler}
        onCreate={() => {
          createNewEventHandler(draftEventHandler)
          draftEventHandler = { parameters: [] }
        }}
        handler={draftEventHandler} />
    </div>
    {#each handlers as handler, index}
      <HandlerSelector
        {index}
        onChanged={updateEventHandler}
        onRemoved={() => deleteEventHandler(index)}
        {handler} />
    {/each}

  </div>
  <div class="footer">

    <Button outline on:click={deleteEvent} disabled={handlers.length === 0}>
      Delete
    </Button>

    <div class="save">
      <Button primary on:click={saveEventData} disabled={handlers.length === 0}>
        Save
      </Button>
    </div>
  </div>
  <div class="close-button" on:click={closeModal}>
    <CloseIcon />
  </div>
</div>

<style>
  .container {
    position: relative;
  }
  .heading {
    margin-bottom: 20px;
  }

  .close-button {
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .close-button :global(svg) {
    width: 24px;
    height: 24px;
  }

  h4 {
    margin-bottom: 10px;
  }

  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
  }
  .body {
    padding: 40px;
    display: grid;
    grid-gap: 20px;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    padding: 30px 40px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 50px;
    background-color: var(--grey-1);
  }
  .save {
    margin-left: 20px;
  }
</style>
