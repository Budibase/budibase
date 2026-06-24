<script lang="ts">
  import { Body, ModalContent, Multiselect } from "@budibase/bbui"
  import type { HomeRow, ProjectResponse } from "@budibase/types"

  export let row: HomeRow | null = null
  export let projects: ProjectResponse[] = []
  export let onConfirm: (_projectIds: string[] | undefined) => unknown = () => {}

  interface ProjectOption {
    label: string
    value: string
    color?: string
  }

  let selectedProjectIds: string[] = []
  let projectOptions: ProjectOption[] = []

  $: selectedProjectIds = row?.projectIds || []
  $: projectOptions = projects.map(project => ({
    label: project.name,
    value: project._id,
    color: project.color,
  }))
</script>

<ModalContent
  title={`Assign project${row ? ` to ${row.name}` : ""}`}
  confirmText="Save"
  size="M"
  onConfirm={() =>
    onConfirm(selectedProjectIds.length ? selectedProjectIds : undefined)}
>
  {#if row}
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Choose which projects this {row.type} belongs to.
    </Body>
  {/if}

  <Multiselect
    label="Projects"
    placeholder="No projects"
    bind:value={selectedProjectIds}
    options={projectOptions}
    getOptionLabel={option => option.label}
    getOptionValue={option => option.value}
  />
</ModalContent>
