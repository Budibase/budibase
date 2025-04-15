<script lang="ts">
  import {
    ActionButton,
    Icon,
    notifications,
    Button,
    Modal,
    ModalContent,
    Body,
    Link,
  } from "@budibase/bbui"
  import { auth, admin } from "@/stores/portal"

  import { createEventDispatcher } from "svelte"
  import { API } from "@/api"
  import type { EnrichedBinding } from "@budibase/types"
  import BBAI from "assets/bb-ai.svg"

  export let bindings: EnrichedBinding[] = []
  export let value: string | null = ""
  export let expandedOnly: boolean = false

  export let parentWidth: number | null = null
  export const dispatch = createEventDispatcher<{
    update: { code: string }
    accept: void
    reject: { code: string | null }
  }>()

  let promptInput: HTMLInputElement
  let buttonElement: HTMLButtonElement
  let promptLoading = false
  let suggestedCode: string | null = null
  let previousContents: string | null = null
  let expanded = false
  let containerWidth = "auto"
  let promptText = ""
  let animateBorder = false
  let creditsExceeded = false // TODO: Make this computed when quota is implemented
  let switchOnAIModal: Modal
  let addCreditsModal: Modal

  $: accountPortalAccess = $auth?.user?.accountPortalAccess
  $: accountPortal = $admin.accountPortalUrl
  $: aiEnabled = !!$auth?.user?.llm
  $: expanded = expandedOnly ? true : expanded

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
    promptText = ""
    suggestedCode = null
    previousContents = null
    animateBorder = false
  }

  function toggleExpand() {
    if (!expanded) {
      expanded = true
      animateBorder = true
      // Calculate width based on size of parent
      containerWidth = parentWidth
        ? `${Math.min(Math.max(parentWidth * 0.8, 300), 600)}px`
        : "300px"
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

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="ai-gen-container" style="--container-width: {containerWidth}">
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
      <img
        src={BBAI}
        alt="AI"
        class="ai-icon"
        class:disabled={expanded &&
          (suggestedCode !== null || !aiEnabled || creditsExceeded)}
        on:click={!expandedOnly
          ? e => {
              e.stopPropagation()
              toggleExpand()
            }
          : undefined}
      />
      {#if expanded}
        <input
          type="text"
          bind:this={promptInput}
          bind:value={promptText}
          class="prompt-input"
          placeholder="Generate Javascript..."
          on:keydown={handleKeyPress}
          disabled={suggestedCode !== null || !aiEnabled || creditsExceeded}
          readonly={suggestedCode !== null}
        />
      {:else}
        <span class="spectrum-ActionButton-label ai-gen-text">
          Generate with AI
        </span>
      {/if}
    </div>
    {#if expanded}
      <div class="action-buttons">
        {#if !aiEnabled}
          <Button cta size="S" on:click={() => switchOnAIModal.show()}>
            Switch on AI
          </Button>
          <Modal bind:this={switchOnAIModal}>
            <ModalContent title="Switch on AI" showConfirmButton={false}>
              <div class="enable-ai">
                <p>To enable BB AI:</p>
                <ul>
                  <li>
                    Add your Budibase license key:
                    <Link href={accountPortal}>Budibase account portal</Link>
                  </li>
                  <li>
                    Go to the portal settings page, click AI and switch on BB AI
                  </li>
                </ul>
              </div>
            </ModalContent>
          </Modal>
        {:else if creditsExceeded}
          <Button cta size="S" on:click={() => addCreditsModal.show()}>
            Add AI credits
          </Button>
          <Modal bind:this={addCreditsModal}>
            <ModalContent title="Add AI credits" showConfirmButton={false}>
              <Body size="S">
                {#if accountPortalAccess}
                  <Link href={"https://budibase.com/contact/"}
                    >Contact sales</Link
                  > to unlock additional BB AI credits
                {:else}
                  Contact your account holder to unlock additional BB AI credits
                {/if}
              </Body>
            </ModalContent>
          </Modal>
        {:else}
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
        {/if}
      </div>
    {/if}
  </button>
</div>

<style>
  .ai-gen-container {
    height: 40px;
    --container-width: auto;
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: var(--container-width);
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
      #6e56ff 2%,
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
    cursor: var(--ai-icon-cursor, pointer);
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
    font-family: var(--font-sans);
    color: var(--spectrum-alias-text-color);
    min-width: 0;
    resize: none;
    overflow: hidden;
  }

  .prompt-input::placeholder {
    color: var(--spectrum-global-color-gray-600);
    font-family: var(--font-sans);
  }

  .action-buttons {
    display: flex;
    gap: var(--spacing-s);
    z-index: 4;
    flex-shrink: 0;
    margin-right: var(--spacing-s);
  }

  .button-content-wrapper {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    flex-grow: 1;
    min-width: 0;
    margin-right: var(--spacing-s);
  }

  .prompt-input:disabled,
  .prompt-input[readonly] {
    color: var(--spectrum-global-color-gray-500);
    cursor: not-allowed;
  }

  .ai-icon.disabled {
    filter: grayscale(1) brightness(1.5);
    opacity: 0.5;
  }

  :global(.ai-gen-container[expandedonly]) .ai-icon {
    cursor: default;
  }
</style>
