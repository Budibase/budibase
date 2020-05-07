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
    padding: 5px;
    text-align: center;
    background: #ffffff;
    color: #808192;
    border-radius: 4px;
    font-family: Roboto;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.11px;
    transition: background 0.5s, color 0.5s ease;
  }

  .selected {
    background: #808192;
    color: #ffffff;
  }
</style>
