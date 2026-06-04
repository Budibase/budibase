<script lang="ts">
  import { Select } from "@budibase/bbui"
  import { FeatureFlag } from "@budibase/types"
  import { featureFlags, projectsStore } from "@/stores/portal"

  interface ProjectOption {
    label: string
    value: string
    color?: string
  }

  export let value = ""
  export let label = "Project"
  export let includeEmptyOption = true
  export let emptyLabel = "No project"

  let options: ProjectOption[] = []

  $: projectsEnabled = $featureFlags[FeatureFlag.PROJECTS]

  $: if (projectsEnabled) {
    projectsStore.ensureFetched().catch(console.error)
  }

  $: options = [
    ...(includeEmptyOption
      ? [{ label: emptyLabel, value: "", color: undefined }]
      : []),
    ...$projectsStore.map(project => ({
      label: project.name,
      value: project._id,
      color: project.color,
    })),
  ]
</script>

{#if projectsEnabled}
  <Select
    {label}
    bind:value
    {options}
    getOptionLabel={option => option.label}
    getOptionValue={option => option.value}
    getOptionColour={option => option.color}
  />
{/if}
