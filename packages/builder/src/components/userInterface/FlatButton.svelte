<script>
  import { buildStyle } from "../../helpers.js"
  export let value = ""
  export let text = ""
  export let icon = ""
  export let onClick = value => {}
  export let selected = false

  $: useIcon = !!icon
</script>

<div
  class="flatbutton"
  class:selected
  on:click={() => onClick(value || text)}>
  {#if useIcon}
    <i class={icon} />
  {:else}
    <span>
      {@html text}
    </span>
  {/if}
</div>

<style>
  .flatbutton {
    cursor: pointer;
    max-height: 36px;
    padding: 8px 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #ffffff;
    color: var(--grey-7);
    border-radius: 5px;
    font-size: 14px;
    font-weight: 400;
    transition: all 0.3s;
    text-rendering: optimizeLegibility;
  }

  .selected {
    background: var(--grey-3);
    color: var(--ink);
  }

  i {
    font-size: 16px;
  }
</style>
