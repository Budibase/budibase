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
  import ProjectTemplateGalleryModal from "./ProjectTemplateGalleryModal.svelte"

  interface ImportCompletedPayload {
    response: ImportProjectTemplateResponse
    workspaceId: string
  }

  interface Props {
    currentWorkspaceId?: string
    currentWorkspaceName?: string
    onImported?: (_payload: ImportCompletedPayload) => unknown
    onGalleryCancel?: () => void
  }

  let {
    currentWorkspaceId = "",
    currentWorkspaceName = "",
    onImported = () => {},
    onGalleryCancel = () => {},
  }: Props = $props()

  let galleryModal = $state<ModalAPI>()
  let galleryTemplates = $state<ProjectTemplateMetadata[]>([])
  let isLoadingGallery = $state(false)
  let galleryError = $state("")
  let isGalleryImporting = $state(false)
  let selectedGalleryTemplateKey = $state("")

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

    selectedGalleryTemplateKey = selectedTemplate.key
    isGalleryImporting = true
    try {
      const response = await projectsStore.importTemplate({
        templateKey: selectedTemplate.key,
        workspaceId: currentWorkspaceId,
      })
      galleryModal?.hide()
      await completeImport({ response, workspaceId: currentWorkspaceId })
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
</script>

{#if templatesEnabled}
  <Modal
    bind:this={galleryModal}
    disableCancel={isGalleryImporting}
    on:cancel={onGalleryCancel}
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
