<script>
import { notifications } from "@budibase/bbui"
import NavItem from "components/common/NavItem.svelte"
import {
  automationStore,
  selectedAutomation,
  userSelectedResourceMap,
} from "stores/builder"
import { onMount } from "svelte"
import EditAutomationPopover from "./EditAutomationPopover.svelte"

$: selectedAutomationId = $selectedAutomation?._id

onMount(async () => {
  try {
    await automationStore.actions.fetch()
  } catch (error) {
    notifications.error("Error getting automations list")
  }
})

function selectAutomation(id) {
  automationStore.actions.select(id)
}
</script>

<div class="automations-list">
  {#each $automationStore.automations.sort(aut => aut.name) as automation}
    <NavItem
      icon="ShareAndroid"
      text={automation.name}
      selected={automation._id === selectedAutomationId}
      on:click={() => selectAutomation(automation._id)}
      selectedBy={$userSelectedResourceMap[automation._id]}
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
