<script lang="ts">
  import { ActionButton, Icon, notifications } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { API } from "@/api"
  import type { EnrichedBinding } from "@budibase/types"
  import BBAI from "assets/bb-ai.svg"

  export let bindings: EnrichedBinding[] = []
  export let value: string | null = ""
  export let parentWidth: number | null = null
  export const dispatch = createEventDispatcher()

  let buttonContainer: HTMLElement
  let promptInput: HTMLTextAreaElement
  let buttonElement: HTMLButtonElement
  let promptLoading = false
  let suggestedCode: string | null = null
  let previousContents: string | null = null
  let expanded = false
  let containerWidth = "auto"
  let containerHeight = "40px"
  let promptText = ""
  let animateBorder = false

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
    animateBorder = true
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
    animateBorder = false
  }

  function toggleExpand() {
    if (!expanded) {
      expanded = true
      animateBorder = true
      // Calculate width based on size of CodeEditor parent
      containerWidth = parentWidth
        ? `${Math.min(Math.max(parentWidth * 0.8, 300), 600)}px`
        : "300px"
      containerHeight = "40px"
      setTimeout(() => {
        promptInput?.focus()
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
    class:animate-border={animateBorder}
    on:click={!expanded ? toggleExpand : undefined}
  >
    <div class="button-content-wrapper">
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
      {:else}
        <span class="spectrum-ActionButton-label ai-gen-text">
          Generate with AI
        </span>
      {/if}
    </div>

    {#if expanded}
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
    display: flex;
    overflow: visible;
  }

  .spectrum-ActionButton {
    --offset: 1px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: var(--spacing-s);
    border: 1px solid var(--spectrum-alias-border-color);
    border-radius: 30px;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: pointer;
    background-color: var(--spectrum-global-color-gray-75);
  }

  .spectrum-ActionButton::before {
    content: "";
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    border-radius: inherit;
    background: linear-gradient(
      125deg,
      transparent -10%,
      #6e56ff 5%,
      #9f8fff 15%,
      #9f8fff 25%,
      transparent 35%,
      transparent 110%
    );
    pointer-events: none;
    z-index: 0;
  }

  .spectrum-ActionButton:not(.animate-border)::before {
    content: none;
  }

  .animate-border::before {
    animation: border-fade-in 1s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    animation-fill-mode: forwards;
  }

  @keyframes border-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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
    border-radius: inherit;
  }

  .floating-actions {
    position: absolute;
    display: flex;
    gap: var(--spacing-s);
    bottom: calc(100% + 5px);
    left: 5px;
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

  .spectrum-ActionButton:hover {
    cursor: pointer;
    background-color: var(--spectrum-global-color-gray-75);
  }

  .spectrum-ActionButton.expanded {
    border-radius: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity 0.2s ease-out;
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
    margin-right: var(--spacing-xs);
  }

  .prompt-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: var(--font-size-s);
    font-family: var(--font-sans);
    color: var(--spectrum-alias-text-color);
    min-width: 0;
    resize: none;
    overflow: hidden;
    line-height: 1.2;
    min-height: 10px !important;
  }

  .prompt-input::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }

  .action-buttons {
    display: flex;
    gap: var(--spacing-s);
    z-index: 4;
    flex-shrink: 0;
  }

  .button-content-wrapper {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    flex-grow: 1;
    min-width: 0;
  }
</style>
