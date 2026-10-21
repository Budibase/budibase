<script lang="ts">
  import { Body, Button, Icon, MarkdownViewer, Modal } from "@budibase/bbui"
  import type { ProjectResponse, UpdateProjectRequest } from "@budibase/types"
  import EditProjectReadmeModal from "./EditProjectReadmeModal.svelte"

  interface Props {
    project?: ProjectResponse
    canEdit?: boolean
    focused?: boolean
    onBack?: () => void
    onSave: (request: UpdateProjectRequest) => Promise<ProjectResponse>
    onReload: (projectId: string) => Promise<ProjectResponse>
  }

  let {
    project,
    canEdit = false,
    focused = false,
    onBack = () => {},
    onSave,
    onReload,
  }: Props = $props()

  let editModal: Modal
  let editingProject = $state<ProjectResponse>()
  let editorSaving = $state(false)

  const edit = () => {
    if (!project || !canEdit) {
      return
    }
    editingProject = { ...project }
    editModal.show()
  }
</script>

{#if focused}
  <div class="reader-navigation">
    <Button secondary on:click={onBack}>
      <span class="notes-action"
        ><Icon name="arrow-left" hidden size="S" />Back to resources</span
      >
    </Button>
  </div>
{/if}

{#if project && (project.readme?.trim() || canEdit)}
  <section
    class="project-notes"
    class:project-notes--focused={focused}
    aria-label="Project notes"
  >
    <div class="project-notes__header">
      <div>
        <h2>Project notes</h2>
        <Body size="S" color="var(--spectrum-global-color-gray-700)">
          {project.name}
        </Body>
      </div>
      {#if canEdit && project.readme?.trim()}
        <Button secondary on:click={edit}>
          <span class="notes-action"
            ><Icon name="pencil" hidden size="S" />Edit notes</span
          >
        </Button>
      {/if}
    </div>

    <div class="project-notes__body">
      {#if project.readme?.trim()}
        <MarkdownViewer value={project.readme} />
      {:else}
        <div class="empty-notes">
          <Body size="M" weight="500">Help your team get started</Body>
          <Body size="S" color="var(--spectrum-global-color-gray-700)">
            Explain what this project does, how to set it up and how to build on
            it.
          </Body>
          <Button secondary on:click={edit}>
            <span class="notes-action"
              ><Icon name="plus" hidden size="S" />Add project notes</span
            >
          </Button>
        </div>
      {/if}
    </div>
  </section>
{/if}

<Modal
  bind:this={editModal}
  closeOnOutsideClick={false}
  beforeClose={async () => !editorSaving}
  on:hide={() => (editingProject = undefined)}
>
  {#if editingProject}
    <EditProjectReadmeModal
      project={editingProject}
      bind:saving={editorSaving}
      {onSave}
      {onReload}
    />
  {/if}
</Modal>

<style>
  .reader-navigation {
    margin-top: var(--spacing-m);
  }

  .notes-action {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .project-notes {
    margin-top: 20px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: var(--border-radius-s);
    background: var(--spectrum-global-color-gray-100);
    overflow: hidden;
  }

  .project-notes__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    padding: var(--spacing-m) var(--spacing-l);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .project-notes__header h2 {
    margin: 0 0 var(--spacing-xs);
    font-size: var(--font-size-m);
    font-weight: 500;
  }

  .project-notes__body {
    padding: var(--spacing-l);
    overflow-wrap: anywhere;
    line-height: 1.6;
  }

  .project-notes__body :global(img) {
    max-width: 100%;
  }

  .project-notes--focused .project-notes__body {
    max-width: 880px;
    margin: 0 auto;
  }

  .empty-notes {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-m);
    padding: var(--spacing-m) 0;
  }
</style>
