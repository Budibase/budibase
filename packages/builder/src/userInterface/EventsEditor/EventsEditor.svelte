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
    difference,
  } from "lodash/fp"
  import { pipe } from "../../common/core"
  import Checkbox from "../../common/Checkbox.svelte"
  import Textbox from "../../common/Textbox.svelte"
  import Dropdown from "../../common/Dropdown.svelte"
  import PlusButton from "../../common/PlusButton.svelte"
  import IconButton from "../../common/IconButton.svelte"
  import Modal from "../../common/Modal.svelte"
  import EventEditorModal from "./EventEditorModal.svelte"
  import HandlerSelector from "./HandlerSelector.svelte"

  import { PencilIcon } from "../../common/Icons"
  import { EVENT_TYPE_MEMBER_NAME } from "../../common/eventHandlers"

  export const EVENT_TYPE = "event"

  export let component
  export let onPropChanged = () => {}
  export let components

  let modalOpen = false
  let events = []
  let selectedEvent = null

  $: {
    events = Object.keys(component)
      .filter(key => findType(key) === EVENT_TYPE)
      .map(key => ({ name: key, handlers: component[key] }))
  }

  function findType(propName) {
    if (!component._component) return
    return components.find(({ name }) => name === component._component).props[
      propName
    ]
  }

  const openModal = event => {
    selectedEvent = event
    modalOpen = true
  }

  const closeModal = () => {
    selectedEvent = null
    modalOpen = false
  }
</script>

<header>
  <h3>Events</h3>
  <PlusButton on:click={() => openModal()} />
</header>

<div class="root">
  <form class="uk-form-stacked form-root">
    {#each events as event, index}
      {#if event.handlers.length > 0}
        <div
          class="handler-container hierarchy-item {selectedEvent && selectedEvent.index === index ? 'selected' : ''}"
          on:click={() => openModal({ ...event, index })}>
          <span class="event-name">{event.name}</span>
          <span class="edit-text">EDIT</span>
        </div>
      {/if}
    {/each}
  </form>
</div>
<EventEditorModal
  {onPropChanged}
  open={modalOpen}
  onClose={closeModal}
  eventOptions={events}
  event={selectedEvent} />

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

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .handler-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border: 2px solid #f9f9f9;
    height: 80px;
  }

  .hierarchy-item {
    cursor: pointer;
    padding: 11px 7px;
    margin: 5px 0;
    border-radius: 5px;
    font-size: 1.5em;
    width: 100%;
  }

  .hierarchy-item:hover {
    background: #f9f9f9;
  }

  .event-name {
    margin-top: 5px;
    font-weight: bold;
    font-size: 16px;
    color: rgba(22, 48, 87, 0.6);
    align-self: end;
  }

  .edit-text {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    align-self: end;
    justify-self: end;
    font-size: 10px;
    color: rgba(35, 65, 105, 0.4);
  }

  .selected {
    color: var(--button-text);
    background: var(--background-button) !important;
  }
</style>
