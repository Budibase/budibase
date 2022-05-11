<script>
  import { Body, Layout, Icon, ActionButton } from "@budibase/bbui"

  export let history
  export let close
</script>

<div class="body">
  <Layout>
    <div class="top">
      <Icon name="Clock" />
      <Body>Run log details</Body>
      <ActionButton size="S" icon="Close" quiet on:click={close} />
    </div>
  </Layout>
</div>

<style>
  .body {
    background-color: var(--background);
    border-left: var(--border-light);
    height: 100%;
    width: 100%;
  }

  .top {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: var(--spacing-s);
    padding: var(--spacing-s) 0 var(--spacing-l) var(--spacing-s);
    border-bottom: var(--border-light);
  }
</style>
