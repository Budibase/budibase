<script>
  export let label
  export let value
</script>

<div class="stat">
  <div class="stat-label">{label}</div>
  <div class="stat-value">{value}</div>
</div>

<style>
  .stat {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .stat-label {
    font-size: var(--font-size-xs);
    color: var(--spectrum-global-color-gray-600);
    text-transform: uppercase;
  }
</style>
