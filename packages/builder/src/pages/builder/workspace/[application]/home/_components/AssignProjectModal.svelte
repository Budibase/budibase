<script lang="ts">
  import { Body, ModalContent, Select } from "@budibase/bbui"
  import type { HomeRow, ProjectResponse } from "@budibase/types"

  export let row: HomeRow | null = null
  export let projects: ProjectResponse[] = []
  export let onConfirm: (_projectId: string | undefined) => unknown = () => {}

  interface ProjectOption {
    label: string
    value: string
    color?: string
  }

  let selectedProjectId = ""
  let projectOptions: ProjectOption[] = []

  $: selectedProjectId = row?.projectId || ""
  $: projectOptions = [
    { label: "No project", value: "", color: undefined },
    ...projects.map(project => ({
      label: project.name,
      value: project._id,
      color: project.color,
    })),
  ] satisfies ProjectOption[]
</script>

<ModalContent
  title={`Assign project${row ? ` to ${row.name}` : ""}`}
  confirmText="Save"
  size="M"
  onConfirm={() => onConfirm(selectedProjectId || undefined)}
>
  {#if row}
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Choose which project this {row.type} belongs to.
    </Body>
  {/if}

  <Select
    label="Project"
    bind:value={selectedProjectId}
    options={projectOptions}
    getOptionLabel={option => option.label}
    getOptionValue={option => option.value}
    getOptionColour={option => option.color}
  />
</ModalContent>
