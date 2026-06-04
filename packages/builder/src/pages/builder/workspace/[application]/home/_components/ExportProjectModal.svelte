<script lang="ts">
  import { Body, Input, ModalContent, Select, Toggle } from "@budibase/bbui"
  import type { ProjectResponse } from "@budibase/types"

  export let projects: ProjectResponse[] = []
  export let selectedProjectId = ""

  interface ConfirmPayload {
    id: string
    encryptPassword?: string
  }

  export let onConfirm: (_payload: ConfirmPayload) => unknown = () => {}

  let projectId = ""
  let encrypted = false
  let encryptPassword = ""
  let disabled = false
  let initialised = false

  $: if (!initialised && projects.length) {
    const selectedProject = projects.find(
      project => project._id === selectedProjectId
    )

    if (selectedProject) {
      projectId = selectedProject._id
    } else if (projects.length === 1) {
      projectId = projects[0]._id
    }

    initialised = true
  }

  $: if (!encrypted && encryptPassword) {
    encryptPassword = ""
  }

  $: disabled = !projectId || (encrypted && !encryptPassword.trim())
</script>

<ModalContent
  title="Export project"
  confirmText="Export"
  size="M"
  bind:disabled
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
