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
      placeholder=""
      label="Select bindable properties from the right." />
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
    display: grid;
    grid-template-columns: auto auto;
  }
  .text {
    padding: var(--spacing-s) 0 var(--spacing-s) var(--spacing-s);
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
    padding: 0;
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

  li:hover {
    background-color: var(--grey-2);
  }

  li:active {
    color: var(--blue);
  }
</style>
