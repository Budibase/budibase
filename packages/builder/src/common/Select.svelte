<script>
  import getIcon from "./icon"

  export let icon
  export let value
</script>

<div class="select-container">
  {#if icon}
    <i class={icon} />
  {/if}
  <select 
    class:adjusted={icon}
    on:change bind:value
  >
    <slot />
  </select>
  <span class="arrow">
    {@html getIcon('chevron-down', '24')}
  </span>
</div>

<style>
  .select-container {
    font-size: 0.9rem;
    color: var(--secondary50);
    font-weight: bold;
    position: relative;
    max-width: 300px;
    min-width: 200px;
  }

  .adjusted {
    padding-left: 2.5em;
  }

  i {
    position: absolute;
    left: 8px;
    top: 8px;
  }

  select {
    height: 35px;
    display: block;
    font-family: sans-serif;
    font-weight: 500;
    color: #163057;
    padding: 0 2.6em 0em 1.4em;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    margin: 0;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: #fff;
    border: 1px solid #ccc;
  }

  .arrow {
    position: absolute;
    right: 10px;
    bottom: 0;
    margin: auto;
    width: 30px;
    height: 30px;
    pointer-events: none;
    color: var(--primary100);
  }
</style>
