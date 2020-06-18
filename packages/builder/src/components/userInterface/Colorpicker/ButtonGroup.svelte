<script>
  import FlatButton from "./FlatButton.svelte";

  export let format = "hex";
  export let onclick = format => {};

  let colorFormats = ["hex", "rgb", "hsl"];
</script>

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

<div class="flatbutton-group">
  {#each colorFormats as text}
    <FlatButton
      selected={format === text}
      {text}
      on:click={() => onclick(text)} />
  {/each}
</div>
