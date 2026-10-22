<svelte:options runes={true} />

<script lang="ts">
  import { API } from "@/api"
  import { getErrorMessage } from "@/helpers/errors"
  import {
    auth,
    featureFlags,
    projectsStore,
    workspacesStore,
  } from "@/stores/portal"
  import { Modal, keepOpen, notifications, type ModalAPI } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import {
    FeatureFlag,
    type CreateWorkspaceResponse,
    type ImportProjectTemplateResponse,
    type ProjectTemplateMetadata,
  } from "@budibase/types"
  import { onDestroy, onMount, tick } from "svelte"
  import ImportProjectTemplateModal, {
    type ProjectTemplateWorkspaceOption,
  } from "./ImportProjectTemplateModal.svelte"
  import ProjectTemplateGalleryModal from "./ProjectTemplateGalleryModal.svelte"

  interface ImportCompletedPayload {
    response: ImportProjectTemplateResponse
    workspaceId: string
  }

  interface Props {
    workspaces?: ProjectTemplateWorkspaceOption[]
    currentWorkspaceId?: string
    currentWorkspaceName?: string
    canCreateWorkspace?: boolean
    onImported?: (_payload: ImportCompletedPayload) => unknown
    onGalleryClose?: () => void
  }

  let {
    workspaces = [],
    currentWorkspaceId = "",
    currentWorkspaceName = "",
    canCreateWorkspace = false,
    onImported = () => {},
    onGalleryClose = () => {},
  }: Props = $props()

  let modal = $state<ModalAPI>()
  let galleryModal = $state<ModalAPI>()
  let template = $state<ProjectTemplateMetadata>()
  let galleryTemplates = $state<ProjectTemplateMetadata[]>([])
  let handledTemplateKey = $state("")
  let isResolvingIntent = $state(false)
  let isImporting = $state(false)
  let isLoadingGallery = $state(false)
  let galleryError = $state("")
  let isGalleryImporting = $state(false)
  let selectedGalleryTemplateKey = $state("")
  let isDestroyed = false
  let createdWorkspace = $state<ProjectTemplateWorkspaceOption>()
  let createdWorkspaceAppId = $state("")

  const templatesEnabled = $derived(
    $featureFlags[FeatureFlag.PROJECTS] && $featureFlags[FeatureFlag.TEMPLATES]
  )

  const clearIntent = async () => {
    await auth.setInitInfo({})
    handledTemplateKey = ""
    template = undefined
  }

  const dismissIntent = async () => {
    try {
      await clearIntent()
      return true
    } catch (error) {
      console.error("Unable to dismiss Project template intent", error)
      notifications.error(
        "Unable to dismiss this Project template. Try again before leaving the workspace."
      )
      return false
    }
  }

  const handleIntent = async () => {
    const intent = $auth.initInfo?.projectTemplate
    if (!intent || handledTemplateKey === intent.templateKey) {
      return
    }

    handledTemplateKey = intent.templateKey
    isResolvingIntent = true
    try {
      if (!templatesEnabled) {
        await clearIntent()
        return
      }

      const templates = await projectsStore.fetchTemplates()
      const resolvedTemplate = templates.find(
        candidate => candidate.key === intent.templateKey
      )
      if (!resolvedTemplate) {
        await clearIntent()
        notifications.error("This Project template is no longer available.")
        return
      }

      createdWorkspace = undefined
      createdWorkspaceAppId = ""
      template = resolvedTemplate
      await tick()
      modal?.show()
    } catch (error) {
      handledTemplateKey = ""
      console.error(error)
      notifications.error(
        getErrorMessage(error) || "Unable to load the Project template"
      )
    } finally {
      isResolvingIntent = false
    }
  }

  const prepareCreatedWorkspace = async () => {
    if (!createdWorkspace) {
      throw new Error("The destination workspace was not created.")
    }
    if (!sdk.users.isBuilder($auth.user, createdWorkspaceAppId)) {
      await auth.getSelf()
    }
    await workspacesStore.load()
    return createdWorkspace.id
  }

  const createWorkspace = async (name: string) => {
    if (!canCreateWorkspace) {
      throw new Error(
        "Your plan or role does not allow creating another workspace."
      )
    }
    if (!createdWorkspace) {
      const data = new FormData()
      data.append("name", name)
      const response: CreateWorkspaceResponse = await API.createApp(data)
      createdWorkspace = { id: response.instance._id, name }
      createdWorkspaceAppId = response.appId
    }

    return await prepareCreatedWorkspace()
  }

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

  const importTemplate = async ({
    templateKey,
    workspaceId,
    workspaceName,
  }: {
    templateKey: string
    workspaceId?: string
    workspaceName?: string
  }) => {
    const originWorkspaceId = currentWorkspaceId
    isImporting = true
    try {
      let destinationWorkspaceId = workspaceId
      if (workspaceName) {
        destinationWorkspaceId = await createWorkspace(workspaceName)
      } else if (createdWorkspace?.id === workspaceId) {
        destinationWorkspaceId = await prepareCreatedWorkspace()
      }
      if (!destinationWorkspaceId) {
        throw new Error("Select a destination workspace.")
      }

      const response = await projectsStore.importTemplate({
        templateKey,
        workspaceId: destinationWorkspaceId,
      })
      if ($auth.initInfo?.projectTemplate?.templateKey === templateKey) {
        auth.clearInitInfoState()
      }
      if (isDestroyed || originWorkspaceId !== currentWorkspaceId) {
        return
      }
      modal?.hide()
      template = undefined
      createdWorkspace = undefined
      createdWorkspaceAppId = ""

      await completeImport({ response, workspaceId: destinationWorkspaceId })
    } catch (error) {
      console.error(error)
      if (createdWorkspace) {
        notifications.error(
          `Workspace '${createdWorkspace.name}' was created, but the Project could not be imported. Retry to import into that workspace.`
        )
      } else {
        notifications.error(
          getErrorMessage(error) || "Unable to import Project template"
        )
      }
      return keepOpen
    } finally {
      isImporting = false
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
      auth.clearInitInfoState()
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
    if (
      !templatesEnabled ||
      template ||
      isResolvingIntent ||
      isGalleryImporting
    ) {
      return
    }

    if ($auth.initInfo?.projectTemplate) {
      await handleIntent()
      return
    }

    galleryTemplates = []
    galleryModal?.show()
    await loadGalleryTemplates()
  }

  onDestroy(() => {
    isDestroyed = true
  })

  onMount(async () => {
    await handleIntent()
  })
</script>

{#if template && templatesEnabled}
  <Modal
    bind:this={modal}
    beforeClose={dismissIntent}
    disableCancel={isImporting}
  >
    <ImportProjectTemplateModal
      {template}
      {workspaces}
      {currentWorkspaceId}
      {canCreateWorkspace}
      {createdWorkspace}
      onConfirm={importTemplate}
    />
  </Modal>
{/if}

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
