<script>
  import FlatButton from "./FlatButton.svelte"

  export let format = "hex"
  export let onclick = format => {}

  let colorFormats = ["hex", "rgb", "hsl"]
</script>

<div class="flatbutton-group">
  {#each colorFormats as text}
    <FlatButton
      selected={format === text}
      {text}
      on:click={() => onclick(text)} />
  {/each}
</div>

<style>
  .flatbutton-group {
    font-weight: 500;
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    justify-content: center;
  }
</style>
