<script>
  import { Icon } from "@budibase/bbui"

  let screens = ["screen1", "screen2", "screen3", "screen4", "screen5"]
</script>

<div class="screens-popover">
  <header>
    <h3>Screens</h3>
    <button class="close-button">
      <Icon name="Close" />
    </button>
  </header>
  <p class="description">The following screens are connected to this data.</p>
  <div class="screen-list">
    {#each screens as screen}
      <button class="screen-item">
        <span>/{screen}</span>
        <Icon name="ChevronRight" />
      </button>
    {/each}
  </div>
</div>

<style>
  .screens-popover {
    min-width: 320px;
    padding: var(--spacing-m);
    background: var(--background-dark);
    color: var(--white);
    border-radius: var(--border-radius-m);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-m);
  }

  h3 {
    margin: 0;
    font-size: var(--font-size-m);
    font-weight: 500;
  }

  .close-button {
    background: none;
    border: none;
    padding: 0;
    color: var(--white);
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .description {
    margin: 0 0 var(--spacing-m) 0;
    font-size: var(--font-size-s);
    color: var(--grey-4);
  }

  .screen-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .screen-item {
    width: 100%;
    padding: var(--spacing-m);
    background: var(--grey-9);
    border: none;
    border-radius: var(--border-radius-s);
    color: var(--white);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s;
    text-align: left;
  }

  .screen-item:hover {
    background: var(--grey-8);
  }

  .screen-item :global(.icon) {
    color: var(--grey-5);
  }
</style>
