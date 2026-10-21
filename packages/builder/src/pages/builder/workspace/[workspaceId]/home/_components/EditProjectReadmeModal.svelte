<script lang="ts">
  import {
    ActionButton,
    Body,
    Button,
    keepOpen,
    MarkdownViewer,
    ModalContent,
    TextArea,
  } from "@budibase/bbui"
  import {
    MAX_PROJECT_README_LENGTH,
    type ProjectResponse,
    type UpdateProjectRequest,
  } from "@budibase/types"
  import { getErrorMessage } from "@/helpers/errors"

  interface Props {
    project: ProjectResponse
    onSave: (request: UpdateProjectRequest) => Promise<ProjectResponse>
    onReload: (projectId: string) => Promise<ProjectResponse>
    saving?: boolean
  }

  let { project, onSave, onReload, saving = $bindable(false) }: Props = $props()

  let loadedProject = $state(project)
  let draft = $state(project.readme || "")
  let preview = $state(false)
  let saveError = $state("")
  let conflict = $state(false)
  let latestProject = $state<ProjectResponse>()
  let latestLoading = $state(false)
  let latestError = $state("")
  let revisionNotice = $state("")
  const draftTooLong = $derived(draft.length > MAX_PROJECT_README_LENGTH)

  const loadLatest = async () => {
    latestLoading = true
    latestError = ""
    try {
      latestProject = await onReload(loadedProject._id)
    } catch (error) {
      latestError = getErrorMessage(error) || "Unable to load the latest notes"
    } finally {
      latestLoading = false
    }
  }

  const useLatestRevision = () => {
    if (!latestProject) {
      return
    }
    loadedProject = latestProject
    latestProject = undefined
    conflict = false
    saveError = ""
    revisionNotice =
      "Your draft is unchanged. Review it before saving to replace the latest saved notes."
  }

  const save = async () => {
    if (saving || conflict || latestLoading || draftTooLong) {
      return keepOpen
    }
    saving = true
    saveError = ""
    try {
      await onSave({
        _id: loadedProject._id,
        _rev: loadedProject._rev,
        name: loadedProject.name,
        description: loadedProject.description,
        color: loadedProject.color,
        readme: draft,
      })
    } catch (error) {
      conflict =
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        error.status === 409
      saveError = conflict
        ? "This project changed since you opened its notes. Your draft has been kept. Compare the latest saved notes before saving again."
        : getErrorMessage(error) || "Unable to save project notes"
      if (conflict) {
        await loadLatest()
      }
      return keepOpen
    } finally {
      saving = false
    }
  }
</script>

<ModalContent
  title={`Edit notes for ${loadedProject.name}`}
  confirmText="Save notes"
  size="L"
  disabled={conflict || latestLoading || draftTooLong}
  disableCancelOnConfirm
  onConfirm={save}
>
  <Body size="S" color="var(--spectrum-global-color-gray-700)">
    Shared with your team. Use Markdown for headings, lists and links.
  </Body>

  <div class="editor-tabs" aria-label="Notes editor">
    <ActionButton quiet selected={!preview} on:click={() => (preview = false)}>
      Write
    </ActionButton>
    <ActionButton quiet selected={preview} on:click={() => (preview = true)}>
      Preview
    </ActionButton>
  </div>

  {#if preview}
    <div class="preview" aria-label="Notes preview">
      {#if draft.trim()}
        <MarkdownViewer value={draft} />
      {:else}
        <Body size="S">Nothing to preview yet.</Body>
      {/if}
    </div>
  {:else}
    <TextArea
      bind:value={draft}
      label="Project notes (Markdown)"
      minHeight={280}
      updateOnChange
      disabled={saving}
      placeholder="# Getting started"
    />
  {/if}

  {#if draftTooLong}
    <div class="save-error" role="alert">
      Project notes must be {MAX_PROJECT_README_LENGTH.toLocaleString()} characters
      or fewer.
    </div>
  {/if}

  {#if saveError}
    <div class="save-error" role="alert">{saveError}</div>
  {/if}
  {#if revisionNotice}
    <div role="status"><Body size="S">{revisionNotice}</Body></div>
  {/if}

  {#if conflict}
    <div class="latest-notes">
      <h2>Latest saved notes</h2>
      {#if latestLoading}
        <Body size="S">Loading latest notes…</Body>
      {:else if latestProject}
        {#if latestProject.readme?.trim()}
          <MarkdownViewer value={latestProject.readme} />
        {:else}
          <Body size="S">The latest saved notes are empty.</Body>
        {/if}
        <Button secondary on:click={useLatestRevision}
          >Use latest revision</Button
        >
        <Body size="S" color="var(--spectrum-global-color-gray-700)">
          This keeps your draft. Saving it will replace the notes shown above.
        </Body>
      {:else}
        {#if latestError}
          <div role="alert">{latestError}</div>
        {/if}
        <Button secondary on:click={loadLatest}>Load latest saved notes</Button>
      {/if}
    </div>
  {/if}
</ModalContent>

<style>
  .editor-tabs {
    display: flex;
    gap: var(--spacing-xs);
  }

  .preview {
    min-height: 280px;
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    overflow-wrap: anywhere;
  }

  .preview :global(.markdown-viewer a[href]),
  .latest-notes :global(.markdown-viewer a[href]) {
    color: var(--spectrum-global-color-blue-600);
  }

  .preview :global(.markdown-viewer a[href]:hover),
  .preview :global(.markdown-viewer a[href]:focus-visible),
  .latest-notes :global(.markdown-viewer a[href]:hover),
  .latest-notes :global(.markdown-viewer a[href]:focus-visible) {
    color: var(--spectrum-global-color-blue-500);
  }

  .save-error {
    color: var(--spectrum-semantic-negative-color-default);
    font-size: var(--font-size-s);
  }

  .latest-notes {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-m);
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    overflow-wrap: anywhere;
  }

  .latest-notes h2 {
    margin: 0;
    font-size: var(--font-size-m);
  }
</style>
