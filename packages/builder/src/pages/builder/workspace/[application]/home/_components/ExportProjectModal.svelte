<svelte:options runes={true} />

<script lang="ts">
  import { Body, Input, ModalContent, Select, Toggle } from "@budibase/bbui"
  import type { ProjectResponse } from "@budibase/types"

  interface ConfirmPayload {
    id: string
    encryptPassword?: string
  }

  interface Props {
    projects?: ProjectResponse[]
    selectedProjectId?: string
    projectIdsWithResources?: string[]
    onConfirm?: (_payload: ConfirmPayload) => unknown
  }

  let {
    projects = [],
    selectedProjectId = "",
    projectIdsWithResources,
    onConfirm = () => {},
  }: Props = $props()

  let projectId = $state("")
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
      encryptPassword: encrypted ? encryptPassword.trim() : undefined,
    })}
>
  <Body size="S">
    Export a portable Project package for use in another workspace. Rows and
    attachments are not included yet.
  </Body>

  <Select
    label="Project"
    bind:value={projectId}
    options={projects}
    getOptionLabel={project => project.name}
    getOptionValue={project => project._id}
    getOptionColour={project => project.color}
  />

  <Toggle text="Encrypt export" bind:value={encrypted} />

  {#if encrypted}
    <Input
      type="password"
      label="Password"
      placeholder="Type here..."
      autocomplete="new-password"
      bind:value={encryptPassword}
    />
  {/if}
</ModalContent>
