<script lang="ts">
  import { automationStore } from "@/stores/builder"
  import { Icon } from "@budibase/bbui"
  import { ViewMode, type StickyNoteNodeData } from "@/types/automations"
  import { tick } from "svelte"
  import { useSvelteFlow } from "@xyflow/svelte"

  export let data: StickyNoteNodeData | undefined = undefined

  $: note = data?.note || { id: "", title: "", text: "", x: 0, y: 0 }
  $: viewMode = $automationStore.viewMode
  $: isEditor = viewMode === ViewMode.EDITOR

  let editTitle = false
  let editText = false
  let titleValue = ""
  let textValue = ""
  let lastTextValue = ""
  let titleInput: HTMLInputElement
  let textTextarea: HTMLTextAreaElement

  $: if (note && !editTitle) {
    titleValue = note.title
  }

  $: if (note && !editText) {
    textValue = note.text
    lastTextValue = note.text
  }

  type NotePosition = { x: number; y: number }

  const focusTitleInput = async (selectText: boolean) => {
    await tick()
    titleInput?.focus()
    if (selectText) {
      titleInput?.select()
    } else {
      titleInput?.setSelectionRange(
        titleInput.value.length,
        titleInput.value.length
      )
    }
  }

  const focusTextInput = async () => {
    await tick()
    textTextarea?.focus()
    textTextarea?.setSelectionRange(
      textTextarea.value.length,
      textTextarea.value.length
    )
  }

  const startEditTitle = async (e: MouseEvent) => {
    if (!isEditor) return
    e.preventDefault()
    editTitle = true
    titleValue = note.title
    await focusTitleInput(e.detail > 1)
  }

  const startEditText = async (e: Event) => {
    if (!isEditor || editText) return
    e.preventDefault()
    editText = true
    textValue = note.text
    lastTextValue = note.text
    await focusTextInput()
  }

  const saveTitle = async (updates?: {
    position?: NotePosition
    width?: number
  }) => {
    if (titleValue !== note.title) {
      try {
        await automationStore.actions.updateStickyNote(note.id, {
          title: titleValue,
          ...updates?.position,
          ...(updates?.width ? { width: updates.width } : {}),
        })
        editTitle = false
        return true
      } catch {
        titleValue = note.title
      }
    }
    editTitle = false
    return false
  }

  const saveText = async (updates?: {
    position?: NotePosition
    width?: number
  }) => {
    if (textValue !== note.text || noteHeight !== note.height) {
      try {
        await automationStore.actions.updateStickyNote(note.id, {
          text: textValue,
          height: noteHeight,
          ...updates?.position,
          ...(updates?.width ? { width: updates.width } : {}),
        })
        editText = false
        return true
      } catch {
        textValue = note.text
      }
    }
    editText = false
    return false
  }

  const saveActiveEdits = async (updates?: {
    position?: NotePosition
    width?: number
  }) => {
    let saved = false
    if (editTitle) {
      saved = (await saveTitle(updates)) || saved
    }
    if (editText) {
      saved = (await saveText(updates)) || saved
    }
    return saved
  }

  let noteWidth = 220
  let noteHeight = 140
  let resizing = false
  const MIN_NOTE_HEIGHT = 140
  const MIN_NOTE_WIDTH = 160
  const MAX_NOTE_WIDTH = 300
  const MAX_NOTE_HEIGHT = 400

  $: if (note?.width) noteWidth = Math.min(note.width, MAX_NOTE_WIDTH)
  $: if (note?.height) noteHeight = Math.min(note.height, MAX_NOTE_HEIGHT)
  $: noteDisplayHeight = Math.min(noteHeight, MAX_NOTE_HEIGHT)

  const startResize = (e: PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    resizing = true
    const startX = e.clientX
    const startW = noteWidth

    const onMove = (ev: PointerEvent) => {
      if (!resizing) return
      const newW = Math.min(
        MAX_NOTE_WIDTH,
        Math.max(MIN_NOTE_WIDTH, startW + ev.clientX - startX)
      )
      noteWidth = newW
    }

    const onUp = async () => {
      resizing = false
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerup", onUp)
      const savedEdits = await saveActiveEdits({ width: noteWidth })
      if (!savedEdits) {
        automationStore.actions.updateStickyNote(note.id, {
          width: noteWidth,
        })
      }
    }

    document.addEventListener("pointermove", onMove)
    document.addEventListener("pointerup", onUp)
  }

  const flow = useSvelteFlow()

  let dragging = false

  const startDrag = (e: PointerEvent) => {
    if (!isEditor) return
    e.preventDefault()
    e.stopPropagation()
    dragging = true
    const nodes = flow.getNodes()
    const node = nodes.find(n => n.id === note.id)
    if (!node) return
    const startPos = { ...node.position }
    const startX = e.clientX
    const startY = e.clientY

    const onMove = (ev: PointerEvent) => {
      if (!dragging) return
      const zoom = flow.getViewport()?.zoom || 1
      const dx = (ev.clientX - startX) / zoom
      const dy = (ev.clientY - startY) / zoom
      flow.updateNode(note.id, {
        position: { x: startPos.x + dx, y: startPos.y + dy },
      })
    }

    const onUp = async () => {
      dragging = false
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerup", onUp)
      const draggedPosition = flow.getNodes().find(n => n.id === note.id)
        ?.position
      const savedEdits = await saveActiveEdits({ position: draggedPosition })
      if (draggedPosition) {
        if (savedEdits) {
          flow.updateNode(note.id, { position: draggedPosition })
        } else {
          automationStore.actions.updateStickyNotePosition(
            note.id,
            draggedPosition
          )
        }
      }
    }

    document.addEventListener("pointermove", onMove)
    document.addEventListener("pointerup", onUp)
  }

  const MAX_TITLE_LENGTH = 120
  const MAX_NOTE_TEXT_LENGTH = 500

  const handleTextInput = (e: Event) => {
    const target = e.currentTarget as HTMLTextAreaElement
    const nextValue = target.value
    const bodyHeight = target.clientHeight
    const chromeHeight = noteHeight - bodyHeight

    const currentHeight = target.style.height
    const currentMinHeight = target.style.minHeight
    const currentMaxHeight = target.style.maxHeight

    target.style.height = "0px"
    target.style.minHeight = "0px"
    target.style.maxHeight = "none"
    const textHeight = target.scrollHeight
    target.style.height = currentHeight
    target.style.minHeight = currentMinHeight
    target.style.maxHeight = currentMaxHeight

    const nextHeight = Math.min(
      MAX_NOTE_HEIGHT,
      Math.max(MIN_NOTE_HEIGHT, chromeHeight + textHeight)
    )

    if (chromeHeight + textHeight > MAX_NOTE_HEIGHT) {
      target.value = lastTextValue
      textValue = lastTextValue
      return
    }

    noteHeight = nextHeight
    textValue = nextValue
    lastTextValue = nextValue
  }

  const remove = async () => {
    await automationStore.actions.removeStickyNote(note.id)
  }
</script>

{#if note.id}
  <div
    class="sticky-note"
    class:resizing
    on:dblclick|stopPropagation
    role="button"
    tabindex="-1"
    style="width: {noteWidth}px; max-width: {MAX_NOTE_WIDTH}px; height: {noteDisplayHeight}px; max-height: {MAX_NOTE_HEIGHT}px;"
  >
    <div class="drag-grip" on:pointerdown|stopPropagation={startDrag}>
      <Icon name="dots-six-vertical" size="S" />
    </div>
    <div class="resize-grip" on:pointerdown|stopPropagation={startResize} />
    <div class="note-header">
      {#if editTitle}
        <input
          bind:this={titleInput}
          bind:value={titleValue}
          class="title-input"
          maxlength={MAX_TITLE_LENGTH}
          on:blur={() => saveTitle()}
          on:keydown={e => {
            if (e.key === "Enter") saveTitle()
          }}
          on:wheel|stopPropagation
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
          <Icon name="trash" size="S" hoverable />
        </div>
      {/if}
    </div>
    <div
      class="note-body"
      class:editable={isEditor}
      on:mousedown|stopPropagation={startEditText}
      on:click|stopPropagation
    >
      {#if editText}
        <textarea
          bind:this={textTextarea}
          value={textValue}
          class="text-input"
          maxlength={MAX_NOTE_TEXT_LENGTH}
          on:blur={() => saveText()}
          on:input={handleTextInput}
          on:keydown={e => {
            if (e.key === "Escape") saveText()
          }}
          on:wheel|stopPropagation
        />
      {:else}
        <span class="note-text">
          {note.text}
        </span>
      {/if}
    </div>
  </div>
{/if}

<style>
  .sticky-note {
    width: 220px;
    height: 140px;
    min-height: 140px;
    max-width: 300px;
    max-height: 400px;
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
    line-height: 1.4;
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
    line-height: 1.4;
    font-family: inherit;
    border: none;
    background: rgba(255, 255, 255, 0);
    border-radius: 2px;
    padding: 2px 4px;
    margin: 0;
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
    flex: 1 1 auto;
    min-height: 80px;
    overflow: hidden;
    display: flex;
  }

  .note-text {
    display: block;
    flex: 1;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
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

  .note-body.editable,
  .note-body.editable .note-text {
    cursor: text;
  }

  .text-input {
    display: block;
    flex: 1;
    width: 100%;
    height: 100%;
    max-height: 100%;
    min-height: 100%;
    font-size: 13px;
    border: none;
    background: rgba(255, 255, 255, 0);
    border-radius: 2px;
    padding: 4px;
    margin: 0;
    resize: none;
    outline: none;
    font-family: inherit;
    line-height: 1.4;
    overflow-wrap: break-word;
    color: var(--spectrum-global-color-gray-800);
    box-sizing: border-box;
    overflow: hidden;
  }

  :global(.spectrum--dark) .text-input {
    background: rgba(255, 255, 255, 0.1);
  }

  .drag-grip {
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -2px;
    left: -20px;
    width: 19px;
    height: 40px;
    border-radius: 6px 0 0 6px;
    background: #fef9c3;
    border: 2px solid #e6d87a;
    border-right: none;
    color: rgba(0, 0, 0, 0.4);
    transition:
      color 0.15s,
      background 0.15s;
    z-index: 1;
  }

  .drag-grip:hover {
    color: rgba(0, 0, 0, 0.7);
    background: #f5efb0;
  }

  .drag-grip:active {
    cursor: grabbing;
  }

  :global(.spectrum--dark) .drag-grip,
  :global(.spectrum--darkest) .drag-grip,
  :global(.spectrum--midnight) .drag-grip,
  :global(.spectrum--nord) .drag-grip {
    background: #3d3522;
    border-color: #5c512d;
    color: rgba(255, 255, 255, 0.4);
  }

  :global(.spectrum--dark) .drag-grip:hover,
  :global(.spectrum--darkest) .drag-grip:hover,
  :global(.spectrum--midnight) .drag-grip:hover,
  :global(.spectrum--nord) .drag-grip:hover {
    color: rgba(255, 255, 255, 0.7);
    background: #4d3f28;
  }

  .resize-grip {
    position: absolute;
    top: 0;
    right: -4px;
    width: 8px;
    height: 100%;
    cursor: ew-resize;
    opacity: 0;
    transition: opacity 0.15s;
    z-index: 2;
  }

  .resize-grip::after {
    content: "";
    position: absolute;
    top: 0;
    right: 3px;
    width: 0;
    height: 100%;
    border-right: 2px solid var(--spectrum-global-color-gray-500);
  }

  .resize-grip:hover,
  .sticky-note.resizing .resize-grip {
    opacity: 1;
  }
</style>
