<script>
  import { themeStore } from "stores"
  import { setContext } from "svelte"
  import { Context } from "@budibase/bbui"

  setContext(Context.PopoverRoot, "#theme-root")
</script>

<div style={$themeStore.customThemeCss} id="theme-root">
  <slot />
</div>

<style>
  div {
    display: contents;
  }

  /* Themes */
  div {
    /*  Buttons */
    --spectrum-semantic-cta-color-background-default: var(--primaryColor);
    --spectrum-semantic-cta-color-background-hover: var(--primaryColorHover);
    --spectrum-semantic-cta-color-background-down: var(--primaryColorHover);
    --spectrum-button-primary-s-border-radius: calc(
      var(--buttonBorderRadius) * 0.9
    );
    --spectrum-button-primary-m-border-radius: var(--buttonBorderRadius);
    --spectrum-button-primary-l-border-radius: calc(
      var(--buttonBorderRadius) * 1.25
    );
    --spectrum-button-primary-xl-border-radius: calc(
      var(--buttonBorderRadius) * 1.5
    );

    /* Loading spinners */
    --spectrum-progresscircle-medium-track-fill-color: var(--primaryColor);

    /* Form fields */
    --spectrum-alias-border-color-mouse-focus: var(--primaryColor);
    --spectrum-alias-border-color-focus: var(--primaryColor);
    --spectrum-radio-m-emphasized-circle-border-color-selected: var(
      --primaryColor
    );
    --spectrum-radio-m-emphasized-circle-border-color-selected-hover: var(
      --primaryColorHover
    );
    --spectrum-checkbox-m-emphasized-box-border-color-selected: var(
      --primaryColor
    );
    --spectrum-checkbox-m-emphasized-box-border-color-selected-hover: var(
      --primaryColorHover
    );

    /* Icons */
    --spectrum-alias-icon-color-selected: var(--primaryColor);
    --spectrum-alias-icon-color-selected-hover: var(--primaryColorHover);

    /* Links */
    --spectrum-link-primary-m-text-color: var(--primaryColor);
    --spectrum-link-primary-m-text-color-hover: var(--primaryColorHover);
  }

  /* Theme flatpickr */
  :global(.flatpickr-day.selected) {
    background: var(--primaryColor);
    border-color: var(--primaryColor);
  }
  :global(.flatpickr-day.selected:hover) {
    background: var(--primaryColorHover);
    border-color: var(--primaryColorHover);
  }

  /* Custom scrollbars */
  :global(::-webkit-scrollbar) {
    width: 8px;
    height: 8px;
  }
  :global(::-webkit-scrollbar-track) {
    background: var(--spectrum-alias-background-color-default);
  }
  :global(::-webkit-scrollbar-thumb) {
    background-color: var(--spectrum-global-color-gray-400);
    border-radius: 4px;
  }
  :global(::-webkit-scrollbar-corner) {
    background: var(--spectrum-alias-background-color-default);
  }
  :global(*) {
    scrollbar-width: thin;
    scrollbar-color: var(--spectrum-global-color-gray-400)
      var(--spectrum-alias-background-color-default);
  }

  /* Remove border when editing contenteditable components */
  :global(*[contenteditable="true"]:focus) {
    outline: none;
  }
</style>
