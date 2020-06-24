<script>
  import { createEventDispatcher } from "svelte"
  import { fade } from "svelte/transition"
  import CheckedBackground from "./CheckedBackground.svelte"

  export let hovered = false
  export let color = "#fff"

  const dispatch = createEventDispatcher()
</script>

<div class="space">
  <CheckedBackground borderRadius="6px">
    <div
      in:fade
      class="swatch"
      style={`background: ${color};`}
      on:click|self
      on:mouseover={() => (hovered = true)}
      on:mouseleave={() => (hovered = false)}>
      {#if hovered}
        <div
          in:fade
          class="remove-icon"
          on:click|self={() => dispatch('removeswatch')}>
          <span on:click|self={() => dispatch('removeswatch')}>&times;</span>
        </div>
      {/if}
    </div>
  </CheckedBackground>
</div>

<style>
  .swatch {
    position: relative;
    cursor: pointer;
    border-radius: 6px;
    border: 1px solid #dedada;
    height: 20px;
    width: 20px;
  }

  .space {
    padding: 3px 5px;
  }

  .remove-icon {
    position: absolute;
    right: 0;
    top: -5px;
    right: -4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #800000;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
