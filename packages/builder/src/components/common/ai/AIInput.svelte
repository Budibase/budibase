<script lang="ts">
  import { Icon, Button, Modal, ModalContent, Body, Link } from "@budibase/bbui"
  import { auth, admin, licensing } from "@/stores/portal"

  import { createEventDispatcher } from "svelte"
  import BBAI from "assets/bb-ai.svg"

  export let onSubmit: (_prompt: string) => Promise<void>
  export let placeholder: string = ""
  export let expanded: boolean = false
  export let expandedOnly: boolean = false
  export let readonly: boolean = false
  export let value: string = ""
  export const submit = onPromptSubmit

  $: expanded = expandedOnly || expanded

  const dispatch = createEventDispatcher()

  let promptInput: HTMLInputElement
  let buttonElement: HTMLButtonElement
  let promptLoading = false
  let switchOnAIModal: Modal
  let addCreditsModal: Modal

  $: accountPortalAccess = $auth?.user?.accountPortalAccess
  $: accountPortal = $admin.accountPortalUrl
  $: aiEnabled = $auth?.user?.llm

  $: creditsExceeded = $licensing.aiCreditsExceeded
  $: disabled = !aiEnabled || creditsExceeded || readonly || promptLoading
  $: animateBorder = !disabled && expanded

  $: canSubmit = !readonly && !!value

  function collapse() {
    dispatch("collapse")
    expanded = expandedOnly
    value = ""
    animateBorder = false
  }

  function toggleExpand() {
    if (!expanded) {
      expanded = true
      animateBorder = true
      setTimeout(() => {
        promptInput?.focus()
      }, 250)
    } else {
      collapse()
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      onPromptSubmit()
    } else if (event.key === "Escape") {
      collapse()
    } else {
      event.stopPropagation()
    }
  }

  async function onPromptSubmit() {
    if (!canSubmit) {
      return
    }
    promptLoading = true
    try {
      await onSubmit(value)
    } finally {
      promptLoading = false
    }
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

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
      class:disabled={expanded && disabled}
      on:click={e => {
        e.stopPropagation()
        toggleExpand()
      }}
    />
    {#if expanded}
      <input
        type="text"
        bind:this={promptInput}
        bind:value
        class="prompt-input"
        {placeholder}
        on:keydown={handleKeyPress}
        {disabled}
      />
    {:else}
      <span class="spectrum-ActionButton-label ai-gen-text">
        {placeholder}
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
                <Link href={"https://budibase.com/contact/"}>Contact sales</Link
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
          disabled={!canSubmit}
          hoverable={!readonly}
          hoverColor="#6E56FF"
          name={promptLoading ? "StopCircle" : "PlayCircle"}
          on:click={onPromptSubmit}
        />
      {/if}
    </div>
  {/if}
</button>

<style>
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
    height: 40px;
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
    margin-left: 4px;
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
    font-size: 14px;
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

  .prompt-input:disabled {
    color: var(--spectrum-global-color-gray-500);
    cursor: not-allowed;
  }

  .ai-icon.disabled {
    filter: grayscale(1) brightness(1.5);
    opacity: 0.5;
  }
</style>
