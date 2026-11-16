<script lang="ts">
  import {
    Body,
    InlineAlert,
    Input,
    ModalContent,
    Select,
    Toggle,
  } from "@budibase/bbui"
  import type { ExportProjectRequest, ProjectResponse } from "@budibase/types"

  interface ConfirmPayload extends ExportProjectRequest {
    id: string
  }

  interface Props {
    projects?: ProjectResponse[]
    selectedProjectId?: string
    projectIdsWithResources?: string[]
    onConfirm?: (payload: ConfirmPayload) => unknown
  }

  let {
    projects = [],
    selectedProjectId = "",
    projectIdsWithResources,
    onConfirm = () => {},
  }: Props = $props()

  let projectId = $state("")
  let includeRows = $state(false)
  let encrypted = $state(false)
  let encryptPassword = $state("")
  let projectIsEmpty = $derived(
    !!projectId &&
      !!projectIdsWithResources &&
      !projectIdsWithResources.includes(projectId)
  )
  let disabled = $derived(
    !projectId || projectIsEmpty || (encrypted && !encryptPassword.trim())
  )
  let initialised = $state(false)

  $effect(() => {
    if (initialised || !projects.length) {
      return
    }
    const selectedProject = projects.find(
      project => project._id === selectedProjectId
    )

    if (selectedProject) {
      projectId = selectedProject._id
    } else if (projects.length === 1) {
      projectId = projects[0]._id
    }

    initialised = true
  })

  $effect(() => {
    if (!encrypted && encryptPassword) {
      encryptPassword = ""
    }
  })
</script>

<ModalContent
  title="Export project"
  confirmText="Export"
  size="M"
  {disabled}
  onConfirm={() =>
    onConfirm({
      id: projectId,
      includeRows,
      encryptPassword: encrypted ? encryptPassword.trim() : undefined,
    })}
>
  <Body size="S">
    Export a portable Project package for use in another workspace.
  </Body>

  <Select
    label="Project"
    bind:value={projectId}
    options={projects}
    getOptionLabel={project => project.name}
    getOptionValue={project => project._id}
    getOptionColour={project => project.color}
  />

  <Toggle text="Include rows and attachments" bind:value={includeRows} />
  <Body size="S">
    Includes all rows from included Budibase DB tables, including shared tables,
    and their referenced attachments.
  </Body>

  <Toggle text="Encrypt export" bind:value={encrypted} />

  {#if encrypted}
    <Input
      type="password"
      label="Password"
      placeholder="Type here..."
      autocomplete="new-password"
      bind:value={encryptPassword}
    />
    {#if includeRows}
      <InlineAlert header="Attachments are not encrypted in the export." />
    {/if}
  {/if}
</ModalContent>
