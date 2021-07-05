<script>
  import "@spectrum-css/card/dist/index-vars.css"
  import { getContext } from "svelte"

  export let title
  export let subtitle
  export let description
  export let imageURL
  export let linkURL
  export let horizontal

  const { styleable, linkable } = getContext("sdk")
  const component = getContext("component")

  $: external = linkURL && !linkURL.startsWith("/")
</script>

<div
  use:styleable={$component.styles}
  class="spectrum-Card"
  tabindex="0"
  role="figure"
  class:horizontal
>
  {#if imageURL}
    <div
      class="spectrum-Card-coverPhoto"
      style="background-image: url({imageURL})"
    />
  {/if}
  <div class="spectrum-Card-container">
    <div class="spectrum-Card-body">
      <div class="spectrum-Card-header">
        <div
          class="spectrum-Card-title spectrum-Heading spectrum-Heading--sizeXS"
        >
          {#if linkURL}
            {#if external}
              <a href={linkURL}>{title || "Card Title"}</a>
            {:else}
              <a use:linkable href={linkURL}>{title || "Card Title"}</a>
            {/if}
          {:else}
            {title || "Card Title"}
          {/if}
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
    {#if description}
      <div class="spectrum-Card-footer">
        {description}
      </div>
    {/if}
  </div>
</div>

<style>
  .spectrum-Card {
    width: 240px;
    border-color: var(--spectrum-global-color-gray-300) !important;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .spectrum-Card.horizontal {
    flex-direction: row;
    width: 420px;
  }
  .spectrum-Card-title :global(a) {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
  }
  .spectrum-Card-subtitle {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .spectrum-Card-footer {
    word-wrap: anywhere;
    white-space: pre-wrap;
  }
  a {
    transition: color 130ms ease-in-out;
    color: var(--spectrum-alias-text-color);
  }
  a:hover {
    color: var(--spectrum-global-color-blue-600);
  }

  .horizontal .spectrum-Card-coverPhoto {
    flex: 0 0 160px;
    height: auto;
    border-bottom-left-radius: calc(
      var(--spectrum-alias-border-radius-regular) - 1px
    );
    border-top-right-radius: 0;
  }
  .horizontal .spectrum-Card-container {
    width: 0;
    flex: 1 1 auto;
  }
  .spectrum-Card-footer {
    border-top: none;
    padding-top: 0;
    margin-top: -8px;
  }
</style>
