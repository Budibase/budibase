<script>
  import "@spectrum-css/tags/dist/index-vars.css"
  import Avatar from "../Avatar/Avatar.svelte"
  import ClearButton from "../ClearButton/ClearButton.svelte"

  export let icon = ""
  export let avatar = ""
  export let invalid = false
  export let disabled = false
  export let closable = false
</script>

<div
  class:is-invalid={invalid}
  class:is-disabled={disabled}
  class="spectrum-Tags-item"
  role="listitem"
>
  {#if avatar}
    <Avatar url={avatar} />
  {/if}
  {#if icon}
    <svg
      class="spectrum-Icon spectrum-Icon--sizeS"
      focusable="false"
      aria-hidden="true"
      aria-label="Tag"
    >
      <use xlink:href="#spectrum-icon-24-{icon}" />
    </svg>
  {/if}
  <span class="spectrum-Tags-itemLabel"><slot /></span>
  {#if closable}
    <ClearButton small id="clear" on:click />
  {/if}
</div>

<style>
  .spectrum-Tags-item > .spectrum-Icon {
    margin-right: 2px !important;
  }
  .spectrum-Tags-item {
    position: relative;
    display: inline-flex !important;
    max-width: 100%;
    align-items: center !important;
    padding: 2px 8px !important;
    background-color: var(--spectrum-global-color-gray-300);
    border: none;
    border-radius: 7px;
    text-decoration: none;
    color: var(--spectrum-global-color-gray-900);
  }
  /* Change the color of the tag to draw the eye */
  .spectrum-Tags-item:has(.spectrum-Icon) {
    position: relative;
    display: inline-flex !important;
    max-width: 100%;
    align-items: center !important;
    padding: 2px 8px !important;
    background-color: var(--spectrum-global-color-indigo-700);
    border: none;
    border-radius: 7px;
    text-decoration: none;
    color: var(--spectrum-global-color-indigo-100);
  }
  /* Change the color of the tag to match the default tag when it has a close button */
  .spectrum-Tags-item:has(.spectrum-Icon):has(button):has(svg) {
    position: relative;
    display: inline-flex !important;
    max-width: 100%;
    align-items: center !important;
    padding: 2px 8px !important;
    background-color: var(--spectrum-global-color-gray-300);
    border: none;
    border-radius: 7px;
    text-decoration: none;
    color: var(--spectrum-global-color-gray-900);
  }

  .spectrum-Tags-itemLabel {
    font-size: 13px;
    font-weight: 400;
    pointer-events: auto;
    margin: 0 !important;
    line-height: 1 !important;
    height: auto;
  }
</style>
