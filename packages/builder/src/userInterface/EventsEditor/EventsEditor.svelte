<script>
  import {
    keys,
    map,
    some,
    includes,
    cloneDeep,
    isEqual,
    sortBy,
    filter,
    difference
  } from "lodash/fp";
  import { pipe } from "../../common/core";
  import Checkbox from "../../common/Checkbox.svelte";
  import Textbox from "../../common/Textbox.svelte";
  import Dropdown from "../../common/Dropdown.svelte";
  import PlusButton from "../../common/PlusButton.svelte";
  import IconButton from "../../common/IconButton.svelte";
  import Modal from "../../common/Modal.svelte";
  import EventEditorModal from "./EventEditorModal.svelte";
  import HandlerSelector from "./HandlerSelector.svelte";

  import { PencilIcon } from "../../common/Icons";
  import { EVENT_TYPE_MEMBER_NAME } from "../../common/eventHandlers";

  export const EVENT_TYPE = "event";

  export let componentInfo;
  export let onPropChanged = () => {};
  export let components;

  let modalOpen = false;
  let events = [];
  let selectedEvent = {};
  let newEventType = "onClick";

  // TODO: only show events that have handlers

  $: events =
    componentInfo &&
    Object.entries(componentInfo).filter(
      ([name]) => findType(name) == EVENT_TYPE
    );

  $: action = selectedEvent ? "Edit" : "Create";

  function findType(propName) {
    if (!componentInfo._component) return;
    return components.find(({ name }) => name === componentInfo._component)
      .props[propName];
  }

  const openModal = event => {
    selectedEvent = event;
    modalOpen = true;
  };

  const closeModal = () => {
    selectedEvent = {};
    modalOpen = false;
  };

  const addEventHandler = eventType => {
    const newEventHandler = {
      parameters: {},
      [EVENT_TYPE_MEMBER_NAME]: ""
    };
    // TODO: improve - just pass the event from props
    selectedEvent = {
      ...selectedEvent,
      handlers: [...(selectedEvent.handlers || []), newEventHandler]
    };
    // events = [...events, newEventHandler];
    onPropChanged(newEventType, [...selectedEvent.handlers, newEventHandler]);
  };

  const changeEventHandler = (updatedHandler, index) => {
    // TODO: Improve
    const handlers = [...selectedEvent.handlers];
    handlers[index] = updatedHandler;

    console.log("CHANGED HANDLERS", handlers);

    selectedEvent = {
      ...selectedEvent,
      handlers
    };

    onPropChanged(newEventType, handlers);
  };

  // TODO: verify
  const removeEventHandler = index => {
    const handlers = [...selectedEvent.handlers];
    handlers.splice(index, 1);
    onPropChanged(newEventType, handlers);
  };
</script>

<style>
  h3 {
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    color: #8997ab;
    margin-bottom: 10px;
  }

  .root {
    font-size: 10pt;
    width: 100%;
  }

  .form-root {
    display: flex;
    flex-wrap: wrap;
  }

  .heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .handler-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    border: 2px solid #fafafa;
  }

  .hierarchy-item {
    cursor: pointer;
    padding: 11px 7px;
    margin: 5px 0;
    border-radius: 5px;
  }

  .hierarchy-item:hover {
    background: #fafafa;
  }

  .selected {
    color: var(--button-text);
    background: var(--background-button) !important;
  }

  .event-name {
  }

  .handler-identifier {
    font-size: 1.5em;
  }

</style>

<div class="heading">
  <h3>Events</h3>
  <PlusButton on:click={() => openModal({})} />
</div>

<div class="root">

  <form class="uk-form-stacked form-root">
    {#each events as [name, handlers], index}
      {#if handlers.length > 0}
        <div
          class="handler-container hierarchy-item {selectedEvent.index === index ? 'selected' : ''}"
          on:click={() => openModal({ name, handlers, index })}>
          <span class="event-name">{name}</span>
          <span class="edit-text">EDIT</span>
          <span class="handler-identifier">updateState</span>
        </div>
      {/if}
    {/each}
  </form>
</div>
<EventEditorModal
  open={modalOpen}
  onClose={closeModal}
  event={selectedEvent}
  {events}
  {addEventHandler}
  {changeEventHandler}
  {removeEventHandler} />
