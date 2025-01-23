<script>
  import { ActionButton, List, ListItem, Button } from "@budibase/bbui"
  import DetailPopover from "@/components/common/DetailPopover.svelte"
  import { TriggerStepID } from "@/constants/backend/automations"
  import { automationStore, appStore } from "@/stores/builder"
  import { createEventDispatcher, getContext } from "svelte"

  const dispatch = createEventDispatcher()
  const { datasource } = getContext("grid")
  const triggerTypes = [
    TriggerStepID.ROW_SAVED,
    TriggerStepID.ROW_UPDATED,
    TriggerStepID.ROW_DELETED,
  ]

  let popover

  $: ds = $datasource
  $: resourceId = ds?.type === "table" ? ds.tableId : ds?.id
  $: connectedAutomations = findConnectedAutomations(
    $automationStore.automations,
    resourceId
  )
  $: automationCount = connectedAutomations.length

  const findConnectedAutomations = (automations, resourceId) => {
    return automations.filter(automation => {
      if (!triggerTypes.includes(automation.definition?.trigger?.stepId)) {
        return false
      }
      return automation.definition?.trigger?.inputs?.tableId === resourceId
    })
  }

  const generateAutomation = () => {
    popover?.hide()
    dispatch("generate")
  }
</script>

<DetailPopover title="Automations" bind:this={popover}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton
      icon="JourneyVoyager"
      selected={open || automationCount}
      quiet
      accentColor="#5610AD"
    >
      Automations{automationCount ? `: ${automationCount}` : ""}
    </ActionButton>
  </svelte:fragment>
  {#if !connectedAutomations.length}
    There aren't any automations connected to this data.
  {:else}
    The following automations are connected to this data.
    <List>
      {#each connectedAutomations as automation}
        <ListItem
          icon={automation.disabled ? "PauseCircle" : "PlayCircle"}
          iconColor={automation.disabled
            ? "var(--spectrum-global-color-gray-600)"
            : "var(--spectrum-global-color-green-600)"}
          title={automation.name}
          url={`/builder/app/${$appStore.appId}/automation/${automation._id}`}
          showArrow
        />
      {/each}
    </List>
  {/if}
  <div>
    <Button secondary icon="JourneyVoyager" on:click={generateAutomation}>
      Generate automation
    </Button>
  </div>
</DetailPopover>
