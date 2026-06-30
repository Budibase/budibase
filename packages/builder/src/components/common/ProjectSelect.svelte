<svelte:options runes={true} />

<script lang="ts">
  import { Multiselect, type LabelPosition } from "@budibase/bbui"
  import { FeatureFlag } from "@budibase/types"
  import { featureFlags, projectsStore } from "@/stores/portal"
  import { appStore } from "@/stores/builder"

  interface ProjectOption {
    label: string
    value: string
    color?: string
  }

  interface Props {
    value?: string[]
    label?: string
    labelPosition?: LabelPosition
    autoWidth?: boolean
  }

  let {
    value = $bindable([]),
    label = "Projects",
    labelPosition = "above",
    autoWidth = false,
  }: Props = $props()

  let fetchError: string | undefined = $state()

  const projectsEnabled = $derived($featureFlags[FeatureFlag.PROJECTS])
  const workspaceId = $derived($appStore.appId)
  const options: ProjectOption[] = $derived(
    $projectsStore.map(project => ({
      label: project.name,
      value: project._id,
      color: project.color,
    }))
  )

  $effect(() => {
    if (!projectsEnabled || !workspaceId) {
      return
    }
    const requestWorkspaceId = workspaceId
    fetchError = undefined
    projectsStore.ensureFetched(workspaceId).catch(() => {
      if (workspaceId === requestWorkspaceId) {
        fetchError = "Projects could not be loaded."
      }
    })
  })
</script>

{#if projectsEnabled}
  <Multiselect
    {label}
    {labelPosition}
    placeholder="No projects"
    bind:value
    {options}
    {autoWidth}
    getOptionLabel={option => option.label}
    getOptionValue={option => option.value}
    error={fetchError}
  />
{/if}
