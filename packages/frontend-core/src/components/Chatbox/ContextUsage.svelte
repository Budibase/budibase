<script lang="ts">
  import {
    Icon,
    Popover,
    PopoverAlignment,
    type PopoverAPI,
  } from "@budibase/bbui"
  import type {
    AgentMessageUsage,
    AgentMessageUsageSegment,
  } from "@budibase/types"

  type SegmentDetails = {
    name: string
    color: string
  }
  type VisibleSegment = AgentMessageUsageSegment & SegmentDetails

  interface Props {
    usage?: AgentMessageUsage
  }

  let { usage }: Props = $props()

  let open = $state(false)
  let triggerEl = $state<HTMLButtonElement>()
  let popover = $state<PopoverAPI>()

  const DEFAULT_MAX_TOKENS = 200000
  const SEGMENT_DETAILS: Record<
    AgentMessageUsageSegment["type"],
    SegmentDetails
  > = {
    system: {
      name: "System prompt",
      color: "var(--grey-7)",
    },
    input: {
      name: "Input",
      color: "var(--color-purple-500)",
    },
    cachedInput: {
      name: "Cached input",
      color: "var(--color-blue-400)",
    },
    output: {
      name: "Output",
      color: "var(--color-red-500)",
    },
    reasoning: {
      name: "Reasoning",
      color: "var(--color-orange-500)",
    },
  }

  const maxTokens = $derived(usage?.maxTokens ?? DEFAULT_MAX_TOKENS)
  const visibleSegments = $derived.by((): VisibleSegment[] =>
    (usage?.segments || [])
      .filter(segment => segment.tokens > 0)
      .map(segment => ({
        ...segment,
        ...SEGMENT_DETAILS[segment.type],
      }))
  )
  const totalTokens = $derived(
    visibleSegments.reduce((sum, s) => sum + s.tokens, 0)
  )
  const percentage = $derived(
    maxTokens > 0
      ? Math.min(100, Math.round((totalTokens / maxTokens) * 100))
      : 0
  )

  const RING_RADIUS = 7
  const RING_CIRC = 2 * Math.PI * RING_RADIUS
  const dashOffset = $derived(RING_CIRC - (percentage / 100) * RING_CIRC)

  const compact = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
</script>

<button
  bind:this={triggerEl}
  type="button"
  class="trigger"
  class:active={open}
  onclick={() => popover?.show()}
  aria-label="Context usage"
  aria-expanded={open}
>
  <span class="ring" aria-hidden="true">
    <svg viewBox="0 0 18 18">
      <circle cx="9" cy="9" r={RING_RADIUS} class="ring-track" />
      <circle
        cx="9"
        cy="9"
        r={RING_RADIUS}
        class="ring-progress"
        style="stroke-dasharray: {RING_CIRC}; stroke-dashoffset: {dashOffset};"
      />
    </svg>
  </span>
  <span class="trigger-label">
    <span class="trigger-percent">{percentage}%</span>
    <span class="trigger-suffix">context</span>
  </span>
</button>

<Popover
  bind:this={popover}
  bind:open
  anchor={triggerEl}
  align={PopoverAlignment.Right}
  offset={8}
  minWidth={420}
  maxWidth={420}
  resizable={false}
>
  <div class="popover">
    <header class="popover-header">
      <span class="popover-title">Context</span>
      <span class="popover-fill">{percentage}% Full</span>
      <div class="popover-right">
        {#if usage}
          <span class="popover-total">
            ~{compact.format(totalTokens)} / {compact.format(maxTokens)} Tokens
          </span>
        {/if}
        <button
          class="popover-close"
          type="button"
          onclick={() => popover?.hide()}
          aria-label="Close context details"
        >
          <Icon
            name="x"
            size="S"
            color="var(--spectrum-global-color-gray-700)"
          />
        </button>
      </div>
    </header>

    <div class="bar" role="img" aria-label="Context breakdown">
      {#each visibleSegments as segment (segment.name)}
        {@const segPct = (segment.tokens / maxTokens) * 100}
        <span
          class="bar-segment"
          style="width: {segPct}%; background: {segment.color};"
        ></span>
      {/each}
    </div>

    <ul class="legend">
      {#each visibleSegments as segment (segment.name)}
        <li class="legend-row">
          <span class="legend-swatch" style="background: {segment.color};"
          ></span>
          <span class="legend-name">{segment.name}</span>
          <span class="legend-tokens">{compact.format(segment.tokens)}</span>
        </li>
      {/each}
    </ul>
  </div>
</Popover>

<style>
  .trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px 4px 6px;
    border: 1px solid transparent;
    border-radius: 999px;
    background: transparent;
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease;
  }

  .trigger:hover,
  .trigger.active {
    background: var(--spectrum-global-color-gray-100);
    border-color: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-900);
  }

  .ring {
    display: inline-flex;
    width: 16px;
    height: 16px;
  }

  .ring svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .ring-track {
    fill: none;
    stroke: var(--spectrum-global-color-gray-300);
    stroke-width: 2;
  }

  .ring-progress {
    fill: none;
    stroke: var(--spectrum-global-color-gray-800);
    stroke-width: 2;
    stroke-linecap: round;
    transition:
      stroke-dashoffset 0.4s cubic-bezier(0.22, 1, 0.36, 1),
      stroke 0.2s ease;
  }

  .trigger-label {
    display: inline-flex;
    gap: 4px;
    align-items: baseline;
    font-variant-numeric: tabular-nums;
  }

  .trigger-percent {
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .trigger-suffix {
    color: var(--spectrum-global-color-gray-700);
  }

  .popover {
    padding: 16px 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .popover-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-variant-numeric: tabular-nums;
  }

  .popover-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    letter-spacing: -0.01em;
  }

  .popover-fill {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
  }

  .popover-right {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .popover-total {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    white-space: nowrap;
  }

  .popover-close {
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--spectrum-global-color-gray-700);
    transition: background-color 0.15s ease;
  }

  .popover-close:hover {
    background: var(--spectrum-global-color-gray-200);
  }

  .bar {
    display: flex;
    width: 100%;
    height: 8px;
    border-radius: 999px;
    background: var(--spectrum-global-color-gray-200);
    overflow: hidden;
    gap: 2px;
  }

  .bar-segment {
    height: 100%;
    transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .bar-segment:first-child {
    border-top-left-radius: 999px;
    border-bottom-left-radius: 999px;
  }

  .legend {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .legend-row {
    display: grid;
    grid-template-columns: 14px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 6px 2px;
    font-size: 13px;
  }

  .legend-row + .legend-row {
    border-top: 1px solid var(--spectrum-global-color-gray-100);
  }

  .legend-swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    display: inline-block;
  }

  .legend-name {
    color: var(--spectrum-global-color-gray-800);
  }

  .legend-tokens {
    color: var(--spectrum-global-color-gray-700);
    font-variant-numeric: tabular-nums;
    font-size: 12px;
  }
</style>
