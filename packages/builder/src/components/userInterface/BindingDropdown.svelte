<script>
  import { TextArea } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()
  export let bindableProperties
  export let value = ""

  function addToText(readableBinding) {
    value = value + `{{ ${readableBinding} }}`
  }

  $: dispatch("update", value)
</script>

<div class="container">
  <div class="text">
    <TextArea
      bind:value
      placeholder="Enter your name"
      label="Construct your text" />
  </div>
  <div class="list">
    <ul>
      {#each bindableProperties as { readableBinding }}
        <li on:click={() => addToText(readableBinding)}>{readableBinding}</li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .container {
    grid-gap: 20px;
    padding: 20px;
    display: grid;
    grid-template-columns: auto auto;
  }
  .text {
    width: 600px;
    display: grid;
  }
  .list {
    width: 150px;
  }
  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    padding: var(--spacing-s) 0;
  }
  li {
    display: flex;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    color: var(--ink);
    padding: var(--spacing-s) var(--spacing-m);
    margin: auto 0px;
    align-items: center;
    cursor: pointer;
  }
</style>
