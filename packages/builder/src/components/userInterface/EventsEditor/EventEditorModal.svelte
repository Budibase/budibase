<script>
  import { store } from "builderStore"
  import { Button } from "@budibase/bbui"
  import HandlerSelector from "./HandlerSelector.svelte"
  import { CloseIcon } from "components/common/Icons/"
  import { EVENT_TYPE_MEMBER_NAME } from "../../common/eventHandlers"
  import { createEventDispatcher } from "svelte"

  export let event = []
  export let eventType

  const dispatch = createEventDispatcher()
  let draftEventHandler = { parameters: [] }

  $: handlers = (event && [...event]) || []

  const closeModal = () => {
    dispatch("close")
    draftEventHandler = { parameters: [] }
    handlers = []
  }

  const updateEventHandler = (updatedHandler, index) => {
    handlers[index] = updatedHandler
    dispatch("change", handlers)
  }

  const updateDraftEventHandler = updatedHandler => {
    draftEventHandler = updatedHandler
  }

  const deleteEventHandler = index => {
    handlers.splice(index, 1)
    dispatch("change", handlers)
  }

  const createNewEventHandler = handler => {
    const newHandler = handler || {
      parameters: {},
      [EVENT_TYPE_MEMBER_NAME]: "",
    }
    handlers.push(newHandler)
    dispatch("change", handlers)
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

  <div class="close-button" on:click={closeModal}>
    <CloseIcon />
  </div>
</div>

<style>
  .container {
    position: relative;
    width: 600px;
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
