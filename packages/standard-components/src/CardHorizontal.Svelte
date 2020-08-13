<script>
  import { cssVars, createClasses } from "./cssVars"

  export const className = ""
  export let imageUrl = ""
  export let heading = ""
  export let description = ""
  export let subtext = ""
  export let linkText = ""
  export let linkUrl
  export let color
  export let linkHoverColor
  export let cardWidth
  export let imageWidth
  export let imageHeight

  $: cssVariables = {
    color,
    linkHoverColor,
    imageWidth,
    cardWidth,
    imageHeight,
  }

  $: showImage = !!imageUrl
</script>

<div use:cssVars={cssVariables} class="container">
  {#if showImage}
    <img class="image" src={imageUrl} alt="" />
  {/if}
  <div class="content">
    <main>
      <h2 class="heading">{heading}</h2>
      <p class="text">{description}</p>
    </main>
    <footer>
      <p class="subtext">{subtext}</p>
      <a href={linkUrl}>{linkText}</a>
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
  }

  .text {
    font-size: 0.85rem;
    margin: 0.5rem 0 0 0;
    font-weight: 400;
    line-height: 1.25rem;
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
  }

  a {
    margin: 0.5rem 0 0 0;
    text-decoration: none;
    color: var(--color);
    font-weight: 600;
    font-size: 0.85rem;
    margin: 0;
  }

  a:hover {
    color: var(--linkHoverColor);
  }
</style>
