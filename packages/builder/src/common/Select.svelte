<script>
  import getIcon from "./icon";
  export let value;
</script>

<style>
  .select-container {
    padding-bottom: 10px;
    font-size: 0.9rem;
    color: var(--secondary50);
    font-weight: bold;
    position: relative;
  }

  select {
    display: block;
    font-size: 16px;
    font-family: sans-serif;
    font-weight: 700;
    color: #444;
    line-height: 1.3;
    padding: 1em 2.6em 0.9em 1.4em;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    margin: 0;
    border-radius: 0.5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: #fafafa;
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

<div class="select-container">
  <select on:change {value}>
    <slot />
  </select>
  <span class="arrow">
    {@html getIcon('chevron-down', '24')}
  </span>
</div>
