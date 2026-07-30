<script lang="ts">
  import { Label } from "@budibase/bbui"
  import {
    AppFontFamilyOptions,
    ensureValidAppFontFamily,
    getAppFontFamilyStack,
  } from "@budibase/shared-core"
  import type { AppCustomTheme } from "@budibase/types"
  import { createEventDispatcher } from "svelte"

  export let customTheme: AppCustomTheme = {}

  const dispatch = createEventDispatcher<{ change: string }>()

  $: value = ensureValidAppFontFamily(customTheme.fontFamily)

  const onChange = (fontFamily: string) => {
    dispatch("change", ensureValidAppFontFamily(fontFamily))
  }
</script>

<div class="container">
  <Label>Font</Label>
  {#each AppFontFamilyOptions as option}
    <button
      type="button"
      class="font"
      class:selected={option.value === value}
      style:font-family={getAppFontFamilyStack(option.value)}
      aria-pressed={option.value === value}
      on:click={() => onChange(option.value)}
    >
      {option.label}
    </button>
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xs);
  }
  .font {
    border: 0;
    border-radius: 4px;
    padding: var(--spacing-s) var(--spacing-m);
    background: transparent;
    color: var(--spectrum-global-color-gray-900);
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: left;
    transition: background 130ms ease-out;
    font-size: inherit;
    line-height: 20px;
    font-weight: 600;
  }
  .font:hover {
    cursor: pointer;
  }
  .font.selected,
  .font:hover {
    background: var(--spectrum-global-color-gray-50);
  }
</style>
