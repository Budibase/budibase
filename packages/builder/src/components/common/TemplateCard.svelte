<script lang="ts">
  import { Icon } from "@budibase/bbui"

  export let backgroundColour: string
  export let imageSrc: string
  export let name: string
  export let icon: string
  export let overlayEnabled: boolean = true

  let imageError = false

  const imageRenderError = () => {
    imageError = true
  }
</script>

<div class="template-card" style="background-color:{backgroundColour};">
  <div class="template-thumbnail card-body">
    <img
      alt={name}
      src={imageSrc}
      on:error={imageRenderError}
      class:error={imageError}
    />
    <div style={`display:${imageError ? "block" : "none"}`}>
      <Icon name={icon} size="XL" color="white" />
    </div>
    <div class={overlayEnabled ? "template-thumbnail-action-overlay" : ""}>
      <slot />
    </div>
  </div>
  <div class="template-thumbnail-text">
    <div>{name}</div>
  </div>
</div>

<style>
  .template-thumbnail {
    position: relative;
  }

  .template-card:hover .template-thumbnail-action-overlay {
    opacity: 1;
  }

  .template-thumbnail-action-overlay {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    opacity: 0;
    transition: opacity var(--spectrum-global-animation-duration-100) ease;
    border-top-right-radius: inherit;
    border-top-left-radius: inherit;
  }

  .template-thumbnail-text {
    position: absolute;
    bottom: 0px;
    display: flex;
    align-items: center;
    height: 30%;
    width: 100%;
    color: var(
      --spectrum-heading-xs-text-color,
      var(--spectrum-alias-heading-text-color)
    );
    background-color: var(--spectrum-global-color-gray-50);
  }

  .template-thumbnail-text > div {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .template-card {
    position: relative;
    display: flex;
    border-radius: var(--border-radius-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
    overflow: hidden;
    min-height: 200px;
  }

  .template-card > * {
    width: 100%;
  }

  .template-card img {
    display: block;
    max-width: 100%;
    border-radius: var(--border-radius-s) 0px var(--border-radius-s) 0px;
  }
  .template-card img.error {
    display: none;
  }

  .template-card:hover {
    background: var(--spectrum-alias-background-color-tertiary);
  }

  .card-body {
    padding-left: 1rem;
    padding-top: 1rem;
  }
</style>
