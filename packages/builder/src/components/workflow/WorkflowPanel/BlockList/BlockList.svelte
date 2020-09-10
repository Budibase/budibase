<script>
  import { workflowStore } from "builderStore"
  import WorkflowBlock from "./WorkflowBlock.svelte"
  import FlatButtonGroup from "components/userInterface/FlatButtonGroup.svelte"

  let selectedTab = "TRIGGER"
  let definitions = []

  $: buttonProps = [
    ...($workflowStore.currentWorkflow.hasTrigger()
      ? []
      : [{ value: "TRIGGER", text: "Trigger" }]),
    { value: "ACTION", text: "Action" },
    { value: "LOGIC", text: "Logic" },
  ]

  $: definitions = Object.entries($workflowStore.blockDefinitions[selectedTab])
  $: {
    if (
      $workflowStore.currentWorkflow.hasTrigger() &&
      selectedTab === "TRIGGER"
    ) {
      selectedTab = "ACTION"
    }
  }

  function onChangeTab(tab) {
    selectedTab = tab
  }
</script>

<section>
  <FlatButtonGroup value={selectedTab} {buttonProps} onChange={onChangeTab} />
  <div id="blocklist">
    {#each definitions as [actionId, blockDefinition]}
      <WorkflowBlock {blockDefinition} {actionId} blockType={selectedTab} />
    {/each}
  </div>
</section>
