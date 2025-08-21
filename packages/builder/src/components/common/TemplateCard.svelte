<script lang="ts">
  import { Icon, ProgressCircle } from "@budibase/bbui"

  export let backgroundColour: string
  export let imageSrc: string
  export let name: string
  export let icon: string
  export let description = ""
  export let overlayEnabled: boolean = true
  export let isLoading: boolean = false
  export let isSelected: boolean = false

  let imageError = false

  const imageRenderError = () => {
    imageError = true
  }
</script>

<div
  class="template-card"
  class:loading={isLoading}
  class:disabled={isLoading && !isSelected}
  style="background-color:{backgroundColour};"
>
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
    {#if isLoading && isSelected}
      <div class="loading-overlay">
        <ProgressCircle size="M" overBackground />
      </div>
    {/if}
  </div>
  <div class="template-thumbnail-text">
    <div class="template-name">{name}</div>
    {#if description}
      <div class="template-description">{description}</div>
    {/if}
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
    flex-direction: column;
    height: 35%;
    width: 100%;
    background-color: var(--spectrum-global-color-gray-50);
    padding-bottom: 1rem;
  }

  .template-thumbnail-text > div {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }

  .template-name {
    color: var(
      --spectrum-heading-xs-text-color,
      var(--spectrum-alias-heading-text-color)
    );
    font-size: 14px;
    font-weight: 600;
    margin-top: 0.75rem;
  }

  .template-description {
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
    font-weight: 400;
    margin-top: 0.5rem;
    margin-bottom: 0;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
  }

  .template-card {
    position: relative;
    display: flex;
    border-radius: var(--border-radius-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
    overflow: hidden;
    min-height: 220px;
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

  .template-card:hover:not(.loading) {
    background: var(--spectrum-alias-background-color-tertiary);
  }

  .template-card.disabled {
    opacity: 0.5;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 10;
  }

  .card-body {
    padding-left: 1.25rem;
    padding-top: 1.25rem;
  }
</style>
