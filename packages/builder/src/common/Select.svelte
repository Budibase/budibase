<script>
  import getIcon from "./icon"
  export let value
</script>

<div class="select-container">
  <select on:change bind:value={value}>
    <slot />
  </select>
  <span class="arrow">
    {@html getIcon('chevron-down', '24')}
  </span>
</div>

<style>
  .select-container {
    padding-bottom: 10px;
    font-size: 0.9rem;
    color: var(--secondary50);
    font-weight: bold;
    position: relative;
    max-width: 300px;
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
    top: 0;
    bottom: 0;
    margin: auto;
    width: 30px;
    height: 30px;
    pointer-events: none;
    color: var(--primary100);
  }
</style>
