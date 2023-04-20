<script>
  import { onMount } from "svelte"
  import { automationStore, selectedAutomation } from "builderStore"
  import NavItem from "components/common/NavItem.svelte"
  import EditAutomationPopover from "./EditAutomationPopover.svelte"
  import { notifications } from "@budibase/bbui"
  import { _ } from "../../../../lang/i18n"

  $: selectedAutomationId = $selectedAutomation?._id

  onMount(async () => {
    try {
      await automationStore.actions.fetch()
    } catch (error) {
      notifications.error(
        $_("components.automation.AutomationPanel.AutomationList.Error_getting")
      )
    }
  })

  function selectAutomation(id) {
    automationStore.actions.select(id)
  }
</script>

<div class="automations-list">
  {#each $automationStore.automations.sort(aut => aut.name) as automation, idx}
    <NavItem
      border={idx > 0}
      icon="ShareAndroid"
      text={automation.name}
      selected={automation._id === selectedAutomationId}
      on:click={() => selectAutomation(automation._id)}
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
    margin: 0 calc(-1 * var(--spacing-xl));
  }
</style>
