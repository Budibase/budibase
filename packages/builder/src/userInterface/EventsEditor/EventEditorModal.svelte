<script>
  import Modal from "../../common/Modal.svelte";
  import EventSelector from "../EventSelector.svelte";
  import HandlerSelector from "./HandlerSelector.svelte";
  import IconButton from "../../common/IconButton.svelte";
  import Select from "../../common/Select.svelte";

  export let event;
  export let events;
  export let open;
  export let closeModal;
  export let changeEventHandler;
  export let removeEventHandler;
  export let addEventHandler;

  let newEventType = "onClick";
</script>

<style>
  h2 {
    color: var(--primary100);
    font-size: 20px;
    font-weight: bold;
  }

  h4 {
    font-size: 0.7em;
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

  .event-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>

<Modal bind:isOpen={open} onClosed={closeModal}>
  {#if event}
    <h2>{event.name}</h2>
  {:else}
    <h2>Create a New Component Event</h2>
  {/if}
  <span>Click here to learn more about component events</span>

  <div class="event-options">
    <div>
      <h5>Event Name</h5>
      <input type="text" />
    </div>

    <div>
      <h5>Event Type</h5>
      <Select bind:value={newEventType}>
        {#each events as [name]}
          <option value={name}>{name}</option>
        {/each}
      </Select>
    </div>
  </div>

  <h5>Event Action(s)</h5>
  {#if event.handlers}
    {#each event.handlers as handler, index}
      <HandlerSelector
        {index}
        onChanged={changeEventHandler}
        onRemoved={() => removeEventHandler(index)}
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
