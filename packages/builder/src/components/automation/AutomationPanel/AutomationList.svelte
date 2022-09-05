<script>
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { automationStore } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import EditAutomationPopover from "./EditAutomationPopover.svelte"
  import { notifications } from "@budibase/bbui"

  $: selectedAutomationId = $automationStore.selectedAutomation?.automation?._id

  onMount(async () => {
    try {
      await automationStore.actions.fetch()
    } catch (error) {
      notifications.error("Error getting automations list")
    }
  })

  function selectAutomation(automation) {
    automationStore.actions.select(automation)
    $goto(`./${automation._id}`)
  }
</script>

<div class="automations-list">
  {#each $automationStore.automations.sort(aut => aut.name) as automation, idx}
    <NavItem
      border={idx > 0}
      icon="ShareAndroid"
      text={automation.name}
      selected={automation._id === selectedAutomationId}
      on:click={() => selectAutomation(automation)}
    >
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
