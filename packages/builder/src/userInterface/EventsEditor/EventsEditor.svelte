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
  import IconButton from "../../common/IconButton.svelte";
  import Modal from "../../common/Modal.svelte";
  import EventSelector from "./EventSelector.svelte";

  import { PencilIcon } from "../../common/Icons";
  import { EVENT_TYPE_MEMBER_NAME } from "../../common/eventHandlers";

  export const EVENT_TYPE = "event";

  export let componentInfo;
  export let onPropChanged = () => {};
  export let components;

  let modalOpen = false;
  let events = [];
  let selectedEvent = null;
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

  console.log(componentInfo, events, components);

  const openModal = event => {
    selectedEvent = event;
    modalOpen = true;
  };

  const closeModal = () => {
    selectedEvent = null;
    modalOpen = false;
  };

  const addEventHandler = event => {
    const newEventHandler = {
      parameters: {},
      [EVENT_TYPE_MEMBER_NAME]: ""
    };
    events = [...events, newEventHandler];
    onPropChanged(newEventType, events);
  };

  const changeEventHandler = newEvent => {
    console.log({ events, newEventType, newEvent });
    onPropChanged(newEventType, events);
  };

  const removeEventHandler = index => () => {
    events = filter(e => e !== events[index])(events);
    onPropChanged(newEventType, []);
  };

  console.log(events);
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
</style>

<h3>Events</h3>

<div class="root">

  <form class="uk-form-stacked form-root">
    {#each events as event, index}
      <div class="prop-container">
        {event[0]}
        <PencilIcon on:click={() => openModal({ ...event, index })} />
      </div>
    {/each}
  </form>
  <button on:click={() => openModal()}>Create Event</button>
</div>
<Modal bind:isOpen={modalOpen} onClosed={closeModal}>
  <h2>{action} Event</h2>
  {#if selectedEvent}
    {JSON.stringify(selectedEvent)}
    <!-- <EventSelector
      onChanged={onEventHandlerChanged(selectedEvent)}
      onRemoved={removeHandler(selectedEvent && selectedEvent.index)}
      event={selectedEvent} />
    <div class="addelement-container" on:click={addHandler}>
      <IconButton icon="plus" size="12" />
    </div> -->
  {:else}
    <select bind:value={newEventType}>
      {#each events as [name]}
        <option value={name}>{name}</option>
      {/each}
    </select>
    <EventSelector
      onChanged={changeEventHandler}
      onRemoved={removeEventHandler}
      event={selectedEvent} />
    <div class="addelement-container" on:click={addEventHandler}>
      <IconButton icon="plus" size="12" />
    </div>
    <button>Save</button>
  {/if}
</Modal>
