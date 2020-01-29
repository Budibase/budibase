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
  import HandlerSelector from "./HandlerSelector.svelte";

  import { PencilIcon } from "../../common/Icons";
  import { EVENT_TYPE_MEMBER_NAME } from "../../common/eventHandlers";

  export const EVENT_TYPE = "event";

  export let componentInfo;
  export let onPropChanged = () => {};
  export let components;

  // Structure
  // {
  //    [eventName]: [{eventHandler}, {eventHandler1}],
  //    [eventName1]: [{eventHandler}, {eventHandler1}],
  // }

  let modalOpen = false;
  let events = [];
  let selectedEvent = {};
  let newEventType = "onClick";

  // TODO: only show events that have handlers

  // $: {
  //   let componentEvents = {};
  //   for (let propName in componentInfo) {
  //     const isEventProp = findType(propName) === EVENT_TYPE;
  //     if (isEventProp) componentEvents[propName] = componentInfo[propName];
  //   }
  //   events = componentEvents;
  // }

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

  console.log({ componentInfo, events, components });

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

  console.log("DA HANDLERS", selectedEvent.handlers);
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

  .prop-container {
    flex: 1 1 auto;
    min-width: 250px;
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

  h2 {
    color: var(--primary100);
    font-size: 20px;
    font-weight: bold;
  }

  /* TODO: Should be it's own component */
  input {
    font-size: 12px;
    font-weight: 700;
    color: #163057;
    opacity: 0.7;
    padding: 5px 10px;
    box-sizing: border-box;
    border: 1px solid #dbdbdb;
    border-radius: 2px;
    outline: none;
  }

  .event-action {
    background: #fafafa;
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
          class="handler-container hierarchy-item"
          on:click={() => openModal({ name, handlers, index })}>
          <span class="event-name">{name}</span>
          <span class="edit-text">EDIT</span>
          <span class="handler-identifier">updateState</span>
        </div>
      {/if}
    {/each}
  </form>
</div>
<Modal bind:isOpen={modalOpen} onClosed={closeModal}>
  <h2>Create a New Component Event</h2>
  <span>Click here to learn more about component events</span>

  <h4>Event Name</h4>
  <input type="text" />

  <h4>Event Type</h4>
  <select
    class="type-selector uk-select uk-form-small"
    bind:value={newEventType}>
    {#each events as [name]}
      <option value={name}>{name}</option>
    {/each}
  </select>

  <h4>Event Action(s)</h4>
  {#if selectedEvent.handlers}
    {#each selectedEvent.handlers as handler, index}
      <HandlerSelector
        {index}
        onChanged={changeEventHandler}
        onRemoved={removeEventHandler}
        {handler} />
      <hr />
    {/each}
  {/if}
  <div
    class="addelement-container"
    on:click={() => addEventHandler(newEventType)}>
    <IconButton icon="plus" size="12" />
    Add Handler
  </div>
</Modal>
