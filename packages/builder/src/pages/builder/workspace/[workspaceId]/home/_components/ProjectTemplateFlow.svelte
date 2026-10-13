<svelte:options runes={true} />

<script lang="ts">
  import { getErrorMessage } from "@/helpers/errors"
  import { featureFlags, projectsStore } from "@/stores/portal"
  import { Modal, notifications, type ModalAPI } from "@budibase/bbui"
  import {
    FeatureFlag,
    type ImportProjectTemplateResponse,
    type ProjectTemplateMetadata,
  } from "@budibase/types"
  import { onDestroy } from "svelte"
  import ProjectTemplateGalleryModal from "./ProjectTemplateGalleryModal.svelte"

  interface ImportCompletedPayload {
    response: ImportProjectTemplateResponse
    workspaceId: string
  }

  interface Props {
    currentWorkspaceId?: string
    currentWorkspaceName?: string
    onImported?: (_payload: ImportCompletedPayload) => unknown
    onGalleryClose?: () => void
  }

  let {
    currentWorkspaceId = "",
    currentWorkspaceName = "",
    onImported = () => {},
    onGalleryClose = () => {},
  }: Props = $props()

  let galleryModal = $state<ModalAPI>()
  let galleryTemplates = $state<ProjectTemplateMetadata[]>([])
  let isLoadingGallery = $state(false)
  let galleryError = $state("")
  let isGalleryImporting = $state(false)
  let selectedGalleryTemplateKey = $state("")
  let isDestroyed = false

  const templatesEnabled = $derived(
    $featureFlags[FeatureFlag.PROJECTS] && $featureFlags[FeatureFlag.TEMPLATES]
  )

  const completeImport = async ({
    response,
    workspaceId,
  }: ImportCompletedPayload) => {
    try {
      await onImported({ response, workspaceId })
    } catch (error) {
      console.error("Unable to refresh after Project template import", error)
      notifications.warning(
        "Project imported, but the workspace could not be refreshed. Reload to see all imported resources."
      )
    }
  }

  const importGalleryTemplate = async (
    selectedTemplate: ProjectTemplateMetadata
  ) => {
    if (!currentWorkspaceId || isGalleryImporting) {
      return
    }

    const workspaceId = currentWorkspaceId
    selectedGalleryTemplateKey = selectedTemplate.key
    isGalleryImporting = true
    try {
      const response = await projectsStore.importTemplate({
        templateKey: selectedTemplate.key,
        workspaceId,
      })
      if (isDestroyed || workspaceId !== currentWorkspaceId) {
        return
      }
      galleryModal?.hide()
      onGalleryClose()
      await completeImport({ response, workspaceId })
    } catch (error) {
      console.error(error)
      notifications.error(
        getErrorMessage(error) || "Unable to import Project template"
      )
    } finally {
      selectedGalleryTemplateKey = ""
      isGalleryImporting = false
    }
  }

  const loadGalleryTemplates = async () => {
    if (isLoadingGallery) {
      return
    }

    isLoadingGallery = true
    galleryError = ""
    try {
      galleryTemplates = await projectsStore.fetchTemplates()
    } catch (error) {
      console.error(error)
      galleryError =
        getErrorMessage(error) || "Unable to load Project templates"
    } finally {
      isLoadingGallery = false
    }
  }

  export const showGallery = async () => {
    if (!templatesEnabled || isGalleryImporting) {
      return
    }

    galleryTemplates = []
    galleryModal?.show()
    await loadGalleryTemplates()
  }

  onDestroy(() => {
    isDestroyed = true
  })
</script>

{#if templatesEnabled}
  <Modal
    bind:this={galleryModal}
    disableCancel={isGalleryImporting}
    on:cancel={onGalleryClose}
  >
    <ProjectTemplateGalleryModal
      templates={galleryTemplates}
      workspaceName={currentWorkspaceName}
      isLoading={isLoadingGallery}
      error={galleryError}
      selectedTemplateKey={selectedGalleryTemplateKey}
      isImporting={isGalleryImporting}
      onSelect={importGalleryTemplate}
      onRetry={loadGalleryTemplates}
    />
  </Modal>
{/if}
