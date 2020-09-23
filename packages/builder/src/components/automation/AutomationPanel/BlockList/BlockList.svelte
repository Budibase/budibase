<script>
  import { sortBy } from "lodash/fp"
  import { automationStore } from "builderStore"
  import AutomationBlock from "./AutomationBlock.svelte"
  import FlatButtonGroup from "components/userInterface/FlatButtonGroup.svelte"

  let selectedTab = "TRIGGER"
  let buttonProps = []
  $: blocks = sortBy(entry => entry[1].name)(
    Object.entries($automationStore.blockDefinitions[selectedTab])
  )

  $: {
    if ($automationStore.selectedAutomation.hasTrigger()) {
      buttonProps = [
        { value: "ACTION", text: "Action" },
        { value: "LOGIC", text: "Logic" },
      ]
      if (selectedTab === "TRIGGER") {
        selectedTab = "ACTION"
      }
    } else {
      buttonProps = [{ value: "TRIGGER", text: "Trigger" }]
      if (selectedTab !== "TRIGGER") {
        selectedTab = "TRIGGER"
      }
    }
  }

  function onChangeTab(tab) {
    selectedTab = tab
  }
</script>

<section>
  <FlatButtonGroup value={selectedTab} {buttonProps} onChange={onChangeTab} />
  <div id="blocklist">
    {#each blocks as [stepId, blockDefinition]}
      <AutomationBlock {blockDefinition} {stepId} blockType={selectedTab} />
    {/each}
  </div>
</section>

<style>
  #blocklist {
    margin-top: var(--spacing-xl);
  }
</style>
