<script lang="ts">
  import { Select } from "@budibase/bbui"
  import { FeatureFlag } from "@budibase/types"
  import { featureFlags, playbooksStore } from "@/stores/portal"

  interface PlaybookOption {
    label: string
    value: string
    color?: string
  }

  export let value = ""
  export let label = "Playbook"
  export let includeEmptyOption = true
  export let emptyLabel = "No playbook"

  let requested = false
  let options: PlaybookOption[] = []

  $: playbooksEnabled = $featureFlags[FeatureFlag.PLAYBOOKS]

  $: if (playbooksEnabled && !requested && !$playbooksStore.length) {
    requested = true
    playbooksStore.fetch().catch(console.error)
  }

  $: options = [
    ...(includeEmptyOption
      ? [{ label: emptyLabel, value: "", color: undefined }]
      : []),
    ...$playbooksStore.map(playbook => ({
      label: playbook.name,
      value: playbook._id,
      color: playbook.color,
    })),
  ]
</script>

{#if playbooksEnabled}
  <Select
    {label}
    bind:value
    {options}
    getOptionLabel={option => option.label}
    getOptionValue={option => option.value}
    getOptionColour={option => option.color}
  />
{/if}
