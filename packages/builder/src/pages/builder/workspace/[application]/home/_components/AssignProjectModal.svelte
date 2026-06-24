<svelte:options runes={true} />

<script lang="ts">
  import { Body, ModalContent, Multiselect } from "@budibase/bbui"
  import type { HomeRow, ProjectResponse } from "@budibase/types"

  interface Props {
    row?: HomeRow | null
    projects?: ProjectResponse[]
    onConfirm?: (_projectIds: string[] | undefined) => unknown
  }

  let { row = null, projects = [], onConfirm = () => {} }: Props = $props()

  interface ProjectOption {
    label: string
    value: string
    color?: string
  }

  let selectedProjectIds: string[] = $state([])
  let activeRowId = $state("")

  $effect(() => {
    if ((row?._id || "") === activeRowId) {
      return
    }
    activeRowId = row?._id || ""
    selectedProjectIds = row?.projectIds ? [...row.projectIds] : []
  })

  const projectOptions: ProjectOption[] = $derived(
    projects.map(project => ({
      label: project.name,
      value: project._id,
      color: project.color,
    }))
  )
</script>

<ModalContent
  title={`Assign projects${row ? ` to ${row.name}` : ""}`}
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
