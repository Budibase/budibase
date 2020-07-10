<script>
  import FlatButton from "./FlatButton.svelte"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let format = "hex"

  let colorFormats = ["hex", "rgb", "hsl"]
</script>

<div class="flatbutton-group">
  {#each colorFormats as text}
    <FlatButton
      selected={format === text}
      {text}
      on:click={() => dispatch('click', text)} />
  {/each}
</div>

<style>
  .flatbutton-group {
    font-weight: 500;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    width: 170px;
    height: 30px;
    align-self: center;
  }
</style>
