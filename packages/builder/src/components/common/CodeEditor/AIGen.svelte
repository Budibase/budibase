<script lang="ts">
  import { ActionButton, notifications } from "@budibase/bbui"

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

  const thresholdExpansionWidth = 350

  $: expanded =
    expandedOnly ||
    (parentWidth !== null && parentWidth > thresholdExpansionWidth)
      ? true
      : expanded

  $: containerWidth = expanded ? calculateExpandedWidth() : "auto"

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
  }

  function calculateExpandedWidth() {
    return parentWidth
      ? `${Math.min(Math.max(parentWidth * 0.8, 300), 600)}px`
      : "300px"
  }
</script>

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

  <AiInput
    placeholder="Generate with AI"
    onSubmit={generateJs}
    bind:expanded
    readonly={!!suggestedCode}
    {expandedOnly}
  />
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

  .floating-actions {
    position: absolute;
    display: flex;
    gap: var(--spacing-s);
    bottom: calc(100% + 5px);
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
</style>
