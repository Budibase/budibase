<svelte:options runes={true} />

<script lang="ts">
  import { Body, Input, Layout, ModalContent, Select } from "@budibase/bbui"
  import type { ProjectTemplateMetadata } from "@budibase/types"

  const CREATE_WORKSPACE_ID = "__create_workspace__"

  export interface ProjectTemplateWorkspaceOption {
    id: string
    name: string
  }

  interface ConfirmPayload {
    templateKey: string
    workspaceId?: string
    workspaceName?: string
  }

  interface Props {
    template: ProjectTemplateMetadata
    workspaces?: ProjectTemplateWorkspaceOption[]
    currentWorkspaceId?: string
    canCreateWorkspace?: boolean
    createdWorkspace?: ProjectTemplateWorkspaceOption
    onConfirm?: (_payload: ConfirmPayload) => unknown
  }

  let {
    template,
    workspaces = [],
    currentWorkspaceId = "",
    canCreateWorkspace = false,
    createdWorkspace,
    onConfirm = () => {},
  }: Props = $props()

  const destinationOptions = $derived([
    ...(canCreateWorkspace
      ? [{ id: CREATE_WORKSPACE_ID, name: "Create a new workspace" }]
      : []),
    ...workspaces,
  ])

  const getDefaultWorkspaceId = () => {
    if (workspaces.some(workspace => workspace.id === currentWorkspaceId)) {
      return currentWorkspaceId
    }
    if (workspaces[0]?.id) {
      return workspaces[0].id
    }
    return canCreateWorkspace ? CREATE_WORKSPACE_ID : ""
  }

  let selectedWorkspaceId = $state(getDefaultWorkspaceId())
  let workspaceName = $state(`${template.name} workspace`)
  const isCreatingWorkspace = $derived(
    selectedWorkspaceId === CREATE_WORKSPACE_ID
  )
  const selectedWorkspace = $derived(
    workspaces.find(workspace => workspace.id === selectedWorkspaceId)
  )
  const canConfirm = $derived(
    !!createdWorkspace ||
      (isCreatingWorkspace ? !!workspaceName.trim() : !!selectedWorkspaceId)
  )

  const getWorkspaceLabel = (workspace: ProjectTemplateWorkspaceOption) => {
    if (workspace.id === CREATE_WORKSPACE_ID) {
      return workspace.name
    }
    if (workspace.id === currentWorkspaceId) {
      return `${workspace.name} (current workspace)`
    }
    return workspace.name
  }

  const confirm = () => {
    if (!canConfirm) {
      return
    }
    if (createdWorkspace) {
      return onConfirm({
        templateKey: template.key,
        workspaceId: createdWorkspace.id,
      })
    }
    if (isCreatingWorkspace) {
      return onConfirm({
        templateKey: template.key,
        workspaceName: workspaceName.trim(),
      })
    }
    return onConfirm({
      templateKey: template.key,
      workspaceId: selectedWorkspaceId,
    })
  }
</script>

<ModalContent
  title={`Use ${template.name}`}
  confirmText="Import project"
  size="M"
  disabled={!canConfirm}
  disableCancelOnConfirm
  onConfirm={confirm}
>
  <Layout noPadding gap="S">
    <Body size="S">{template.description}</Body>
    {#if template.status === "deprecated" && template.deprecation}
      <Body size="S">
        {template.deprecation.message}
        {#if template.deprecation.replacementKey}
          Use {template.deprecation.replacementKey} for new projects.
        {/if}
      </Body>
    {/if}
    {#if createdWorkspace}
      <Body size="S">
        Workspace <b>{createdWorkspace.name}</b> was created. Retry to import the
        Project into it.
      </Body>
    {:else if destinationOptions.length}
      <Select
        id="project-template-destination"
        label="Destination workspace"
        bind:value={selectedWorkspaceId}
        options={destinationOptions}
        getOptionLabel={getWorkspaceLabel}
        getOptionValue={workspace => workspace.id}
        getOptionIcon={() => undefined}
      />
      {#if isCreatingWorkspace}
        <Input
          id="project-template-workspace-name"
          label="Workspace name"
          bind:value={workspaceName}
        />
        <Body size="S">
          This creates a new workspace, imports the Project into it, and then
          opens the imported Project. Nothing is deployed automatically.
        </Body>
      {:else}
        <Body size="S">
          This creates a new Project in
          <b>{selectedWorkspace?.name || "the selected workspace"}</b>. Existing
          workspace resources will not be replaced.
        </Body>
      {/if}
    {:else}
      <Body size="S">
        No editable workspace is available. Create a workspace before importing
        this Project template.
      </Body>
    {/if}
  </Layout>
</ModalContent>
