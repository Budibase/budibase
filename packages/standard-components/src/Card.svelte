<script>
  import { cssVars, createClasses } from "./cssVars"

  export const className = ""
  export let imageUrl = ""
  export let heading = ""
  export let description = ""
  export let linkText = ""
  export let linkUrl
  export let color
  export let linkHoverColor
  export let imageHeight
  export let cardWidth

  $: cssVariables = {
    color,
    linkHoverColor,
    imageHeight,
    cardWidth,
  }

  $: showImage = !!imageUrl
</script>

<div use:cssVars={cssVariables} class="container">
  {#if showImage}
    <img class="image" src={imageUrl} alt="" />
  {/if}
  <div class="content">
    <h2 class="heading">{heading}</h2>
    <h4 class="text">{description}</h4>
    <a href={linkUrl}>{linkText}</a>
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
  }

  .text {
    font-size: 1rem;
    margin: 0;
    font-weight: 400;
    line-height: 1.5rem;
  }

  a {
    margin: 0.5rem 0;
    text-decoration: none;
    color: var(--color);
    font-weight: 600;
  }

  a:hover {
    color: var(--linkHoverColor);
  }
</style>
