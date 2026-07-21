<svelte:options runes={true} />

<script lang="ts">
  import ProjectSelect from "@/components/common/ProjectSelect.svelte"
  import { Body, Checkbox, ModalContent, ProgressCircle } from "@budibase/bbui"
  import {
    type PreviewProjectAssignmentResponse,
    type ProjectAssignmentDependency,
  } from "@budibase/types"
  import { getErrorMessage } from "@/helpers/errors"

  interface AssignableProjectResource {
    id: string
    revision: string
    name: string
    typeLabel: string
    projectIds?: string[]
  }

  interface ProjectAssignmentSelection {
    projectIds: string[]
    dependencyIds: string[]
  }

  interface Props {
    resource?: AssignableProjectResource | null
    onPreview?: (
      _resourceId: string,
      _projectIds: string[]
    ) => Promise<PreviewProjectAssignmentResponse>
    onConfirm?: (_selection: ProjectAssignmentSelection) => unknown
  }

  let {
    resource = null,
    onPreview = async () => ({ dependencies: [] }),
    onConfirm = () => {},
  }: Props = $props()

  let selectedProjectIds = $state(
    resource?.projectIds ? [...resource.projectIds] : []
  )
  let dependencies = $state<ProjectAssignmentDependency[]>([])
  let selectedDependencyIds = $state<string[]>([])
  let deselectedDependencyIds = $state<Set<string>>(new Set())
  let previewLoading = $state(false)
  let previewError = $state("")
  let previewRequest = 0

  const compareStrings = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0)
  const sortDependencies = (
    resources: ProjectAssignmentDependency[]
  ): ProjectAssignmentDependency[] =>
    [...resources].sort(
      (a, b) =>
        compareStrings(a.type, b.type) ||
        compareStrings(a.name, b.name) ||
        compareStrings(a.id, b.id)
    )
  const groupedDependencies = $derived(
    Object.entries(
      dependencies.reduce<Record<string, ProjectAssignmentDependency[]>>(
        (groups, dependency) => {
          groups[dependency.type] = [
            ...(groups[dependency.type] || []),
            dependency,
          ]
          return groups
        },
        {}
      )
    )
  )
  const deselectedCount = $derived(
    dependencies.filter(dependency =>
      deselectedDependencyIds.has(dependency.id)
    ).length
  )

  const setDependencySelected = (dependencyId: string, selected: boolean) => {
    const nextDeselected = new Set(deselectedDependencyIds)
    if (selected) {
      nextDeselected.delete(dependencyId)
    } else {
      nextDeselected.add(dependencyId)
    }
    deselectedDependencyIds = nextDeselected
    selectedDependencyIds = dependencies
      .map(dependency => dependency.id)
      .filter(id => !nextDeselected.has(id))
  }

  $effect(() => {
    const resourceId = resource?.id
    const projectIds = [...selectedProjectIds]
    const request = ++previewRequest
    previewLoading = true
    previewError = ""

    const timeout = setTimeout(async () => {
      if (!resourceId) {
        dependencies = []
        selectedDependencyIds = []
        previewLoading = false
        return
      }

      try {
        const response = await onPreview(resourceId, projectIds)
        if (request !== previewRequest) {
          return
        }
        dependencies = sortDependencies(response.dependencies)
        const dependencyIds = new Set(
          dependencies.map(dependency => dependency.id)
        )
        deselectedDependencyIds = new Set(
          Array.from(deselectedDependencyIds).filter(id =>
            dependencyIds.has(id)
          )
        )
        selectedDependencyIds = dependencies
          .map(dependency => dependency.id)
          .filter(id => !deselectedDependencyIds.has(id))
      } catch (error) {
        if (request !== previewRequest) {
          return
        }
        dependencies = []
        selectedDependencyIds = []
        previewError = getErrorMessage(error)
      } finally {
        if (request === previewRequest) {
          previewLoading = false
        }
      }
    }, 150)

    return () => clearTimeout(timeout)
  })
</script>

<ModalContent
  title={`Assign projects${resource ? ` to ${resource.name}` : ""}`}
  confirmText="Save"
  size="M"
  disabled={previewLoading || !!previewError || !resource?.revision}
  onConfirm={() =>
    onConfirm({
      projectIds: selectedProjectIds,
      dependencyIds: selectedDependencyIds,
    })}
>
  {#if resource}
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Choose which projects this {resource.typeLabel.toLowerCase()} belongs to.
    </Body>
  {/if}

  <ProjectSelect bind:value={selectedProjectIds} />

  <div class="dependencies">
    <Body size="S" weight="medium">Dependencies</Body>
    {#if previewLoading}
      <div class="dependency-state">
        <ProgressCircle size="S" />
        <Body size="S">Checking dependencies…</Body>
      </div>
    {:else if previewError}
      <Body size="S" color="var(--color-red-500)">
        Unable to load dependencies: {previewError}
      </Body>
    {:else if !dependencies.length}
      <Body size="S" color="var(--spectrum-global-color-gray-700)">
        No additional dependencies
      </Body>
    {:else}
      <Body size="S" color="var(--spectrum-global-color-gray-700)">
        {selectedDependencyIds.length} of {dependencies.length} dependencies will
        be added.
      </Body>
      <div class="dependency-list">
        {#each groupedDependencies as [type, resources] (type)}
          <div class="dependency-group">
            <Body size="S" weight="medium">{type.replaceAll("_", " ")}</Body>
            {#each resources as dependency (dependency.id)}
              <Checkbox
                size="S"
                text={dependency.name}
                value={selectedDependencyIds.includes(dependency.id)}
                on:change={event =>
                  setDependencySelected(dependency.id, event.detail)}
              />
            {/each}
          </div>
        {/each}
      </div>
    {/if}

    {#if deselectedCount}
      <div class="dependency-warning">
        <Body size="S" color="var(--color-orange-600)">
          Deselected dependencies will not be part of these projects or their
          exports. Referencing resources may not work after import.
        </Body>
      </div>
    {/if}
  </div>
</ModalContent>

<style>
  .dependencies,
  .dependency-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .dependency-state {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .dependency-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    max-height: 260px;
    overflow-y: auto;
    padding: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
  }

  .dependency-warning {
    padding: var(--spacing-s);
    background: var(--color-orange-50);
    border-radius: var(--border-radius-s);
  }
</style>
