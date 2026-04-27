<script lang="ts">
  import { List, ListItem, ActionButton } from "@budibase/bbui"
  import DetailPopover from "@/components/common/DetailPopover.svelte"
  import { automationStore, appStore } from "@/stores/builder"
  import { AutomationActionStepId } from "@budibase/types"

  export let queryId: string

  let popover: DetailPopover

  $: connectedAutomations = findConnectedAutomations(
    $automationStore.automations,
    queryId
  )

  const findConnectedAutomations = (
    automations: typeof $automationStore.automations,
    queryId: string
  ) => {
    return automations.filter(automation =>
      automation.definition.steps.some(
        step =>
          (step.stepId === AutomationActionStepId.EXECUTE_QUERY ||
            step.stepId === AutomationActionStepId.API_REQUEST) &&
          step.inputs?.query?.queryId === queryId
      )
    )
  }

  export function show() {
    popover?.show()
  }

  export function hide() {
    popover?.hide()
  }
</script>

<DetailPopover title="Automations" bind:this={popover}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton
      icon="Branch3"
      quiet
      selected={open || !!connectedAutomations.length}
      accentColor="#E86C34"
      on:click={show}
    >
      Automations{connectedAutomations.length
        ? `: ${connectedAutomations.length}`
        : ""}
    </ActionButton>
  </svelte:fragment>

  {#if !connectedAutomations.length}
    There aren't any automations using this query.
  {:else}
    The following automations use this query.
    <List>
      {#each connectedAutomations as automation}
        <ListItem
          title={automation.name}
          url={`/builder/workspace/${$appStore.appId}/automation/${automation._id}`}
          showArrow
        />
      {/each}
    </List>
  {/if}
</DetailPopover>
