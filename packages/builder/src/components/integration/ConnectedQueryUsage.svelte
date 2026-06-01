<script lang="ts">
  import { onMount } from "svelte"

  import { screenStore, automationStore } from "@/stores/builder"
  import UsagePopover from "@/components/common/UsagePopover.svelte"
  import type {
    Automation,
    AutomationUsage,
    ScreenUsage,
  } from "@budibase/types"

  interface Props {
    sourceId: string
    buttonText?: string
    icon?: string
  }

  let {
    sourceId,
    buttonText = "Usage",
    icon = "link-simple-horizontal-break",
  }: Props = $props()

  let screens = $state<ScreenUsage[]>([])
  let popover = $state<UsagePopover>()

  export function show() {
    popover?.show()
  }

  export function hide() {
    popover?.hide()
  }

  const findConnectedAutomations = (
    automations: Automation[],
    queryId: string
  ): AutomationUsage[] => {
    if (!queryId) {
      return []
    }
    const needle = `"${queryId}"`
    return automations
      .filter(automation =>
        JSON.stringify(automation.definition || {}).includes(needle)
      )
      .map(automation => ({
        _id: automation._id!,
        name: automation.name,
        disabled: automation.disabled,
      }))
  }

  let connectedAutomations = $derived(
    findConnectedAutomations($automationStore.automations, sourceId)
  )

  onMount(async () => {
    if (!sourceId) {
      return
    }
    const response = await screenStore.usageInScreens(sourceId)
    screens = response?.screens ?? []
  })
</script>

<UsagePopover
  bind:this={popover}
  {screens}
  automations={connectedAutomations}
  {icon}
  {buttonText}
  showCount
/>
