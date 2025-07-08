<script>
  import { createEventDispatcher } from "svelte"
  import active from "svelte-spa-router/active"
  import { Icon } from "@budibase/bbui"
  import { builderStore, screenStore } from "@/stores"

  export let type
  export let url
  export let text
  export let subLinks
  export let icon
  export let internalLink
  export let customStyles
  export let leftNav = false
  export let mobile = false
  export let navStateStore

  const dispatch = createEventDispatcher()

  let renderKey

  $: isBuilderActive = testUrl => {
    return (
      $builderStore.inBuilder &&
      testUrl &&
      testUrl === $screenStore.activeScreen?.routing?.route
    )
  }
  $: builderActive = isBuilderActive(url)
  $: containsActiveLink = (subLinks || []).some(x => isBuilderActive(x.url))
  $: expanded = !!$navStateStore[text] || containsActiveLink
  $: renderLeftNav = leftNav || mobile
  $: caret = !renderLeftNav || expanded ? "caret-down" : "caret-right"

  const onClickLink = () => {
    dispatch("clickLink")
    renderKey = Math.random()
  }

  const onClickDropdown = () => {
    if (!renderLeftNav) {
      return
    }
    navStateStore.update(state => ({
      ...state,
      [text]: !state[text],
    }))
  }
</script>

{#if !type || type === "link"}
  <div class="link">
    {#if internalLink}
      <!--
        It's stupid that we have to add class:active={false} here, but if we don't
        then svelte will strip out the CSS selector and active links won't be
        styled
      -->
      <a
        href="#{url}"
        on:click={onClickLink}
        use:active={url}
        class:builderActive
        style={customStyles}
      >
        {#if icon}
          <Icon name={icon} color="var(--navTextColor)" size="S" />
        {/if}
        {text}
      </a>
    {:else}
      <a href={url} on:click={onClickLink}>
        {#if icon}
          <Icon name={icon} color="var(--navTextColor)" size="S" />
        {/if}
        {text}
      </a>
    {/if}
  </div>
{:else}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  {#key renderKey}
    <div class="dropdown" class:left={renderLeftNav} class:expanded>
      <div class="text" on:click={onClickDropdown}>
        {#if icon}
          <Icon name={icon} color="var(--navTextColor)" size="S" />
        {/if}
        <span>{text}</span>
        <Icon name={caret} color="var(--navTextColor)" size="S" />
      </div>
      <div class="sublinks-wrapper">
        <div class="sublinks">
          {#each subLinks || [] as subLink}
            {#if subLink.internalLink}
              <a
                href="#{subLink.url}"
                on:click={onClickLink}
                use:active={subLink.url}
                class:active={false}
                class:builderActive={isBuilderActive(subLink.url)}
                class="sublink"
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
  {/key}
{/if}

<style>
  /* Generic styles */
  a,
  .dropdown .text {
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-s);
  }
  a,
  .text span {
    opacity: 0.75;
    color: var(--navTextColor);
    font-size: var(--spectrum-global-dimension-font-size-150);
    transition: opacity 130ms ease-out;
    user-select: none;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  a.active:not(.sublink),
  a.builderActive:not(.sublink),
  .dropdown.left a.sublink.active,
  .dropdown.left a.sublink.builderActive {
    background: rgba(0, 0, 0, 0.15);
    opacity: 1;
  }
  a:hover,
  .text:hover span {
    cursor: pointer;
    opacity: 1;
  }

  /* Top dropdowns */
  .dropdown {
    position: relative;
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

  /* Use normal theme colors for links when using a top nav */
  .dropdown:not(.left) .sublinks a {
    color: var(--spectrum-alias-text-color);
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
</style>
