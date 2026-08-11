<script>
  import { createEventDispatcher } from "svelte"
  import active from "svelte-spa-router/active"
  import { Icon, AbsTooltip, TooltipPosition } from "@budibase/bbui"
  import { builderStore } from "@/stores"
  import { screenStore } from "@/stores/screens"

  export let navItem
  export let depth = 0
  export let navKey = ""
  export let leftNav = false
  export let mobile = false
  export let navStateStore
  export let collapsed = false

  const dispatch = createEventDispatcher()

  let renderKey
  const iconColor = "var(--navLinkIconColor, var(--navTextColor))"

  $: type = navItem?.type
  $: text = navItem?.text
  $: url = navItem?.url
  $: icon = navItem?.icon
  $: internalLink = navItem?.internalLink
  $: customStyles = navItem?._styles?.custom
  $: subLinks = navItem?.subLinks || []
  $: isGroup = type === "sublinks"
  // A group may optionally also be a link (its header navigates).
  $: hasUrl = !!url

  let hovered = false

  $: renderLeftNav = leftNav || mobile
  $: isTopLevel = depth === 0
  // Only a top level group in a top nav opens as a floating dropdown on hover.
  // Everything else (left nav, and all nested groups) expands inline in place.
  $: floating = isGroup && isTopLevel && !renderLeftNav
  // Headers on the nav bar itself (any top level, and every level of a left
  // nav) use the nav text colour; nested headers inside a light flyout don't.
  $: headerIconColor = renderLeftNav || isTopLevel ? iconColor : undefined

  $: isBuilderActive = testUrl => {
    return (
      $builderStore.inBuilder &&
      testUrl &&
      testUrl === $screenStore.activeScreen?.routing?.route
    )
  }
  $: builderActive = isBuilderActive(url)

  // isActive is passed in so this stays a tracked dependency of `expanded`
  // and groups auto-expand when the active screen changes in the builder.
  const containsActiveLink = (links, isActive) =>
    (links || []).some(
      l => isActive(l.url) || containsActiveLink(l.subLinks, isActive)
    )
  $: expanded = floating
    ? false
    : !!$navStateStore[navKey] || containsActiveLink(subLinks, isBuilderActive)
  // Left / mobile groups toggle on click, so the caret follows that state.
  // Top nav groups reveal on hover: caret points right until hovered open.
  $: caret = (renderLeftNav ? expanded : hovered) ? "caret-down" : "caret-right"
  $: collapsedText = getShortText(text)

  const getShortText = text => {
    if (!text) {
      return ""
    }
    const words = text.trim().split(/\s+/)
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase()
    } else {
      return words
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("")
    }
  }

  // Used for own link clicks AND forwarded descendant clicks: bumping
  // renderKey re-renders the {#key} block so a hover-based floating flyout
  // closes after navigating. The hovered flag must reset with it, or the
  // caret of the remounted (closed) flyout would keep pointing down.
  const onClickLink = () => {
    dispatch("clickLink")
    renderKey = Math.random()
    hovered = false
  }

  const toggle = () => {
    navStateStore.update(state => ({
      ...state,
      [navKey]: !state[navKey],
    }))
  }

  // The top nav is entirely hover-driven, so clicks there never toggle. In the
  // left / mobile nav, clicking a group header toggles it - unless it is a link,
  // in which case the label navigates and the caret handles the toggle.
  const onHeaderClick = () => {
    if (!renderLeftNav || hasUrl) {
      return
    }
    toggle()
  }

  const onCaretClick = () => {
    if (renderLeftNav) {
      toggle()
    }
  }

  const onCaretKeydown = e => {
    if (renderLeftNav && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault()
      toggle()
    }
  }
</script>

{#if !isGroup}
  {#if isTopLevel}
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
          class:collapsed
          style={customStyles}
        >
          {#if collapsed}
            <AbsTooltip {text} position={TooltipPosition.Right}>
              <span class="nav-item-letter">
                {#if icon}
                  <Icon name={icon} color={iconColor} size="XS" />
                {:else}
                  {collapsedText}
                {/if}
              </span>
            </AbsTooltip>
          {:else}
            {#if icon}
              <Icon name={icon} color={iconColor} size="S" />
            {/if}
            {text}
          {/if}
        </a>
      {:else}
        <a
          href={url}
          on:click={onClickLink}
          class:collapsed
          style={customStyles}
        >
          {#if collapsed}
            <AbsTooltip {text} position={TooltipPosition.Right}>
              <span class="nav-item-letter">
                {#if icon}
                  <Icon name={icon} color={iconColor} size="L" />
                {:else}
                  {collapsedText}
                {/if}
              </span>
            </AbsTooltip>
          {:else}
            {#if icon}
              <Icon name={icon} color={iconColor} size="S" />
            {/if}
            {text}
          {/if}
        </a>
      {/if}
    </div>
  {:else}
    <!-- nested leaf (sub link) -->
    {#if internalLink}
      <a
        href="#{url}"
        on:click={onClickLink}
        use:active={url}
        class:active={false}
        class:builderActive={isBuilderActive(url)}
        class="sublink"
        style="--depth:{depth};{customStyles || ''}"
      >
        {#if icon}
          <Icon name={icon} size="S" />
        {/if}
        {text}
      </a>
    {:else}
      <a
        href={url}
        on:click={onClickLink}
        class="sublink"
        style="--depth:{depth};{customStyles || ''}"
      >
        {#if icon}
          <Icon name={icon} size="S" />
        {/if}
        {text}
      </a>
    {/if}
  {/if}
{:else}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  {#key renderKey}
    <div
      class="dropdown"
      class:left={renderLeftNav}
      class:nested={!isTopLevel}
      class:floating
      class:expanded
      style="--depth:{depth}"
      on:mouseenter={() => (hovered = true)}
      on:mouseleave={() => (hovered = false)}
    >
      <!-- use:active marks the whole header row when its link is the current
           route, so icon and caret highlight along with the label. The
           class:active={false} keeps the compiler from pruning the selector. -->
      <div
        class="text"
        class:collapsed
        class:active={false}
        class:builderActive={hasUrl && builderActive}
        use:active={hasUrl && internalLink ? url : "/__no_match__"}
        style={customStyles}
        on:click={onHeaderClick}
      >
        {#if collapsed && isTopLevel}
          <AbsTooltip {text} position={TooltipPosition.Right}>
            {#if icon}
              <Icon name={icon} color={iconColor} size="S" />
            {:else}
              <span class="nav-item-letter">{collapsedText}</span>
            {/if}
          </AbsTooltip>
        {:else}
          {#if icon}
            <Icon name={icon} color={headerIconColor} size="S" />
          {/if}
          {#if hasUrl && internalLink}
            <a
              class="grouplink"
              href="#{url}"
              use:active={url}
              class:builderActive
              on:click={onClickLink}
            >
              {text}
            </a>
          {:else if hasUrl}
            <a class="grouplink" href={url} on:click={onClickLink}>{text}</a>
          {:else}
            <span class="grouplabel">{text}</span>
          {/if}
          <!-- Focusable in every nav so keyboard users can reach a group:
               clicking / pressing it toggles an inline tree, while a floating
               top nav flyout opens on focus via :focus-within. -->
          <span
            class="caret"
            role="button"
            tabindex="0"
            aria-expanded={renderLeftNav ? expanded : undefined}
            aria-haspopup={floating ? "true" : undefined}
            aria-label={`${renderLeftNav ? "Toggle" : "Show"} ${text}`}
            on:click|stopPropagation={onCaretClick}
            on:keydown={onCaretKeydown}
          >
            <Icon name={caret} color={headerIconColor} size="S" />
          </span>
        {/if}
      </div>
      <div class="sublinks-wrapper">
        <div class="sublinks">
          {#each subLinks || [] as child, i}
            <svelte:self
              navItem={child}
              depth={depth + 1}
              navKey={`${navKey}/${child.id || i}`}
              {leftNav}
              {mobile}
              {navStateStore}
              {collapsed}
              on:clickLink={onClickLink}
            />
          {/each}
        </div>
      </div>
    </div>
  {/key}
{/if}

<style>
  /* Generic row styling (links + group headers) */
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
  .text span,
  .text :global(.grouplabel),
  .text :global(.grouplink) {
    opacity: 0.75;
    color: var(--navTextColor);
    font-size: var(--spectrum-global-dimension-font-size-150);
    transition:
      opacity 130ms ease-out,
      color 130ms ease-out,
      background-color 130ms ease-out;
    user-select: none;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .grouplabel,
  .grouplink {
    flex: 1 1 auto;
    padding: 0;
  }
  .caret {
    display: flex;
    align-items: center;
    margin-left: auto;
    cursor: pointer;
  }
  /* Group header icons and carets sit outside the label elements, so dim them
     to the label's resting opacity and restore them together on hover/active -
     matching plain links, where the icon lives inside the dimmed anchor. */
  .dropdown .text > :global(i),
  .dropdown .text > .caret {
    opacity: 0.75;
    transition: opacity 130ms ease-out;
  }
  .dropdown .text:hover > :global(i),
  .dropdown .text:hover > .caret,
  .dropdown .text.active > :global(i),
  .dropdown .text.active > .caret,
  .dropdown .text.builderActive > :global(i),
  .dropdown .text.builderActive > .caret {
    opacity: 1;
  }
  a.active:not(.sublink),
  a.builderActive:not(.sublink),
  :global(.dropdown.left) a.sublink.active,
  :global(.dropdown.left) a.sublink.builderActive {
    background: var(--navLinkActiveBackground, rgba(0, 0, 0, 0.15));
    color: var(--navLinkActiveTextColor, var(--navTextColor));
    --navLinkIconColor: var(
      --navLinkActiveIconColor,
      var(--navLinkActiveTextColor, var(--navTextColor))
    );
    opacity: 1;
  }
  :global(.dropdown.floating) a.sublink.active,
  :global(.dropdown.floating) a.sublink.builderActive {
    background: var(--navLinkActiveBackground, rgba(0, 0, 0, 0.15));
    color: var(--navLinkActiveTextColor, var(--spectrum-alias-text-color));
    --navLinkIconColor: var(
      --navLinkActiveIconColor,
      var(--navLinkActiveTextColor, var(--spectrum-alias-text-color))
    );
    opacity: 1;
  }
  a:hover,
  .text:hover,
  .text:hover span,
  .text:hover :global(.grouplabel),
  .text:hover :global(.grouplink) {
    cursor: pointer;
    color: var(--navLinkHoverTextColor, var(--navTextColor));
    --navLinkIconColor: var(
      --navLinkHoverIconColor,
      var(--navLinkHoverTextColor, var(--navTextColor))
    );
    opacity: 1;
  }
  a:hover,
  .text:hover {
    background-color: var(--navLinkHoverBackground, transparent);
  }
  a:hover.collapsed,
  .text:hover.collapsed {
    background-color: var(--navLinkHoverBackground, rgba(255, 255, 255, 0.25));
  }

  .nav-item-letter {
    font-weight: 600;
    font-size: var(--spectrum-global-dimension-font-size-100);
    color: var(--navTextColor);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
  }

  .dropdown {
    position: relative;
  }

  /* Hidden by default; revealed either by hover (floating) or expand (inline) */
  .sublinks-wrapper {
    display: none;
  }
  .dropdown.floating > .sublinks-wrapper {
    position: absolute;
    top: 100%;
    padding-top: var(--spacing-s);
    z-index: 2;
  }
  /* Hover opens it with the mouse; focus-within does the same for keyboard
     users, who reach the header and its links by tabbing. */
  .dropdown.floating:hover > .sublinks-wrapper,
  .dropdown.floating:focus-within > .sublinks-wrapper {
    display: block;
  }
  .dropdown:not(.floating) > .sublinks-wrapper {
    position: static;
  }
  .dropdown:not(.floating).expanded > .sublinks-wrapper {
    display: block;
  }

  .sublinks {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;
    overflow: visible;
  }
  /* Only the floating top-level dropdown is a styled card. Nested groups
     render their items inline inside that one card (no cascading menus). */
  .dropdown.floating > .sublinks-wrapper > .sublinks {
    background: var(--spectrum-global-color-gray-50);
    border-radius: 6px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    min-width: 180px;
    max-width: 280px;
    padding: 8px 0;
  }
  .sublinks :global(a),
  .sublinks :global(.text) {
    font-weight: 400;
    white-space: nowrap;
    width: 100%;
  }
  /* Indent rows by their depth so nesting reads as a tree. Depth 1 gets no
     extra indent, matching the previous single level menus exactly. */
  .sublinks :global(a.sublink),
  .sublinks :global(.dropdown > .text) {
    padding: 6px var(--spacing-l);
    padding-left: calc(var(--spacing-l) + (var(--depth, 1) - 1) * 12px);
  }
  /* The flyout PANEL has a light background, so its rows use theme text colour.
     Scope to .sublinks so the top-level header on the nav bar keeps navTextColor. */
  .dropdown.floating .sublinks :global(a),
  .dropdown.floating .sublinks :global(.text),
  .dropdown.floating .sublinks :global(.text span),
  .dropdown.floating .sublinks :global(.grouplabel),
  .dropdown.floating .sublinks :global(.grouplink) {
    color: var(--spectrum-alias-text-color);
  }
  /* Inside a top nav flyout, hovering a nested group reveals its items inline
     (one dropdown, no click needed). */
  .dropdown.floating :global(.dropdown.nested:hover > .sublinks-wrapper),
  .dropdown.floating
    :global(.dropdown.nested:focus-within > .sublinks-wrapper) {
    display: block;
  }

  /* Left / mobile nav: the whole tree lives inline in the column */
  .dropdown.left .sublinks {
    background: none;
    border: none;
    border-radius: 0;
    min-width: 0;
    max-width: none;
    padding: 0;
    width: 100%;
    /* Matches the 4px gap the flat left nav had between rows */
    gap: var(--spacing-xs);
    padding-top: var(--spacing-xs);
  }
  /* When a group header IS the active link, highlight the whole header row
     (icon and caret included), not just the anchor text - matching how plain
     links highlight, where the icon lives inside the anchor. */
  .dropdown > .text.active,
  .dropdown > .text.builderActive {
    background: var(--navLinkActiveBackground, rgba(0, 0, 0, 0.15));
    --navLinkIconColor: var(
      --navLinkActiveIconColor,
      var(--navLinkActiveTextColor, var(--navTextColor))
    );
  }
  /* Bigger touch / focus target for the only expand control in left nav */
  .dropdown.left .caret {
    padding: 4px;
    margin: -4px -4px -4px auto;
  }
  .caret:focus-visible {
    outline: 2px solid var(--navTextColor);
    outline-offset: 1px;
    border-radius: 4px;
  }
  .dropdown.left > .text {
    padding-left: calc(var(--spacing-s) + var(--depth, 0) * 12px);
  }
</style>
