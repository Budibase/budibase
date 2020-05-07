<script>
  import { store } from "builderStore";
  import Modal from "../../common/Modal.svelte"
  import HandlerSelector from "./HandlerSelector.svelte"
  import IconButton from "../../common/IconButton.svelte"
  import ActionButton from "../../common/ActionButton.svelte"
  import PlusButton from "../../common/PlusButton.svelte"
  import Select from "../../common/Select.svelte"
  import Input from "../../common/Input.svelte"
  import getIcon from "../../common/icon"

  import { EVENT_TYPE_MEMBER_NAME } from "../../common/eventHandlers"

  export let event
  export let eventOptions = []
  export let open
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

<Modal bind:isOpen={open} onClosed={closeModal}>
  <h2>
    {eventData.name ? `${eventData.name} Event` : 'Create a New Component Event'}
  </h2>
  <a href="https://docs.budibase.com/" target="_blank">
    Click here to learn more about component events
  </a>

  <div class="event-options">
    <div>
      <header>
        <h5>Event Type</h5>
        {@html getIcon('info', 20)}
      </header>
      <Select bind:value={eventType}>
        {#each eventOptions as option}
          <option value={option.name}>{option.name}</option>
        {/each}
      </Select>
    </div>
  </div>

  <header>
    <h5>Event Action(s)</h5>
    {@html getIcon('info', 20)}
  </header>
  <HandlerSelector
    newHandler
    onChanged={updateDraftEventHandler}
    onCreate={() => {
      createNewEventHandler(draftEventHandler)
      draftEventHandler = { parameters: [] }
    }}
    handler={draftEventHandler} />
  {#if eventData}
    {#each eventData.handlers as handler, index}
      <HandlerSelector
        {index}
        onChanged={updateEventHandler}
        onRemoved={() => deleteEventHandler(index)}
        {handler} />
    {/each}
  {/if}

  <div class="actions">
    <ActionButton
      alert
      disabled={eventData.handlers.length === 0}
      hidden={!eventData.name}
      on:click={deleteEvent}>
      Delete
    </ActionButton>
    <ActionButton
      disabled={eventData.handlers.length === 0}
      on:click={saveEventData}>
      Save
    </ActionButton>
  </div>
</Modal>

<style>
  h2 {
    color: var(--primary100);
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 0;
  }

  h5 {
    color: rgba(22, 48, 87, 0.6);
    font-size: 15px;
    margin: 0;
  }

  .event-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
  }

  .actions,
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .actions {
    margin-top: auto;
  }

  header {
    margin-top: 30px;
    margin-bottom: 10px;
  }

  a {
    color: rgba(22, 48, 87, 0.6);
    font-size: 13px;
    margin-top: 0;
  }
</style>
