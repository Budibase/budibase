<script>
  import { createEventDispatcher, getContext } from "svelte"
  import active from "svelte-spa-router/active"
  import { Icon } from "@budibase/bbui"

  export let type
  export let url
  export let text
  export let subLinks
  export let internalLink
  export let leftNav = false
  export let navStateStore

  const dispatch = createEventDispatcher()
  const sdk = getContext("sdk")
  const { linkable } = sdk

  $: expanded = !!$navStateStore[text]
  $: icon = !leftNav || expanded ? "ChevronDown" : "ChevronRight"

  const onClickLink = () => {
    dispatch("clickLink")
  }

  const onClickDropdown = () => {
    if (!leftNav) {
      return
    }
    navStateStore.update(state => ({
      ...state,
      [text]: !state[text],
    }))
  }
</script>

{#if !type || type === "link"}
  {#if internalLink}
    <!--
      It's stupid that we have to add class:active={false} here, but if we don't
      then svelte will strip out the CSS selector and active links won't be
      styled
    -->
    <a
      href={url}
      on:click={onClickLink}
      use:active={url}
      use:linkable
      class:active={false}
    >
      {text}
    </a>
  {:else}
    <a href={url} on:click={onClickLink}>
      {text}
    </a>
  {/if}
{:else}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="dropdown" class:left={leftNav} class:expanded>
    <div class="text" on:click={onClickDropdown}>
      {text}
      <Icon name={icon} />
    </div>
    <div class="sublinks-wrapper">
      <div class="sublinks">
        {#each subLinks || [] as subLink}
          {#if subLink.internalLink}
            <a
              href={subLink.url}
              on:click={onClickLink}
              use:active={subLink.url}
              use:linkable
            >
              {subLink.text}
            </a>
          {:else}
            <a href={subLink.url} on:click={onClickLink}>
              {subLink.text}
            </a>
          {/if}
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Generic styles */
  a,
  .text {
    opacity: 0.75;
    color: var(--navTextColor);
    font-size: var(--spectrum-global-dimension-font-size-200);
    transition: opacity 130ms ease-out;
    font-weight: 600;
  }
  a.active {
    opacity: 1;
  }
  a:hover,
  .dropdown:not(.left.expanded):hover .text,
  .text:hover {
    cursor: pointer;
    opacity: 1;
  }

  /* Top dropdowns */
  .dropdown {
    position: relative;
  }
  .text {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
    user-select: none;
  }
  .sublinks-wrapper {
    position: absolute;
    top: 100%;
    display: none;
    padding-top: var(--spacing-s);
  }
  .dropdown:hover .sublinks-wrapper {
    display: block;
  }
  .sublinks {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: flex-start;
    background: var(--spectrum-global-color-gray-50);
    border-radius: 6px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    min-width: 150px;
    max-width: 250px;
    padding: 10px 0;
    overflow: hidden;
  }
  .sublinks a {
    padding: 6px var(--spacing-l);
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  /* Left dropdowns */
  .dropdown.left .sublinks-wrapper {
    display: none;
  }
  .dropdown.left,
  .dropdown.left.expanded .sublinks-wrapper,
  .dropdown.dropdown.left.expanded .sublinks {
    display: contents;
  }
  .dropdown.left a {
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
