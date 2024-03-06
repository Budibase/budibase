<script>
  import "@spectrum-css/card/dist/index-vars.css"
  import { getContext } from "svelte"
  import { Button } from "@budibase/bbui"

  export let title
  export let subtitle
  export let description
  export let imageURL
  export let linkURL
  export let linkPeek
  export let horizontal
  export let showButton
  export let buttonText
  export let buttonOnClick

  const { styleable, routeStore } = getContext("sdk")
  const component = getContext("component")

  const handleLink = e => {
    if (!linkURL) {
      return false
    }
    e.preventDefault()
    e.stopPropagation()
    routeStore.actions.navigate(linkURL, linkPeek)
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
  use:styleable={$component.styles}
  class="spectrum-Card"
  tabindex="0"
  role="figure"
  class:horizontal
  class:clickable={buttonOnClick && !showButton}
  on:click={showButton ? null : buttonOnClick}
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
          on:click={handleLink}
          class:link={linkURL}
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
    {#if description}
      <div class="spectrum-Card-footer">
        {description}
      </div>
    {/if}
    {#if showButton}
      <div class="spectrum-Card-footer button-container">
        <Button on:click={buttonOnClick} secondary>
          {buttonText || "Click me"}
        </Button>
      </div>
    {/if}
  </div>
</div>

<style>
  .spectrum-Card {
    width: 300px;
    border-color: var(--spectrum-global-color-gray-300) !important;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    transition: border-color 130ms ease-out;
  }
  .spectrum-Card.clickable:hover {
    cursor: pointer;
    border-color: var(--spectrum-global-color-gray-500) !important;
  }
  .spectrum-Card.horizontal {
    flex-direction: row;
    width: 420px;
  }
  .spectrum-Card-container {
    padding: var(--spectrum-global-dimension-size-50) 0;
  }
  .spectrum-Card-title.link {
    transition: color 130ms ease-out;
  }
  .spectrum-Card-title.link:hover {
    cursor: pointer;
    color: var(--spectrum-link-primary-m-text-color-hover);
  }
  .spectrum-Card-subtitle {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .spectrum-Card-footer {
    word-wrap: break-word;
    white-space: pre-wrap;
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
    padding-bottom: 0;
    margin-top: -8px;
    margin-bottom: var(
      --spectrum-card-body-padding-bottom,
      var(--spectrum-global-dimension-size-300)
    );
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
  }

  .button-container {
    margin-bottom: var(--spectrum-global-dimension-size-300);
  }
</style>
