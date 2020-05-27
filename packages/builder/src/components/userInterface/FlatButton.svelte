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
    padding: 8px 4px;
    text-align: center;
    background: #ffffff;
    color: var(--ink-light);
    border-radius: 5px;
    font-family: Roboto;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.5s, color 0.5s ease;
    text-rendering: optimizeLegibility;
  }

  .selected {
    background: #808192;
    color: #ffffff;
  }
</style>
