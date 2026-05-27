<script lang="ts">
  import { slide } from "svelte/transition"
  import { Icon } from "@budibase/bbui"

  export let title: string = "Validation rule"
  export let summary: string = ""
  export let error: string | undefined = ""
  export let expanded: boolean = false
  export let onToggle: (() => void) | undefined = undefined
</script>

<div class="rule-card" class:rule-card--expanded={expanded}>
  <div class="rule-card__header">
    <button
      class="rule-card__summary"
      type="button"
      aria-expanded={expanded}
      on:click={() => onToggle?.()}
    >
      <span class="rule-card__caret" class:rule-card__caret--open={expanded}>
        <Icon name="caret-right" size="S" />
      </span>
      <span class="rule-card__title">{title}</span>
      {#if summary}
        <span class="rule-card__chip">{summary}</span>
      {/if}
      {#if error}
        <span class="rule-card__error">"{error}"</span>
      {/if}
    </button>
    {#if $$slots.actions}
      <div class="rule-card__actions">
        <slot name="actions" />
      </div>
    {/if}
  </div>

  {#if expanded}
    <div class="rule-card__details" transition:slide|local={{ duration: 180 }}>
      <slot />
    </div>
  {/if}
</div>

<style>
  .rule-card {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: var(--border-radius-s);
    background-color: var(--spectrum-global-color-gray-75);
    overflow: hidden;
    transition:
      background-color 130ms ease,
      border-color 130ms ease;
  }
  .rule-card:hover,
  .rule-card--expanded {
    background-color: var(--spectrum-global-color-gray-100);
    border-color: var(--spectrum-global-color-gray-300);
  }
  .rule-card__header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: var(--spacing-s);
  }
  .rule-card__summary {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-s) var(--spacing-m);
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    min-width: 0;
  }
  .rule-card__caret {
    display: inline-flex;
    align-items: center;
    transition: transform 120ms ease;
    color: var(--spectrum-global-color-gray-700);
  }
  .rule-card__caret--open {
    transform: rotate(90deg);
  }
  .rule-card__title {
    font-weight: 600;
    font-size: 13px;
    color: var(--spectrum-global-color-gray-900);
    flex-shrink: 0;
  }
  .rule-card__chip {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-800);
    background-color: var(--spectrum-global-color-gray-200);
    padding: 1px var(--spacing-s);
    border-radius: var(--border-radius-s);
    flex-shrink: 0;
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .rule-card__error {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    font-style: italic;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
  }
  .rule-card__actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding-right: var(--spacing-m);
  }
  .rule-card__details {
    padding: var(--spacing-s) var(--spacing-m) var(--spacing-m) var(--spacing-m);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
  }

  @media (max-width: 900px) {
    .rule-card__summary {
      align-items: flex-start;
      flex-wrap: wrap;
    }
  }
</style>
