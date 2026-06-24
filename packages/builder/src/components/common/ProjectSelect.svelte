<script lang="ts">
  import { Multiselect } from "@budibase/bbui"
  import { FeatureFlag } from "@budibase/types"
  import { featureFlags, projectsStore } from "@/stores/portal"
  import { appStore } from "@/stores/builder"

  interface ProjectOption {
    label: string
    value: string
    color?: string
  }

  export let value: string[] = []
  export let label = "Projects"

  let options: ProjectOption[] = []
  let fetchError: string | undefined

  $: projectsEnabled = $featureFlags[FeatureFlag.PROJECTS]
  $: workspaceId = $appStore.appId
  $: value = Array.isArray(value) ? value : []

  $: if (projectsEnabled && workspaceId) {
    fetchError = undefined
    projectsStore.ensureFetched(workspaceId).catch(() => {
      fetchError = "Projects could not be loaded."
    })
  }

  $: options = $projectsStore.map(project => ({
    label: project.name,
    value: project._id,
    color: project.color,
  }))
</script>

{#if projectsEnabled}
  <Multiselect
    {label}
    placeholder="No projects"
    bind:value
    {options}
    getOptionLabel={option => option.label}
    getOptionValue={option => option.value}
    error={fetchError}
    disabled={!!fetchError}
  />
{/if}
