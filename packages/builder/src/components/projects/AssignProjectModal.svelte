<script lang="ts">
  import {
    Body,
    Button,
    Checkbox,
    Icon,
    ModalContent,
    ProgressCircle,
    keepOpen,
  } from "@budibase/bbui"
  import type {
    PreviewProjectAssignmentRequest,
    PreviewProjectAssignmentResponse,
    UpdateProjectAssignmentRequest,
  } from "@budibase/types"
  import ProjectSelect from "@/components/common/ProjectSelect.svelte"
  import { getErrorMessage } from "@/helpers/errors"

  interface AssignableProjectResource {
    id: string
    revision: string
    name: string
    typeLabel: string
    projectIds?: string[]
  }

  interface Props {
    resource: AssignableProjectResource
    onPreview: (
      _request: PreviewProjectAssignmentRequest
    ) => Promise<PreviewProjectAssignmentResponse>
    onConfirm: (_selection: UpdateProjectAssignmentRequest) => unknown
  }

  let { resource, onPreview, onConfirm }: Props = $props()

  let assignedProjectIds = resource.projectIds || []
  // Keep the original revision until the user explicitly refreshes a conflict.
  let resourceRevision = resource.revision
  let selectedProjectIds = $state([...assignedProjectIds])
  let preview = $state<PreviewProjectAssignmentResponse>()
  const dependencies = $derived(preview?.dependencies || [])
  let deselectedDependencyIds = $state<Set<string>>(new Set())
  let previewLoading = $state(false)
  let previewError = $state("")
  let saveError = $state("")
  let assignmentStale = $state(false)
  let refreshingResource = $state(false)
  let refreshAttempt = $state(0)
  let latestPreviewRequest: PreviewProjectAssignmentRequest | undefined

  const selectedDependencyIds = $derived(
    dependencies
      .map(dependency => dependency.id)
      .filter(id => !deselectedDependencyIds.has(id))
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

  const refreshPreview = () => {
    saveError = ""
    refreshAttempt += 1
  }

  $effect(() => {
    const request = {
      resourceId: resource.id,
      projectIds: [...selectedProjectIds],
      refreshAttempt,
      refreshResource: refreshingResource,
    }
    latestPreviewRequest = request
    previewLoading = true
    previewError = ""
    preview = undefined

    const timeout = setTimeout(async () => {
      try {
        const response = await onPreview({
          resourceId: request.resourceId,
          projectIds: request.projectIds,
        })
        if (request !== latestPreviewRequest) {
          return
        }
        if (!request.refreshResource) {
          preview = response
          return
        }

        const removed = assignedProjectIds.filter(
          id => !request.projectIds.includes(id)
        )
        const added = request.projectIds.filter(
          id => !assignedProjectIds.includes(id)
        )
        selectedProjectIds = [
          ...new Set([
            ...response.resourceProjectIds.filter(id => !removed.includes(id)),
            ...added,
          ]),
        ]
        assignedProjectIds = response.resourceProjectIds
        resourceRevision = response.resourceRev
        refreshingResource = false
        assignmentStale = false
      } catch (error) {
        if (request === latestPreviewRequest) {
          previewError = getErrorMessage(error) || "Please try again"
        }
      } finally {
        if (request === latestPreviewRequest) {
          previewLoading = false
        }
      }
    }, 150)

    return () => {
      clearTimeout(timeout)
      latestPreviewRequest = undefined
    }
  })

  const confirm = async () => {
    if (!preview) {
      return keepOpen
    }
    saveError = ""
    try {
      return await onConfirm({
        resourceRev: resourceRevision,
        projectIds: selectedProjectIds,
        dependencyIds: selectedDependencyIds,
        dependencyFingerprint: preview.dependencyFingerprint,
      })
    } catch (error) {
      saveError = getErrorMessage(error) || "Unable to update project"
      assignmentStale =
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        error.status === 409
      return keepOpen
    }
  }
</script>

<ModalContent
  title="Assign to projects"
  confirmText="Save changes"
  size="M"
  disabled={previewLoading || !!previewError || assignmentStale || !preview}
  onConfirm={confirm}
>
  <Body size="S" color="var(--spectrum-global-color-gray-700)">
    Choose which projects include
    <span class="resource-name">{resource.name}</span>
  </Body>

  <ProjectSelect bind:value={selectedProjectIds} />

  <div class="dependencies">
    <div class="dependency-heading">
      <Body size="S" weight="500">Related resources</Body>
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
      <div class="dependency-error" role="alert">
        <Body size="S" color="var(--color-red-500)">
          Related resources couldn't be loaded: {previewError}
        </Body>
        <Button secondary on:click={refreshPreview}>Retry</Button>
      </div>
    {:else if !dependencies.length}
      <Body size="S" color="var(--spectrum-global-color-gray-700)">
        No related resources need to be added
      </Body>
    {:else}
      <Body size="S" color="var(--spectrum-global-color-gray-700)">
        Include the resources this {resource.typeLabel.toLowerCase()} uses in the
        same projects
      </Body>
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

    {#if saveError}
      <div class="dependency-error" role="alert">
        <Body size="S" color="var(--color-red-500)">{saveError}</Body>
        {#if assignmentStale}
          <Body size="S">
            Refresh project assignments and review your selections before saving
            again. Your changes and exclusions will be kept.
          </Body>
          <Button
            secondary
            on:click={() => {
              refreshingResource = true
              refreshPreview()
            }}
          >
            Refresh and review
          </Button>
        {/if}
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
            <Body size="S" weight="500">
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
  .dependency-error,
  .dependency-warning-copy {
    display: flex;
    flex-direction: column;
  }

  .dependencies {
    gap: var(--spacing-s);
  }

  .dependency-error {
    align-items: flex-start;
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

  .resource-name {
    color: var(--spectrum-global-color-gray-900);
    font-weight: 500;
  }
</style>
