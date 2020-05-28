<script>
  export let value = ""
  export let text = ""
  export let icon = ""
  export let onClick = value => {}
  export let selected = false

  $: useIcon = !!icon
</script>

<div class="flatbutton" class:selected on:click={() => onClick(value || text)}>
  {#if useIcon}
    <i class={icon} />
  {:else}
    <span>{text}</span>
  {/if}
</div>

<style>
  .flatbutton {
    cursor: pointer;
    padding: 8px 2px;
    text-align: center;
    background: #ffffff;
    color: var(--ink-light);
    border-radius: 5px;
    font-family: Roboto;
    font-size: 14px;
    font-weight: 400;
    transition: all 0.3s;
    text-rendering: optimizeLegibility;
  }

  .selected {
    background: var(--ink-light);
    color: #ffffff;
  }
</style>
