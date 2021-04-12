<script>
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { automationStore } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import EditAutomationPopover from "./EditAutomationPopover.svelte"

  $: selectedAutomationId = $automationStore.selectedAutomation?.automation?._id

  onMount(() => {
    automationStore.actions.fetch()
  })
  function selectAutomation(automation) {
    automationStore.actions.select(automation)
    $goto(`./${automation._id}`)
  }
</script>

<div class="automations-list">
  {#each $automationStore.automations as automation, idx}
    <NavItem
      border={idx > 0}
      icon="ri-stackshare-line"
      text={automation.name}
      selected={automation._id === selectedAutomationId}
      on:click={() => selectAutomation(automation)}>
      <EditAutomationPopover {automation} />
    </NavItem>
  {/each}
</div>

<style>
  .automations-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
</style>
