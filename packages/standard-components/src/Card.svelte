<script>
  import { getContext } from "svelte"

  const { styleable, linkable } = getContext("sdk")
  const component = getContext("component")

  export const className = ""
  export let imageUrl = ""
  export let heading = ""
  export let description = ""
  export let linkText = ""
  export let linkUrl
  export let linkColor
  export let linkHoverColor
  export let imageHeight
  export let cardWidth

  $: cardStyles = {
    ...$component.styles,
    normal: {
      ...$component.styles.normal,
      width: cardWidth,
    },
  }

  $: showImage = !!imageUrl
</script>

<div class="container" use:styleable={cardStyles}>
  {#if showImage}
    <img
      style="--imageHeight: {imageHeight}"
      class="image"
      src={imageUrl}
      alt=""
    />
  {/if}
  <div class="content">
    <h2 class="heading">{heading}</h2>
    <h4 class="text">{description}</h4>
    <a
      use:linkable
      style="--linkColor: {linkColor}; --linkHoverColor: {linkHoverColor}"
      href={linkUrl || "/"}
    >
      {linkText}
    </a>
  </div>
</div>

<style>
  .container {
    width: var(--cardWidth);
    overflow: hidden !important;
    height: auto;
  }

  .image {
    width: 100% !important;
    max-width: 100%;
    height: var(--imageHeight);
    vertical-align: middle;
  }

  .content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .heading {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
    white-space: pre-wrap;
  }

  .text {
    font-size: 1rem;
    margin: 0;
    font-weight: 400;
    line-height: 1.5rem;
    white-space: pre-wrap;
  }

  a {
    margin: 0.5rem 0;
    text-decoration: none;
    color: var(--linkColor);
    font-weight: 600;
    white-space: pre-wrap;
  }

  a:hover {
    color: var(--linkHoverColor);
  }
</style>
