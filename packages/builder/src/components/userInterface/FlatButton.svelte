<script>
  import { buildStyle } from "../../helpers.js"
  export let value = ""
  export let text = ""
  export let icon = ""
  export let padding = "8px 5px;"
  export let onClick = value => {}
  export let selected = false
  export let fontWeight = ""

  $: style = buildStyle({ padding, fontWeight })
  $: useIcon = !!icon
</script>

<div
  class="flatbutton"
  {style}
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
    padding: 8px 2px;
    text-align: center;
    background: #ffffff;
    color: var(--grey-7);
    border-radius: 5px;
    font-size: 14px;
    font-weight: 400;
    transition: all 0.3s;
    margin-left: 5px;
    text-rendering: optimizeLegibility;
  }

  .selected {
    background: var(--grey-3);
    color: var(--ink);
  }

  i {
    font-size: 20px;
  }
</style>
