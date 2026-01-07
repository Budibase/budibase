<script lang="ts" context="module">
  import type { LanguageModelUsage } from "ai"
  import type { ChainStepStatus } from "./chainOfThoughtStatus"

  export interface ChainStep {
    id: string
    name: string
    displayName: string
    status: ChainStepStatus
    reasoning?: string
    input?: unknown
    output?: unknown
    usage?: LanguageModelUsage
  }
</script>

<script lang="ts">
  import { fly } from "svelte/transition"
  import { StatusLight } from "@budibase/bbui"
  import {
    getStatusBadgeClass,
    getStatusLabel,
    getStatusLightColor,
  } from "./chainOfThoughtStatus"

  export let steps: ChainStep[] = []
  export let simple: boolean = false
</script>

<div class="timeline" class:simple>
  {#each steps as step, index (step.id)}
    {@const isLast = index === steps.length - 1}

    <div class="step" in:fly={{ y: 8, duration: 200, delay: index * 30 }}>
      <div class="track">
        <div class="node">
          <StatusLight size="S" color={getStatusLightColor(step.status)} />
        </div>
        {#if !isLast}
          <div class="connector"></div>
        {/if}
      </div>

      <div class="content">
        <span class="name">{step.displayName}</span>
        <span class="status {getStatusBadgeClass(step.status)}">
          {getStatusLabel(step.status)}
        </span>
      </div>
    </div>
  {/each}
</div>

<style>
  .timeline {
    display: flex;
    flex-direction: column;
    padding: 4px 0;
  }

  .step {
    display: flex;
    gap: 12px;
  }

  .track {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 16px;
    flex-shrink: 0;
  }

  .node {
    margin-top: 2px;
  }

  .connector {
    width: 1px;
    flex: 1;
    min-height: 16px;
    background: var(--spectrum-global-color-gray-500);
    opacity: 0.5;
  }

  .content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 14px;
    min-width: 0;
  }

  .name {
    font-size: 13px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status {
    font-size: 11px;
    font-weight: 500;
    flex-shrink: 0;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .status.badge-positive {
    background: color-mix(
      in srgb,
      var(--spectrum-global-color-green-500) 15%,
      transparent
    );
    color: var(--spectrum-global-color-green-600);
  }

  .status.badge-negative {
    background: color-mix(
      in srgb,
      var(--spectrum-global-color-red-500) 15%,
      transparent
    );
    color: var(--spectrum-global-color-red-600);
  }

  .status.badge-neutral {
    background: color-mix(
      in srgb,
      var(--spectrum-global-color-gray-500) 15%,
      transparent
    );
    color: var(--spectrum-global-color-gray-700);
  }
</style>
