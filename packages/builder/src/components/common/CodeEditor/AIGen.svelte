<script lang="ts">
  import { Button, notifications } from "@budibase/bbui"

  import { createEventDispatcher } from "svelte"
  import { API } from "@/api"
  import { ErrorCode, type EnrichedBinding } from "@budibase/types"
  import analytics, { Events } from "@/analytics"
  import AiInput from "../ai/AIInput.svelte"

  export let bindings: EnrichedBinding[] = []
  export let value: string | null = ""
  export let expandedOnly: boolean = false

  export let parentWidth: number | null = null
  const dispatch = createEventDispatcher<{
    update: { code: string }
    accept: void
    reject: { code: string | null }
  }>()

  let suggestedCode: string | null = null
  let previousContents: string | null = null
  let expanded = false
  let promptText = ""
  let inputValue = ""

  const thresholdExpansionWidth = 350

  $: expanded =
    expandedOnly ||
    (parentWidth !== null && parentWidth > thresholdExpansionWidth)
      ? true
      : expanded

  async function generateJs(prompt: string) {
    promptText = ""
    if (!prompt.trim()) return

    previousContents = value
    promptText = prompt
    try {
      const resp = await API.generateJs({ prompt, bindings })
      const code = resp.code
      if (code === "") {
        throw new Error(
          "We didn't understand your prompt. This can happen if the prompt isn't specific, or if it's a request for something other than code. Try expressing your request in a different way."
        )
      }
      suggestedCode = code
      dispatch("update", { code })
    } catch (e) {
      console.error(e)
      if (!(e instanceof Error)) {
        notifications.error("Unable to generate code. Please try again later.")
        return
      }

      if ("code" in e && e.code === ErrorCode.USAGE_LIMIT_EXCEEDED) {
        notifications.error(
          "Monthly usage limit reached. We're exploring options to expand this soon. Questions? Contact support@budibase.com"
        )
      } else {
        notifications.error(`Unable to generate code: ${e.message}`)
      }
    }
  }

  function acceptSuggestion() {
    analytics.captureEvent(Events.AI_JS_ACCEPTED, {
      code: suggestedCode,
      prompt: promptText,
    })
    dispatch("accept")
    reset()
  }

  function rejectSuggestion() {
    analytics.captureEvent(Events.AI_JS_REJECTED, {
      code: suggestedCode,
      prompt: promptText,
    })
    dispatch("reject", { code: previousContents })
    reset()
  }

  function reset() {
    suggestedCode = null
    previousContents = null
    promptText = ""
    expanded = false
    inputValue = ""
  }
</script>

<div class="ai-gen-container" class:expanded>
  {#if suggestedCode !== null}
    <div class="floating-actions">
      <Button cta size="S" icon="CheckmarkCircle" on:click={acceptSuggestion}>
        Accept
      </Button>
      <Button primary size="S" icon="Delete" on:click={rejectSuggestion}
        >Reject</Button
      >
    </div>
  {/if}

  <AiInput
    placeholder="Generate with AI"
    onSubmit={generateJs}
    bind:expanded
    bind:value={inputValue}
    readonly={!!suggestedCode}
    {expandedOnly}
  />
</div>

<style>
  .ai-gen-container {
    height: 40px;
    position: absolute;
    bottom: var(--spacing-s);
    right: var(--spacing-s);
    display: flex;
    overflow: visible;
    transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    width: 22ch;
  }

  .ai-gen-container.expanded {
    width: calc(100% - var(--spacing-s) * 2);
  }

  .floating-actions {
    position: absolute;
    display: flex;
    gap: var(--spacing-s);
    bottom: calc(100% + var(--spacing-s));
    z-index: 2;
    animation: fade-in 0.2s ease-out forwards;
    width: 100%;
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
</style>
