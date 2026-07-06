<svelte:options runes={true} />

<script lang="ts">
  import { Body, ModalContent, Multiselect } from "@budibase/bbui"
  import type { ProjectResponse } from "@budibase/types"

  interface AssignableProjectResource {
    name: string
    typeLabel: string
    projectIds?: string[]
  }

  interface Props {
    resource?: AssignableProjectResource | null
    projects?: ProjectResponse[]
    onConfirm?: (_projectIds: string[]) => unknown
  }

  let { resource = null, projects = [], onConfirm = () => {} }: Props = $props()

  interface ProjectOption {
    label: string
    value: string
    color?: string
  }

  let selectedProjectIds: string[] = $derived(
    resource?.projectIds ? [...resource.projectIds] : []
  )

  const projectOptions: ProjectOption[] = $derived(
    projects.map(project => ({
      label: project.name,
      value: project._id,
      color: project.color,
    }))
  )
</script>

<ModalContent
  title={`Assign projects${resource ? ` to ${resource.name}` : ""}`}
  confirmText="Save"
  size="M"
  onConfirm={() => onConfirm(selectedProjectIds)}
>
  {#if resource}
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Choose which projects this {resource.typeLabel.toLowerCase()} belongs to.
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
