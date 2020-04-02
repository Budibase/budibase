<script>
  import getIcon from "./icon"

  export let icon
  export let value
</script>

<div class="select-container">
  {#if icon}
    <i class={icon} />
  {/if}
  <select class:adjusted={icon} on:change bind:value>
    <slot />
  </select>
  <span class="arrow">
    {@html getIcon('chevron-down', '24')}
  </span>
</div>

<style>
  .select-container {
    font-size: 14px;
    color: var(--secondary60);
    font-weight: bold;
    position: relative;
    max-width: 400px;
    min-width: 275px;
  }

  .adjusted {
    padding-left: 30px;
  }

  i {
    position: absolute;
    left: 10px;
    top: 10px;
  }

  select {
    height: 40px;
    display: block;
    font-family: sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #000333;
    padding: 0 40px 0px 20px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    margin: 0;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: var(--white);
  }

  .arrow {
    position: absolute;
    right: 10px;
    bottom: 0;
    margin: auto;
    width: 30px;
    height: 30px;
    pointer-events: none;
    color: var(--secondary100);
  }
</style>
