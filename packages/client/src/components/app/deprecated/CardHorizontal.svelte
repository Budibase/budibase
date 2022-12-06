<script>
  import { getContext } from "svelte"

  const { styleable, linkable } = getContext("sdk")
  const component = getContext("component")

  export const className = ""
  export let imageUrl = ""
  export let heading = ""
  export let description = ""
  export let subtext = ""
  export let linkText = ""
  export let linkUrl
  export let linkColor
  export let linkHoverColor
  export let cardWidth
  export let imageWidth
  export let imageHeight

  $: showImage = !!imageUrl
</script>

<div
  use:styleable={$component.styles}
  class="container"
  style="--cardWidth: {cardWidth}"
>
  {#if showImage}
    <img
      style="--imageWidth: {imageWidth}; --imageHeight: {imageHeight}"
      class="image"
      src={imageUrl}
      alt=""
    />
  {/if}
  <div class="content">
    <main>
      <h2 class="heading">{heading}</h2>
      <p class="text">{description}</p>
    </main>
    <footer>
      <p class="subtext">{subtext}</p>
      <a
        use:linkable
        style="--linkColor: {linkColor}; --linkHoverColor: {linkHoverColor}"
        href={linkUrl || "/"}>{linkText}</a
      >
    </footer>
  </div>
</div>

<style>
  .container {
    height: 100%;
    max-width: var(--cardWidth);
    display: flex !important;
    text-align: left;
  }

  .image {
    width: var(--imageWidth);
    height: var(--imageHeight);
    vertical-align: middle;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    padding: 0.85rem 1.5rem;
  }

  .heading {
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
    white-space: pre-wrap;
  }

  .text {
    font-size: 0.85rem;
    margin: 0.5rem 0 0 0;
    font-weight: 400;
    line-height: 1.25rem;
    white-space: pre-wrap;
  }

  footer {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .subtext {
    font-size: 0.85rem;
    margin: 0;
    font-weight: 400;
    color: #757575;
    white-space: pre-wrap;
  }

  a {
    margin: 0.5rem 0 0 0;
    text-decoration: none;
    color: var(--linkColor);
    font-weight: 600;
    font-size: 0.85rem;
    white-space: pre-wrap;
  }

  a:hover {
    color: var(--linkHoverColor);
  }
</style>
