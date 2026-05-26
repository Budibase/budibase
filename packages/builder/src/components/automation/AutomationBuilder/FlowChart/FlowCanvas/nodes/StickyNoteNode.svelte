<script lang="ts">
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import { Icon } from "@budibase/bbui"
  import { ViewMode, type StickyNoteNodeData } from "@/types/automations"
  import { get } from "svelte/store"
  import { afterUpdate } from "svelte"

  export let data: StickyNoteNodeData | undefined = undefined
  export let selected: boolean = false

  $: note = data?.note || { id: "", title: "", text: "", x: 0, y: 0 }
  $: viewMode = $automationStore.viewMode
  $: isEditor = viewMode === ViewMode.EDITOR

  let editTitle = false
  let editText = false
  let titleValue = ""
  let textValue = ""
  let titleInput: HTMLInputElement
  let textTextarea: HTMLTextAreaElement

  $: if (note) {
    titleValue = note.title
    textValue = note.text
  }

  const startEditTitle = (e: Event) => {
    if (!isEditor) return
    e.preventDefault()
    editTitle = true
    titleValue = note.title
  }

  const startEditText = (e: Event) => {
    if (!isEditor) return
    e.preventDefault()
    editText = true
    textValue = note.text
  }

  const saveTitle = async () => {
    editTitle = false
    if (titleValue !== note.title) {
      await automationStore.actions.updateStickyNote(note.id, {
        title: titleValue,
      })
    }
  }

  const saveText = async () => {
    editText = false
    if (textValue !== note.text) {
      await automationStore.actions.updateStickyNote(note.id, {
        text: textValue,
      })
    }
  }

  afterUpdate(() => {
    if (editTitle && titleInput) {
      titleInput.focus()
      titleInput.setSelectionRange(
        titleInput.value.length,
        titleInput.value.length
      )
    } else if (editText && textTextarea) {
      textTextarea.focus()
      textTextarea.setSelectionRange(
        textTextarea.value.length,
        textTextarea.value.length
      )
    }
  })

  let noteWidth = 220
  let noteHeight = 140
  let resizing = false

  $: if (note?.width) noteWidth = note.width
  $: if (note?.height) noteHeight = note.height

  const startResize = (e: PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    resizing = true
    const startX = e.clientX
    const startY = e.clientY
    const startW = noteWidth
    const startH = noteHeight

    const onMove = (ev: PointerEvent) => {
      if (!resizing) return
      const newW = Math.min(600, Math.max(160, startW + ev.clientX - startX))
      const newH = Math.min(800, Math.max(100, startH + ev.clientY - startY))
      noteWidth = newW
      noteHeight = newH
    }

    const onUp = () => {
      resizing = false
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerup", onUp)
      automationStore.actions.updateStickyNote(note.id, {
        width: noteWidth,
        height: noteHeight,
      })
    }

    document.addEventListener("pointermove", onMove)
    document.addEventListener("pointerup", onUp)
  }

  const remove = async () => {
    await automationStore.actions.removeStickyNote(note.id)
  }
</script>

{#if note.id}
  <div
    class="sticky-note"
    class:selected
    class:resizing
    on:dblclick={() => {}}
    role="button"
    tabindex="-1"
    style="width: {noteWidth}px; height: {noteHeight}px;"
  >
    <div class="resize-grip" on:pointerdown|stopPropagation={startResize} />
    <div class="note-header">
      {#if editTitle}
        <input
          bind:this={titleInput}
          bind:value={titleValue}
          class="title-input"
          on:blur={saveTitle}
          on:keydown={e => {
            if (e.key === "Enter") saveTitle()
          }}
        />
      {:else}
        <span
          class="title-text"
          class:editable={isEditor}
          on:mousedown|stopPropagation={startEditTitle}
          on:click|stopPropagation
        >
          {note.title}
        </span>
      {/if}
      {#if isEditor}
        <div class="delete-btn" on:click|stopPropagation={remove}>
          <Icon name="x" size="S" hoverable />
        </div>
      {/if}
    </div>
    <div class="note-body">
      {#if editText}
        <textarea
          bind:this={textTextarea}
          bind:value={textValue}
          class="text-input"
          on:blur={saveText}
          on:keydown={e => {
            if (e.key === "Escape") saveText()
          }}
        />
      {:else}
        <span
          class="note-text"
          class:editable={isEditor}
          on:mousedown|stopPropagation={startEditText}
          on:click|stopPropagation
        >
          {note.text}
        </span>
      {/if}
    </div>
  </div>
{/if}

<style>
  .sticky-note {
    width: 220px;
    min-height: 140px;
    background: #fef9c3;
    border: 2px solid #e6d87a;
    border-radius: 4px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-family: var(--font-sans);
    cursor: default;
    position: relative;
    box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.08);
  }

  .sticky-note.selected {
    border-color: var(--spectrum-global-color-blue-600);
    box-shadow:
      0 0 0 3px
        color-mix(
          in srgb,
          var(--spectrum-global-color-blue-600) 20%,
          transparent
        ),
      2px 3px 8px rgba(0, 0, 0, 0.08);
  }

  :global(.spectrum--dark) .sticky-note,
  :global(.spectrum--darkest) .sticky-note,
  :global(.spectrum--midnight) .sticky-note,
  :global(.spectrum--nord) .sticky-note {
    background: #3d3522;
    border-color: #5c512d;
  }

  .note-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .title-text {
    font-weight: 600;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-900);
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: default;
    user-select: none;
    padding: 2px 4px;
  }

  .title-text.editable {
    cursor: text;
  }

  .title-input {
    font-weight: 600;
    font-size: 14px;
    font-family: inherit;
    border: none;
    background: rgba(255, 255, 255, 0);
    border-radius: 2px;
    padding: 2px 4px;
    flex: 1;
    min-width: 0;
    outline: none;
    color: var(--spectrum-global-color-gray-900);
  }

  :global(.spectrum--dark) .title-input {
    background: rgba(255, 255, 255, 0.1);
  }

  .delete-btn {
    opacity: 0;
    transition: opacity 0.15s;
    cursor: pointer;
    flex-shrink: 0;
  }

  .sticky-note:hover .delete-btn {
    opacity: 1;
  }

  .note-body {
    flex: 1;
    min-height: 80px;
  }

  .note-text {
    font-size: 13px;
    color: var(--spectrum-global-color-gray-800);
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.4;
    cursor: default;
    user-select: none;
    padding: 4px;
    resize: none;
  }

  .note-text.editable {
    cursor: text;
  }

  .text-input {
    width: 100%;
    min-height: 80px;
    font-size: 13px;
    border: none;
    background: rgba(255, 255, 255, 0);
    border-radius: 2px;
    padding: 4px;
    resize: none;
    outline: none;
    font-family: var(--font-sans);
    line-height: 1.4;
    color: var(--spectrum-global-color-gray-900);
    box-sizing: border-box;
  }

  :global(.spectrum--dark) .text-input {
    background: rgba(255, 255, 255, 0.1);
  }

  .resize-grip {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 14px;
    height: 14px;
    cursor: nwse-resize;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .resize-grip::after {
    content: "";
    position: absolute;
    bottom: 3px;
    right: 3px;
    width: 8px;
    height: 8px;
    border-right: 2px solid var(--spectrum-global-color-gray-500);
    border-bottom: 2px solid var(--spectrum-global-color-gray-500);
  }

  .sticky-note:hover .resize-grip,
  .sticky-note.resizing .resize-grip {
    opacity: 1;
  }
</style>
