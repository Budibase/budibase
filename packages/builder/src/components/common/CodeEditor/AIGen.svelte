<script lang="ts">
  import { ActionButton, Icon, notifications } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { API } from "@/api"
  import type { EnrichedBinding } from "@budibase/types"
  import BBAI from "assets/bb-ai.svg"

  export let bindings: EnrichedBinding[] = []
  export let value: string | null = ""
  export let parentWidth: number | null = null

  const dispatch = createEventDispatcher()

  let buttonContainer: HTMLElement
  let promptInput: HTMLTextAreaElement
  let buttonElement: HTMLButtonElement
  let promptLoading = false
  let suggestedCode: string | null = null
  let previousContents: string | null = null
  let expanded = false
  let containerWidth = "auto"
  let containerHeight = "35px"
  let promptText = ""

  function adjustContainerHeight() {
    if (promptInput && buttonElement) {
      promptInput.style.height = "0px"
      const newHeight = Math.min(promptInput.scrollHeight, 100)
      promptInput.style.height = `${newHeight}px`
      containerHeight = `${Math.max(40, newHeight + 20)}px`
    }
  }

  $: if (promptInput && promptText) adjustContainerHeight()

  async function generateJs(prompt: string) {
    if (!prompt.trim()) return

    previousContents = value
    promptLoading = true
    try {
      const resp = await API.generateJs({ prompt, bindings })
      const code = resp.code
      if (code === "") {
        throw new Error("We didn't understand your prompt. Please rephrase it.")
      }
      suggestedCode = code
      dispatch("update", { code })
    } catch (e) {
      console.error(e)
      notifications.error(
        e instanceof Error
          ? `Unable to generate code: ${e.message}`
          : "Unable to generate code. Please try again later."
      )
    } finally {
      promptLoading = false
    }
  }

  function acceptSuggestion() {
    dispatch("accept")
    resetExpand()
  }

  function rejectSuggestion() {
    dispatch("reject", { code: previousContents })
    resetExpand()
  }

  function resetExpand() {
    expanded = false
    containerWidth = "auto"
    containerHeight = "40px"
    promptText = ""
    suggestedCode = null
    previousContents = null
  }

  function toggleExpand() {
    if (!expanded) {
      expanded = true
      // Dynamic width based on parent size, with minimum and maximum constraints
      containerWidth = parentWidth
        ? `${Math.min(Math.max(parentWidth * 0.8, 300), 600)}px`
        : "300px"
      containerHeight = "40px"
      setTimeout(() => {
        promptInput?.focus()
        adjustContainerHeight()
      }, 250)
    } else {
      resetExpand()
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      generateJs(promptText)
    } else if (event.key === "Escape") {
      if (!suggestedCode) resetExpand()
      else {
        expanded = false
        containerWidth = "auto"
      }
    } else {
      event.stopPropagation()
    }
  }
</script>

<div
  class="ai-gen-container"
  style="--container-width: {containerWidth}; --container-height: {containerHeight}"
  bind:this={buttonContainer}
>
  {#if suggestedCode !== null}
    <div class="floating-actions">
      <ActionButton size="S" icon="CheckmarkCircle" on:click={acceptSuggestion}>
        Accept
      </ActionButton>
      <ActionButton size="S" icon="Delete" on:click={rejectSuggestion}>
        Reject
      </ActionButton>
    </div>
  {/if}

  <button
    bind:this={buttonElement}
    class="spectrum-ActionButton fade"
    class:expanded
    on:click={!expanded ? toggleExpand : undefined}
  >
    <img src={BBAI} alt="AI" class="ai-icon" />
    {#if expanded}
      <textarea
        bind:this={promptInput}
        bind:value={promptText}
        class="prompt-input"
        placeholder="Generate Javascript..."
        on:keydown={handleKeyPress}
        on:input={adjustContainerHeight}
        disabled={suggestedCode !== null}
        readonly={suggestedCode !== null}
        rows="1"
      />
      <div class="action-buttons">
        <Icon
          color={promptLoading
            ? "#6E56FF"
            : "var(--spectrum-global-color-gray-600)"}
          size="S"
          hoverable
          hoverColor="#6E56FF"
          name={promptLoading ? "StopCircle" : "PlayCircle"}
          on:click={() => generateJs(promptText)}
        />
        <Icon
          hoverable
          size="S"
          name="Close"
          hoverColor="#6E56FF"
          on:click={e => {
            e.stopPropagation()
            if (!suggestedCode && !promptLoading) toggleExpand()
          }}
        />
      </div>
    {:else}
      <span class="spectrum-ActionButton-label ai-gen-text">
        Generate with AI
      </span>
    {/if}
  </button>
</div>

<style>
  .ai-gen-container {
    --container-width: auto;
    --container-height: 40px;
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: var(--container-width);
    height: var(--container-height);
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    overflow: visible;
    z-index: 1;
  }

  .spectrum-ActionButton::before {
    content: "";
    background: conic-gradient(
      transparent 270deg,
      #6e56ff,
      #9f8fff,
      transparent
    );
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    aspect-ratio: 1;
    width: 100%;
    animation: rotate 3s linear infinite;
  }

  .spectrum-ActionButton::after {
    content: "";
    background: inherit;
    position: absolute;
    top: 50%;
    left: 50%;
    inset: var(--offset);
    height: calc(100% - 2 * var(--offset));
    width: calc(100% - 2 * var(--offset));
  }

  @keyframes rotate {
    from {
      transform: translate(-50%, -50%) scale(1.4) rotate(0turn);
    }
    to {
      transform: translate(-50%, -50%) scale(1.4) rotate(1turn);
    }
  }

  .floating-actions {
    position: absolute;
    display: flex;
    gap: var(--spacing-s);
    bottom: calc(100% + 5px);
    left: 0;
    z-index: 2;
    animation: fade-in 0.2s ease-out forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .spectrum-ActionButton {
    --offset: 1px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    padding: var(--spacing-s);
    border: 1px solid var(--spectrum-alias-border-color);
    border-radius: var(--spectrum-alias-border-radius-regular);
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .spectrum-ActionButton:hover {
    cursor: pointer;
    background-color: var(--spectrum-global-color-gray-75);
  }

  .spectrum-ActionButton.expanded {
    border-radius: var(--spectrum-alias-border-radius-regular);
  }

  .fade {
    transition: all 2s ease-in;
  }

  .ai-icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  .ai-gen-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity 0.2s ease-out;
  }

  .prompt-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: var(--font-size-s);
    font-family: var(--font-sans);
    color: var(--spectrum-alias-text-color);
    padding: 0;
    margin: 0;
    min-width: 0;
    resize: none;
    overflow: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.4;
    min-height: 10px !important;
  }

  .prompt-input::placeholder {
    color: var(--spectrum-global-color-gray-600);
    font-style: italic;
  }

  .action-buttons {
    display: flex;
    gap: var(--spacing-l);
    padding-right: var(--spacing-s);
    z-index: 4;
  }
</style>
