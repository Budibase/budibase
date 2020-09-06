<script>
  import { getContext } from "svelte"
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
  import { pipe } from "components/common/core"
  import Checkbox from "components/common/Checkbox.svelte"
  import EventEditorModal from "./EventEditorModal.svelte"

  import { PencilIcon } from "components/common/Icons"
  import { EVENT_TYPE_MEMBER_NAME } from "components/common/eventHandlers"

  export const EVENT_TYPE = "event"

  export let component

  let events = []
  let selectedEvent = null

  $: {
    events = Object.keys(component)
      // TODO: use real events
      .filter(propName => ["onChange", "onClick", "onLoad"].includes(propName))
      .map(propName => ({
        name: propName,
        handlers: component[propName] || [],
      }))
  }

  // Handle create app modal
  const { open, close } = getContext("simple-modal")

  const openModal = event => {
    selectedEvent = event
    open(
      EventEditorModal,
      {
        eventOptions: events,
        event: selectedEvent,
        onClose: () => {
          close()
          selectedEvent = null
        },
      },
      {
        closeButton: false,
        closeOnEsc: false,
        styleContent: { padding: 0 },
        closeOnOuterClick: true,
      }
    )
  }
</script>

<button class="newevent" on:click={() => openModal()}>
  <i class="icon ri-add-circle-fill" />
  Create New Event
</button>

<div class="root">
  <form on:submit|preventDefault class="uk-form-stacked form-root">
    {#each events as event, index}
      {#if event.handlers.length > 0}
        <div
          class:selected={selectedEvent && selectedEvent.index === index}
          class="handler-container budibase__nav-item"
          on:click={() => openModal({ ...event, index })}>
          <span class="event-name">{event.name}</span>
          <span class="edit-text">EDIT</span>
        </div>
      {/if}
    {/each}
  </form>
</div>

<style>
  .root {
    font-size: 10pt;
    width: 100%;
  }

  .newevent {
    cursor: pointer;
    border: 1px solid var(--grey-4);
    border-radius: 3px;
    width: 100%;
    padding: 8px 16px;
    margin: 0px 0px 12px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    color: var(--ink);
    font-size: 14px;
    font-weight: 500;
    transition: all 2ms;
  }

  .newevent:hover {
    background: var(--grey-1);
  }

  .icon {
    color: var(--ink);
    font-size: 16px;
    margin-right: 4px;
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
    width: 100%;
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
    color: var(--blue);
    background: var(--grey-1) !important;
  }
</style>
