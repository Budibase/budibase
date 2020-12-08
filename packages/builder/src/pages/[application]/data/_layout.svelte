<script>
  import TableNavigator from "components/backend/TableNavigator/TableNavigator.svelte"
</script>

<!-- routify:options index=0 -->
<div class="root">
  <div class="nav">
    <TableNavigator />
  </div>
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .root {
    height: calc(100vh - 60px);
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    background: var(--grey-2);
  }
  .content {
    flex: 1 1 auto;
    padding: var(--spacing-l) 40px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
  }
  .nav {
    overflow-y: auto;
    background: var(--background);
    padding: var(--spacing-l) var(--spacing-xl);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
  }
</style>
