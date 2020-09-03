<script>
  import { store } from "builderStore"
  import { Button, Select } from "@budibase/bbui"
  import HandlerSelector from "./HandlerSelector.svelte"
  import IconButton from "../../common/IconButton.svelte"
  import ActionButton from "../../common/ActionButton.svelte"
  import getIcon from "../../common/icon"
  import { CloseIcon } from "components/common/Icons/"

  import { EVENT_TYPE_MEMBER_NAME } from "../../common/eventHandlers"

  export let event
  export let eventOptions = []
  export let onClose

  let eventType = ""
  let draftEventHandler = { parameters: [] }

  $: eventData = event || { handlers: [] }
  $: if (!eventOptions.includes(eventType) && eventOptions.length > 0)
    eventType = eventOptions[0].name

  const closeModal = () => {
    onClose()
    draftEventHandler = { parameters: [] }
    eventData = { handlers: [] }
  }

  const updateEventHandler = (updatedHandler, index) => {
    eventData.handlers[index] = updatedHandler
  }

  const updateDraftEventHandler = updatedHandler => {
    draftEventHandler = updatedHandler
  }

  const deleteEventHandler = index => {
    eventData.handlers.splice(index, 1)
    eventData = eventData
  }

  const createNewEventHandler = handler => {
    const newHandler = handler || {
      parameters: {},
      [EVENT_TYPE_MEMBER_NAME]: "",
    }
    eventData.handlers.push(newHandler)
    eventData = eventData
  }

  const deleteEvent = () => {
    store.setComponentProp(eventType, [])
    closeModal()
  }

  const saveEventData = () => {
    store.setComponentProp(eventType, eventData.handlers)
    closeModal()
  }
</script>

<div class="container">
  <div class="body">
    <div class="heading">
      <h3>
        {eventData.name ? `${eventData.name} Event` : 'Create a New Component Event'}
      </h3>
    </div>
    <div class="event-options">
      <div class="section">
        <h4>Event Type</h4>
        <Select bind:value={eventType}>
          {#each eventOptions as option}
            <option value={option.name}>{option.name}</option>
          {/each}
        </Select>
      </div>
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
    {#if eventData}
      {#each eventData.handlers as handler, index}
        <HandlerSelector
          {index}
          onChanged={updateEventHandler}
          onRemoved={() => deleteEventHandler(index)}
          {handler} />
      {/each}
    {/if}

  </div>
  <div class="footer">
    {#if eventData.name}
      <Button
        outline
        on:click={deleteEvent}
        disabled={eventData.handlers.length === 0}>
        Delete
      </Button>
    {/if}
    <div class="save">
      <Button
        primary
        on:click={saveEventData}
        disabled={eventData.handlers.length === 0}>
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
