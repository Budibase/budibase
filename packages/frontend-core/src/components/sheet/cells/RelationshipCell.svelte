<script>
  import { getColor } from "../utils"

  export let value
</script>

<div class="container">
  {#each value || [] as relationship, idx}
    {#if relationship.primaryDisplay}
      <div class="badge" style="--color: {getColor(idx)}">
        {relationship.primaryDisplay}
      </div>
    {/if}
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 var(--cell-padding);
    flex: 1 1 auto;
    width: 0;
    gap: var(--cell-spacing);
    overflow: hidden;
  }
  .badge {
    flex: 0 0 auto;
    padding: 2px var(--cell-padding);
    background: var(--color);
    border-radius: var(--cell-padding);
    user-select: none;
  }
</style>
