<script>
  export let label
  export let value
</script>

<div class="stat">
  <div class="stat-label">{label}</div>
  <div class="stat-value" title={value} on:click={() => console.log(value)}>
    {value == null ? " " : value}
  </div>
</div>

<style>
  .stat {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .stat-label {
    font-size: var(--font-size-xs);
    color: var(--spectrum-global-color-gray-600);
    text-transform: uppercase;
    flex: 0 0 auto;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .stat-value {
    flex: 1 1 auto;
    width: 0;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
