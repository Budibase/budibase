<script>
  import { getContext } from "svelte"

  const { styleable, linkable } = getContext("sdk")
  const component = getContext("component")

  export let imageUrl = ""
  export let heading = ""
  export let subheading = ""
  export let destinationUrl = "/"

  $: showImage = !!imageUrl
</script>

<div class="container" use:styleable={$component.styles}>
  <a use:linkable href={destinationUrl}>
    <div class="stackedlist">
      {#if showImage}
        <div class="image-block">
          <img class="image" src={imageUrl} alt="" />
        </div>
      {/if}
      <div class="content">
        <div class="heading">{heading}</div>
        <div class="subheading">{subheading}</div>
      </div>
    </div>
  </a>
</div>

<style>
  a {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }
  .container {
    padding: 1rem 1.5rem;
    min-height: 3rem;
    display: block;
    align-items: flex-start;
  }

  .stackedlist {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    max-width: 100%;
  }

  .subheading {
    opacity: 0.6;
    white-space: pre-wrap;
  }

  .content {
    min-width: 0;
    max-width: 100%;
    flex: 1 1 auto;
  }

  .heading {
    font-weight: 600;
    white-space: pre-wrap;
  }

  .image-block {
    display: flex;
    flex: 0 0 auto;
    margin-right: 1.5rem;
    color: inherit;
    text-decoration: none;
  }

  .image {
    display: block;
    overflow: hidden;
    width: 3rem;
    max-width: 100%;
    -webkit-user-select: none;
    user-select: none;
    border-radius: 99px;
  }
</style>
