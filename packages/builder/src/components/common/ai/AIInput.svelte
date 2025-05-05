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
  $: disabled = !aiEnabled || creditsExceeded || readonly
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
      class:loading={promptLoading}
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
        disabled={disabled || promptLoading}
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
          color={promptInput
            ? "#6E56FF"
            : "var(--spectrum-global-color-gray-600)"}
          size="S"
          disabled={!canSubmit || promptLoading}
          hoverable={!readonly}
          hoverColor="#6E56FF"
          name={"PlayCircle"}
          on:click={onPromptSubmit}
        />
      {/if}
    </div>
  {/if}
</button>

<style>
  .spectrum-ActionButton {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: var(--spacing-s);
    border-radius: 30px;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    height: 40px;
    overflow: hidden;
    cursor: pointer;
    background-color: var(--spectrum-global-color-gray-75);
    border: none;
  }

  .spectrum-ActionButton::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 30px;
    padding: 1px;
    background: var(--spectrum-alias-border-color);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .animate-border::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 30px;
    padding: 1px;
    background: linear-gradient(
      125deg,
      transparent -10%,
      #6e56ff 2%,
      #9f8fff 15%,
      #9f8fff 25%,
      transparent 35%,
      transparent 110%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
    animation: border-flow 1.5s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;
  }

  @keyframes border-flow {
    0% {
      clip-path: polygon(0% 0%, 10% 0%, 8% 100%, 0% 100%);
    }
    30% {
      clip-path: polygon(0% 0%, 35% 0%, 26% 100%, 0% 100%);
    }
    50% {
      clip-path: polygon(0% 0%, 55% 0%, 41% 100%, 0% 100%);
    }
    70% {
      clip-path: polygon(0% 0%, 70% 0%, 53% 100%, 0% 100%);
    }
    85% {
      clip-path: polygon(0% 0%, 80% 0%, 60% 100%, 0% 100%);
    }
    95% {
      clip-path: polygon(0% 0%, 86% 0%, 65% 100%, 0% 100%);
    }
    100% {
      clip-path: polygon(0% 0%, 90% 0%, 68% 100%, 0% 100%);
    }
  }

  .spectrum-ActionButton:not(.animate-border)::after {
    content: none;
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
    margin-left: var(--spacing-xs);
    margin-right: var(--spacing-s);
    flex-shrink: 0;
    cursor: var(--ai-icon-cursor, pointer);
    position: relative;
    z-index: 2;
  }

  .ai-gen-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity 0.2s ease-out;
    margin: auto;
    position: relative;
    z-index: 2;
  }

  .prompt-input {
    font-size: inherit;
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: var(--font-sans);
    color: var(--spectrum-alias-text-color);
    min-width: 0;
    resize: none;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }

  .prompt-input::placeholder {
    color: var(--spectrum-global-color-gray-600);
    font-family: var(--font-sans);
  }

  .action-buttons {
    display: flex;
    gap: var(--spacing-s);
    z-index: 5;
    flex-shrink: 0;
    margin-right: var(--spacing-s);
    position: relative;
  }

  .button-content-wrapper {
    position: relative;
    z-index: 2;
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

  .ai-icon.loading {
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
