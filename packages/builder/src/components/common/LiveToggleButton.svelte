<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Button } from "@budibase/bbui"

  type ButtonSize = "XXS" | "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL"

  interface Props {
    live: boolean
    disabled?: boolean
    size?: ButtonSize
  }

  let { live, disabled = false, size = "M" }: Props = $props()
  const dispatch = createEventDispatcher<{ click: void }>()

  let iconColor = $derived(
    disabled
      ? "var(--spectrum-global-color-gray-500)"
      : live
        ? undefined
        : "var(--spectrum-global-color-static-gray-50)"
  )
</script>

<div class="live-toggle-button">
  <Button
    primary={!live}
    secondary={live}
    icon={live ? "stop" : "play"}
    {iconColor}
    iconWeight="fill"
    {disabled}
    {size}
    on:click={() => dispatch("click")}
  >
    {live ? "Stop" : "Set live"}
  </Button>
</div>

<style>
  .live-toggle-button {
    display: contents;
  }

  .live-toggle-button :global(button.spectrum-Button.new-styles) {
    transition:
      background 130ms ease-out,
      color 130ms ease-out;
  }

  .live-toggle-button
    :global(button.spectrum-Button--primary.new-styles:not(.is-disabled)) {
    background: var(--color-blue-500);
    border-color: transparent;
    color: var(--spectrum-global-color-static-gray-50);
  }

  .live-toggle-button
    :global(
      button.spectrum-Button--primary.new-styles:not(.is-disabled)
        .spectrum-Button-label
    ) {
    color: var(--spectrum-global-color-static-gray-50);
  }

  .live-toggle-button
    :global(
      button.spectrum-Button--primary.new-styles:not(.is-disabled):hover
    ) {
    background: var(--color-blue-600);
  }
</style>
