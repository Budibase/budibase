<script lang="ts">
  import { automationStore } from "@/stores/builder"
  import { Icon } from "@budibase/bbui"
  import { ViewMode, type StickyNoteNodeData } from "@/types/automations"
  import { useSvelteFlow } from "@xyflow/svelte"
  import { onDestroy } from "svelte"

  export let data: StickyNoteNodeData | undefined = undefined
  export let positionAbsoluteX = 0
  export let positionAbsoluteY = 0

  $: note = data?.note || { id: "", title: "", text: "", x: 0, y: 0 }
  $: viewMode = $automationStore.viewMode
  $: isEditor = viewMode === ViewMode.EDITOR
  let dragPosition: NotePosition | null = null
  let pendingPosition: NotePosition | null = null
  $: currentPosition = dragPosition ||
    pendingPosition || {
      x: positionAbsoluteX,
      y: positionAbsoluteY,
    }
  $: if (
    pendingPosition &&
    pendingPosition.x === positionAbsoluteX &&
    pendingPosition.y === positionAbsoluteY
  ) {
    pendingPosition = null
  }

  let editTitle = false
  let editText = false
  let titleValue = ""
  let textValue = ""
  let lastTextValue = ""
  let titleInput: HTMLInputElement
  let textInput: HTMLTextAreaElement

  $: if (note && !editTitle) {
    titleValue = note.title
  }

  $: if (note && !editText) {
    textValue = note.text
    lastTextValue = note.text
  }

  type NotePosition = { x: number; y: number }

  const startEditTitle = () => {
    if (!isEditor || editTitle) return
    editTitle = true
    titleValue = note.title
  }

  const startEditText = () => {
    if (!isEditor || editText) return
    editText = true
    textValue = note.text
    lastTextValue = note.text
  }

  let selectingText = false
  const SELECTING_TEXT_CLASS = "sticky-note-selecting-text"
  let activeSelectionInput: HTMLInputElement | HTMLTextAreaElement | null = null
  let movedDuringTextSelection = false
  let lastTextSelection: {
    start: number
    end: number
    direction: "forward" | "backward" | "none"
  } | null = null

  const recordTextSelection = (
    input: HTMLInputElement | HTMLTextAreaElement
  ) => {
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? 0
    if (start === end) return
    lastTextSelection = {
      start,
      end,
      direction: input.selectionDirection || "none",
    }
  }

  const restoreTextSelection = () => {
    if (!selectingText || !activeSelectionInput || !lastTextSelection) return
    const start = activeSelectionInput.selectionStart ?? 0
    const end = activeSelectionInput.selectionEnd ?? 0
    if (start !== end) {
      recordTextSelection(activeSelectionInput)
      return
    }
    activeSelectionInput.focus()
    activeSelectionInput.setSelectionRange(
      lastTextSelection.start,
      lastTextSelection.end,
      lastTextSelection.direction
    )
  }

  const scheduleSelectionRestore = () => {
    requestAnimationFrame(restoreTextSelection)
  }

  const stopCanvasInteraction = (e: Event) => {
    if (!selectingText) return
    movedDuringTextSelection = true
    if (activeSelectionInput) {
      recordTextSelection(activeSelectionInput)
    }
    e.stopPropagation()
    e.stopImmediatePropagation()
    scheduleSelectionRestore()
  }

  const stopTextSelectionGuard = () => {
    selectingText = false
    activeSelectionInput = null
    movedDuringTextSelection = false
    lastTextSelection = null
    document.body.classList.remove(SELECTING_TEXT_CLASS)
    document.removeEventListener("mousemove", stopCanvasInteraction, true)
    document.removeEventListener("pointermove", stopCanvasInteraction, true)
    document.removeEventListener("mouseup", handleTextSelectionEnd, true)
    document.removeEventListener("pointerup", handleTextSelectionEnd, true)
  }

  const clearStoredTextSelection = () => {
    activeSelectionInput = null
    lastTextSelection = null
  }

  const clearStoredSelectionFromOtherInput = (
    input: HTMLInputElement | HTMLTextAreaElement
  ) => {
    if (activeSelectionInput === input) return
    clearStoredTextSelection()
  }

  const handleTextSelectionEnd = (e: Event) => {
    if (!movedDuringTextSelection && activeSelectionInput) {
      const caret = activeSelectionInput.selectionEnd ?? 0
      activeSelectionInput.setSelectionRange(caret, caret)
    }
    stopTextSelectionGuard()
    e.stopPropagation()
    e.stopImmediatePropagation()
  }

  const startTextSelectionGuard = (
    input: HTMLInputElement | HTMLTextAreaElement
  ) => {
    if (selectingText) return
    selectingText = true
    movedDuringTextSelection = false
    activeSelectionInput = input
    document.body.classList.add(SELECTING_TEXT_CLASS)
    document.addEventListener("mousemove", stopCanvasInteraction, true)
    document.addEventListener("pointermove", stopCanvasInteraction, true)
    document.addEventListener("mouseup", handleTextSelectionEnd, true)
    document.addEventListener("pointerup", handleTextSelectionEnd, true)
  }

  const startTitleSelection = () => {
    startEditTitle()
    startTextSelectionGuard(titleInput)
  }

  const startTextSelection = () => {
    startEditText()
    startTextSelectionGuard(textInput)
  }

  const handleTextSelect = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement | HTMLTextAreaElement
    if (selectingText && activeSelectionInput && input !== activeSelectionInput) {
      return
    }
    recordTextSelection(input)
  }

  const handleTitleBlur = () => {
    if (selectingText) {
      scheduleSelectionRestore()
      return
    }
    saveTitle()
  }

  const handleTextBlur = () => {
    if (selectingText) {
      scheduleSelectionRestore()
      return
    }
    saveText()
  }

  const handleTitlePointerDown = (e: PointerEvent) => {
    e.stopPropagation()
    clearStoredSelectionFromOtherInput(titleInput)
    startTitleSelection()
  }

  const handleTextPointerDown = (e: PointerEvent) => {
    e.stopPropagation()
    clearStoredSelectionFromOtherInput(textInput)
    startTextSelection()
  }

  const handleTitleMouseDown = (e: MouseEvent) => {
    e.stopPropagation()
    clearStoredSelectionFromOtherInput(titleInput)
    startTitleSelection()
  }

  const handleTextMouseDown = (e: MouseEvent) => {
    e.stopPropagation()
    clearStoredSelectionFromOtherInput(textInput)
    startTextSelection()
  }

  onDestroy(stopTextSelectionGuard)

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
    const startPos = { ...currentPosition }
    const startX = e.clientX
    const startY = e.clientY

    const onMove = (ev: PointerEvent) => {
      if (!dragging) return
      const zoom = flow.getViewport()?.zoom || 1
      const dx = (ev.clientX - startX) / zoom
      const dy = (ev.clientY - startY) / zoom
      dragPosition = { x: startPos.x + dx, y: startPos.y + dy }
    }

    const onUp = async () => {
      dragging = false
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerup", onUp)
      const draggedPosition = dragPosition || startPos
      pendingPosition = draggedPosition
      const savedEdits = await saveActiveEdits({ position: draggedPosition })
      if (!savedEdits) {
        await automationStore.actions.updateStickyNotePosition(
          note.id,
          draggedPosition
        )
      }
      dragPosition = null
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
    class="sticky-note-portal selectable-text nodrag nopan"
    style:transform={`translate(${currentPosition.x}px, ${currentPosition.y}px)`}
  >
    <div
      class="sticky-note"
      class:resizing
      class:selecting-text={selectingText}
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
        <input
          bind:this={titleInput}
          bind:value={titleValue}
          class="title-input"
          class:editable={isEditor}
          maxlength={MAX_TITLE_LENGTH}
          readonly={!isEditor}
          on:focus={startEditTitle}
          on:pointerdown={handleTitlePointerDown}
          on:mousedown={handleTitleMouseDown}
          on:select={handleTextSelect}
          on:click|stopPropagation
          on:blur={handleTitleBlur}
          on:keydown={e => {
            if (e.key === "Enter") saveTitle()
          }}
          on:wheel|stopPropagation
        />
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
        <textarea
          bind:this={textInput}
          value={textValue}
          class="text-input selectable-text nodrag nopan"
          class:editable={isEditor}
          maxlength={MAX_NOTE_TEXT_LENGTH}
          readonly={!isEditor}
          on:focus={startEditText}
          on:pointerdown={handleTextPointerDown}
          on:mousedown={handleTextMouseDown}
          on:select={handleTextSelect}
          on:blur={handleTextBlur}
          on:input={handleTextInput}
          on:keydown={e => {
            if (e.key === "Escape") saveText()
          }}
          on:wheel|stopPropagation
        />
      </div>
    </div>
  </div>
{/if}

<style>
  .selectable-text {
    user-select: text;
    -webkit-user-select: text;
  }

  :global(body.sticky-note-selecting-text .svelte-flow__pane),
  :global(body.sticky-note-selecting-text .svelte-flow__zoom) {
    cursor: text !important;
  }

  .sticky-note-portal {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: top left;
    pointer-events: all;
    z-index: 1002;
  }

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

  .title-input.editable {
    cursor: text;
  }

  :global(.spectrum--dark) .title-input:focus {
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

  .text-input.editable {
    cursor: text;
  }

  :global(.spectrum--dark) .text-input:focus {
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

  .sticky-note.selecting-text .drag-grip {
    pointer-events: none;
    cursor: text;
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
