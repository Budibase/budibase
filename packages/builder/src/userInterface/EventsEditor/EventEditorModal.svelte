<script>
  import Modal from "../../common/Modal.svelte";
  import HandlerSelector from "./HandlerSelector.svelte";
  import IconButton from "../../common/IconButton.svelte";
  import ActionButton from "../../common/ActionButton.svelte";
  import PlusButton from "../../common/PlusButton.svelte";
  import Select from "../../common/Select.svelte";
  import Input from "../../common/Input.svelte";

  import { EVENT_TYPE_MEMBER_NAME } from "../../common/eventHandlers";

  export let event;

  export let events;
  export let open;
  export let onClose;
  export let onPropChanged;

  let eventType = "onClick";
  let newEventHandler = { parameters: [] };
  let eventData = event || { handlers: [] };

  const changeEventHandler = (updatedHandler, index) => {
    eventData.handlers[index] = updatedHandler;
  };

  const changeNewEventHandler = updatedHandler => {
    newEventHandler = updatedHandler;
  };

  const deleteEventHandler = index => {
    eventData.handlers.splice(index, 1);
    eventData = eventData;
  };

  const createNewEventHandler = handler => {
    const newHandler = handler || {
      parameters: {},
      [EVENT_TYPE_MEMBER_NAME]: ""
    };
    eventData.handlers.push(newHandler);
    eventData = eventData;
  };

  const deleteEvent = () => {
    onPropChanged(eventType, []);
    eventData = { handlers: [] };
    onClose();
  };

  const saveEventData = () => {
    onPropChanged(eventType, eventData.handlers);
    eventData = { handlers: [] };
    onClose();
  };
</script>

<style>
  h2 {
    color: var(--primary100);
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 0;
  }

  h5 {
    color: rgba(22, 48, 87, 0.6);
    font-size: 16px;
    margin-bottom: 5px;
  }

  .event-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
  }

  .actions {
    display: flex;
    justify-content: space-between;
  }
</style>

<Modal bind:isOpen={open} onClosed={onClose}>
  <h2>{eventData.name || "Create a New Component Event"}</h2>
  <p>Click here to learn more about component events</p>

  <div class="event-options">
    <div>
      <h5>Event Type</h5>
      <Select bind:value={eventType}>
        {#each events as event}
          <option value={event.name}>{event.name}</option>
        {/each}
      </Select>
    </div>
  </div>

  <h5>Event Action(s)</h5>
  <HandlerSelector
    newHandler
    onChanged={changeNewEventHandler}
    onCreate={() => { 
      createNewEventHandler(newEventHandler)
      newEventHandler = { parameters: [] };
    }}
    handler={newEventHandler} />
  {#if eventData}
    {#each eventData.handlers as handler, index}
      <HandlerSelector
        {index}
        onChanged={changeEventHandler}
        onRemoved={() => deleteEventHandler(index)}
        {handler} />
    {/each}
  {/if}

  <div class="actions">
    <ActionButton on:click={deleteEvent}>Delete</ActionButton>
    <ActionButton disabled={eventData.handlers.length === 0} on:click={saveEventData}>Save</ActionButton>
  </div>
</Modal>
