<script>
  import { createEventDispatcher } from "svelte"
  import { ActionButton, Modal, ModalContent } from "@budibase/bbui"

  const dispatch = createEventDispatcher()

  export let value = ""
  let selected = value

  let modal
  let layoutMap = {
    mainSidebar: "Main with Sidebar",
    sidebarMain: "Sidebar with Main",
    twoColumns: "Two columns",
    threeColumns: "Three columns",
  }
</script>

<ActionButton on:click={modal.show}>{layoutMap[value]}</ActionButton>

<Modal bind:this={modal}>
  <ModalContent
    onConfirm={() => dispatch("change", selected)}
    size="L"
    title="Select layout"
  >
    <div class="container">
      {#each Object.entries(layoutMap) as [key, value]}
        <button
          class:selected={selected === key}
          on:click={() => (selected = key)}
          class="layout"
        >
          {value}
        </button>
      {/each}
    </div>
  </ModalContent>
</Modal>

<style>
  button {
    border: none;
  }
  .container {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .layout {
    box-sizing: border-box;
    display: grid;
    place-items: center;
    background: rebeccapurple;
    color: white;
    height: 100px;
  }
  .selected {
    border: 3px dashed red;
  }
</style>
