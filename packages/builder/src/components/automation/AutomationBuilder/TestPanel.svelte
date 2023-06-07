<script>
  import { Icon, Divider } from "@budibase/bbui"
  import TestDisplay from "./TestDisplay.svelte"
  import { automationStore } from "builderStore"

  export let automation
</script>

<div class="title">
  <div class="title-text">
    <Icon name="MultipleCheck" />
    <div style="padding-left: var(--spacing-l)">Test Details</div>
  </div>
  <div style="padding-right: var(--spacing-xl)">
    <Icon
      on:click={async () => {
        $automationStore.showTestPanel = false
      }}
      hoverable
      name="Close"
    />
  </div>
</div>

<Divider />

<TestDisplay {automation} testResults={$automationStore.testResults} />

<style>
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-xs);
    padding-left: var(--spacing-xl);
    justify-content: space-between;
  }

  .title-text {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .title :global(h1) {
    flex: 1 1 auto;
  }
</style>
