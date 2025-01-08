<script>
  import { Icon, Divider } from "@budibase/bbui"
  import TestDisplay from "./TestDisplay.svelte"
  import { automationStore, selectedAutomation } from "@/stores/builder"

  export let automation
</script>

<div class="title">
  <div class="title-text">
    <Icon name="MultipleCheck" />
    <div>Test Details</div>
  </div>
  <div>
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

<TestDisplay
  {automation}
  testResults={$automationStore.testResults}
  automationBlockRefs={$selectedAutomation.blockRefs}
/>

<style>
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-xs);
    padding: 0px 30px;
    padding-top: var(--spacing-l);
    justify-content: space-between;
  }

  .title-text {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-l);
  }

  .title :global(h1) {
    flex: 1 1 auto;
  }
</style>
