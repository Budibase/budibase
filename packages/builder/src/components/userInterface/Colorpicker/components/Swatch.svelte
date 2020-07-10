<script>
  import { createEventDispatcher } from "svelte"
  import { fade } from "svelte/transition"
  import CheckedBackground from "./CheckedBackground.svelte"
  import { keyevents } from "../actions"

  export let hovered = false
  export let color = "#fff"

  const dispatch = createEventDispatcher()
</script>

<div class="space">
  <CheckedBackground borderRadius="6px">
    <div
      tabindex="0"
      use:keyevents={{ Enter: () => dispatch('click') }}
      in:fade
      title={color}
      class="swatch"
      style={`background: ${color};`}
      on:mouseover={() => (hovered = true)}
      on:mouseleave={() => (hovered = false)}
      on:click|self>
      {#if hovered}
        <span in:fade on:click={() => dispatch('removeswatch')} />
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
    outline-color: #003cb0;
    outline-width: thin;
  }

  .space {
    padding: 3px 5px;
  }

  span {
    cursor: pointer;
    position: absolute;
    top: -5px;
    right: -4px;
    background: #800000;
    color: white;
    font-size: 12px;
    border-radius: 50%;
    text-align: center;
    width: 13px;
    height: 13px;
  }

  span:after {
    content: "\00d7";
    position: relative;
    left: 0;
    bottom: 3px;
  }
</style>
