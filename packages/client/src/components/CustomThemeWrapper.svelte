<script>
  import { themeStore } from "stores"
</script>

<div style={$themeStore.customThemeCss}>
  <slot />
</div>

<style>
  div {
    display: contents;
  }

  /* Themes */
  div {
    /* General */
    --spectrum-global-color-blue-600: var(--primaryColor);
    --spectrum-global-color-blue-700: var(--primaryColor);
    --spectrum-global-color-static-blue-600: var(--primaryColor);
    --spectrum-global-color-static-blue-700: var(--primaryColor);
    --spectrum-global-color-blue-400: var(--primaryColorHover);
    --spectrum-global-color-blue-500: var(--primaryColorHover);
    --spectrum-global-color-static-blue-400: var(--primaryColorHover);
    --spectrum-global-color-static-blue-500: var(--primaryColorHover);

    /*  Buttons */
    --spectrum-semantic-cta-color-background-default: var(--primaryColor);
    --spectrum-semantic-cta-color-background-hover: var(--primaryColorHover);

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
</style>
