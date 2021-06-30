<script>
  import "@spectrum-css/card/dist/index-vars.css"
  import { getContext } from "svelte"

  export let title
  export let subtitle
  export let footer
  export let imageURL
  export let quiet

  const { styleable } = getContext("sdk")
  const component = getContext("component")
</script>

<div
  use:styleable={$component.styles}
  class="spectrum-Card"
  class:spectrum-Card--quiet={quiet}
  tabindex="0"
  role="figure"
>
  {#if imageURL}
    <div
      class="spectrum-Card-coverPhoto"
      style="background-image: url({imageURL})"
    />
  {/if}
  <div class="spectrum-Card-body">
    <div class="spectrum-Card-header">
      <div
        class="spectrum-Card-title spectrum-Heading spectrum-Heading--sizeXS"
      >
        {title || "Card Title"}
      </div>
    </div>
    {#if subtitle}
      <div class="spectrum-Card-content">
        <div
          class="spectrum-Card-subtitle spectrum-Detail spectrum-Detail--sizeS"
        >
          {subtitle}
        </div>
      </div>
    {/if}
  </div>
  {#if footer}
    <div class="spectrum-Card-footer">{footer}</div>
  {/if}
</div>

<style>
  .spectrum-Card {
  }
</style>
