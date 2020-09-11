<script>
  import { workflowStore } from "builderStore"
  import WorkflowBlock from "./WorkflowBlock.svelte"
  import FlatButtonGroup from "components/userInterface/FlatButtonGroup.svelte"

  let selectedTab = "TRIGGER"
  let buttonProps = []
  $: blocks = Object.entries($workflowStore.blockDefinitions[selectedTab])

  $: {
    if ($workflowStore.selectedWorkflow.hasTrigger()) {
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
      <WorkflowBlock {blockDefinition} {stepId} blockType={selectedTab} />
    {/each}
  </div>
</section>
