<script>
  export let value

  $: console.log(value)

  const getColor = idx => {
    if (!value || idx === -1) {
      return null
    }
    return `hsla(${((idx + 1) * 222) % 360}, 90%, 75%, 0.3)`
  }
</script>

<div class="container">
  {#each value || [] as relationship, idx}
    <div class="badge" style="--color: {getColor(idx)}">
      {relationship.primaryDisplay}
    </div>
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 8px;
    flex: 1 1 auto;
    width: 0;
    gap: 4px;
    overflow: hidden;
  }
  .badge {
    flex: 0 0 auto;
    padding: 2px 8px;
    background: var(--color);
    border-radius: 8px;
    user-select: none;
  }
</style>
