<script lang="ts">
  import ProjectSelect from "@/components/common/ProjectSelect.svelte"
  import {
    Body,
    Checkbox,
    Icon,
    ModalContent,
    ProgressCircle,
  } from "@budibase/bbui"
  import {
    type PreviewProjectAssignmentRequest,
    type PreviewProjectAssignmentResponse,
    type ProjectAssignmentDependency,
  } from "@budibase/types"
  import { getErrorMessage } from "@/helpers/errors"
  import type { ProjectAssignmentSelection } from "./assignments"

  interface AssignableProjectResource {
    id: string
    revision: string
    name: string
    typeLabel: string
    projectIds?: string[]
  }

  interface Props {
    resource?: AssignableProjectResource | null
    onPreview?: (
      _request: PreviewProjectAssignmentRequest
    ) => Promise<PreviewProjectAssignmentResponse>
    onConfirm?: (_selection: ProjectAssignmentSelection) => unknown
  }

  let {
    resource = null,
    onPreview = async () => ({
      dependencies: [],
      dependencyFingerprint: "",
    }),
    onConfirm = () => {},
  }: Props = $props()

  let selectedProjectIds = $state(
    resource?.projectIds ? [...resource.projectIds] : []
  )
  let dependencies = $state<ProjectAssignmentDependency[]>([])
  let dependencyFingerprint = $state("")
  let deselectedDependencyIds = $state<Set<string>>(new Set())
  let previewLoading = $state(false)
  let previewError = $state("")
  let previewRequest = 0

  const selectedDependencyIds = $derived(
    dependencies
      .map(dependency => dependency.id)
      .filter(id => !deselectedDependencyIds.has(id))
  )

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
  const deselectedCount = $derived(
    dependencies.filter(dependency =>
      deselectedDependencyIds.has(dependency.id)
    ).length
  )

  const formatTypeLabel = (type: string) => {
    const label = type.replaceAll("_", " ")
    return `${label.charAt(0).toUpperCase()}${label.slice(1)}`
  }

  const setDependencySelected = (dependencyId: string, selected: boolean) => {
    const nextDeselected = new Set(deselectedDependencyIds)
    if (selected) {
      nextDeselected.delete(dependencyId)
    } else {
      nextDeselected.add(dependencyId)
    }
    deselectedDependencyIds = nextDeselected
  }

  $effect(() => {
    const resourceId = resource?.id
    const projectIds = [...selectedProjectIds]
    const request = ++previewRequest
    previewLoading = true
    previewError = ""
    dependencyFingerprint = ""

    const timeout = setTimeout(async () => {
      if (!resourceId) {
        dependencies = []
        previewLoading = false
        return
      }

      try {
        const response = await onPreview({ resourceId, projectIds })
        if (request !== previewRequest) {
          return
        }
        dependencies = sortDependencies(response.dependencies)
        dependencyFingerprint = response.dependencyFingerprint
        const dependencyIds = new Set(
          dependencies.map(dependency => dependency.id)
        )
        deselectedDependencyIds = new Set(
          Array.from(deselectedDependencyIds).filter(id =>
            dependencyIds.has(id)
          )
        )
      } catch (error) {
        if (request !== previewRequest) {
          return
        }
        dependencies = []
        dependencyFingerprint = ""
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
  title="Assign to projects"
  confirmText="Save changes"
  size="M"
  disabled={previewLoading ||
    !!previewError ||
    !resource?.revision ||
    !dependencyFingerprint}
  onConfirm={() =>
    onConfirm({
      projectIds: selectedProjectIds,
      dependencyIds: selectedDependencyIds,
      dependencyFingerprint,
    })}
>
  {#if resource}
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Choose which projects include {resource.name}
    </Body>
  {/if}

  <ProjectSelect bind:value={selectedProjectIds} />

  <div class="dependencies">
    <div class="dependency-heading">
      <Body size="S" weight="medium">Related resources</Body>
      <div aria-live="polite" aria-atomic="true">
        {#if !previewLoading && !previewError && dependencies.length}
          <Body size="XS" color="var(--spectrum-global-color-gray-700)">
            {selectedDependencyIds.length} of {dependencies.length} selected
          </Body>
        {/if}
      </div>
    </div>
    {#if previewLoading}
      <div class="dependency-state">
        <ProgressCircle size="S" />
        <Body size="S">Finding related resources</Body>
      </div>
    {:else if previewError}
      <Body size="S" color="var(--color-red-500)">
        Related resources couldn't be loaded: {previewError}
      </Body>
    {:else if !dependencies.length}
      <Body size="S" color="var(--spectrum-global-color-gray-700)">
        No related resources need to be added
      </Body>
    {:else}
      {#if resource}
        <Body size="S" color="var(--spectrum-global-color-gray-700)">
          Include the resources this {resource.typeLabel.toLowerCase()} uses in the
          same projects
        </Body>
      {/if}
      <div class="dependency-list">
        {#each dependencies as dependency (dependency.id)}
          <div class="dependency-row">
            <Checkbox
              size="S"
              text={dependency.name}
              value={selectedDependencyIds.includes(dependency.id)}
              on:change={event =>
                setDependencySelected(dependency.id, event.detail)}
            />
            <Body size="XS" color="var(--spectrum-global-color-gray-700)">
              {formatTypeLabel(dependency.type)}
            </Body>
          </div>
        {/each}
      </div>
    {/if}

    <div role="status" aria-atomic="true">
      {#if !previewLoading && !previewError && deselectedCount}
        <div class="dependency-warning">
          <div class="dependency-warning-icon">
            <Icon
              size="S"
              name="warning"
              color="var(--spectrum-global-color-yellow-400)"
            />
          </div>
          <div class="dependency-warning-copy">
            <Body
              size="S"
              weight="medium"
              color="var(--spectrum-global-color-yellow-400)"
            >
              {deselectedCount} related {deselectedCount === 1
                ? "resource"
                : "resources"} excluded
            </Body>
            <Body size="S" color="var(--spectrum-global-color-gray-700)">
              Exports without {deselectedCount === 1
                ? "this resource"
                : "these resources"} may not work as expected when imported
            </Body>
          </div>
        </div>
      {/if}
    </div>
  </div>
</ModalContent>

<style>
  .dependencies,
  .dependency-warning-copy {
    display: flex;
    flex-direction: column;
  }

  .dependencies {
    gap: var(--spacing-s);
  }

  .dependency-warning-copy {
    gap: var(--spacing-xs);
  }

  .dependency-heading,
  .dependency-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }

  .dependency-state {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .dependency-list {
    display: flex;
    flex-direction: column;
    max-height: 260px;
    overflow-y: auto;
  }

  .dependency-row {
    min-height: 40px;
    padding: var(--spacing-xs) 0;
  }

  .dependency-row + .dependency-row {
    border-top: 1px solid var(--spectrum-global-color-gray-300);
  }

  .dependency-warning {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-s);
  }

  .dependency-warning-icon {
    display: flex;
    align-items: center;
    height: 20px;
  }
</style>
