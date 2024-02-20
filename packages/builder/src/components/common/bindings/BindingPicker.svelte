<script>
  import groupBy from "lodash/fp/groupBy"
  import { convertToJS, processStringSync } from "@budibase/string-templates"
  import { Input, Layout, ActionButton, Icon, Popover } from "@budibase/bbui"
  import { handlebarsCompletions } from "constants/completions"
  import formatHighlight from "json-format-highlight"

  export let addHelper
  export let addBinding
  export let bindings
  export let mode
  export let allowHelpers
  export let context = null

  let search = ""
  let popover
  let popoverAnchor
  let hoverTarget
  let helpers = handlebarsCompletions()
  let selectedCategory
  let hideTimeout

  $: bindingIcons = bindings?.reduce((acc, ele) => {
    if (ele.icon) {
      acc[ele.category] = acc[ele.category] || ele.icon
    }
    return acc
  }, {})
  $: categoryIcons = { ...bindingIcons, Helpers: "MagicWand" }
  $: categories = Object.entries(groupBy("category", bindings))
  $: categoryNames = getCategoryNames(categories)
  $: searchRgx = new RegExp(search, "ig")
  $: filteredCategories = categories
    .map(([name, categoryBindings]) => ({
      name,
      bindings: categoryBindings?.filter(binding => {
        return !search || binding.readableBinding.match(searchRgx)
      }),
    }))
    .filter(category => {
      return (
        category.bindings?.length > 0 &&
        (!selectedCategory ? true : selectedCategory === category.name)
      )
    })
  $: filteredHelpers = helpers?.filter(helper => {
    return (
      (!search ||
        helper.label.match(searchRgx) ||
        helper.description.match(searchRgx)) &&
      (mode.name !== "javascript" || helper.allowsJs)
    )
  })

  const getHelperExample = (helper, js) => {
    let example = helper.example || ""
    if (js) {
      example = convertToJS(example).split("\n")[0].split("= ")[1]
      if (example === "null;") {
        example = ""
      }
    }
    return example || ""
  }

  const getCategoryNames = categories => {
    let names = [...categories.map(cat => cat[0])]
    if (allowHelpers) {
      names.push("Helpers")
    }
    return names
  }

  const showBindingPopover = (binding, target) => {
    stopHidingPopover()
    popoverAnchor = target
    hoverTarget = {
      code: binding.valueHTML,
    }
    popover.show()
  }

  const showHelperPopover = (helper, target) => {
    stopHidingPopover()
    if (!helper.displayText && helper.description) {
      return
    }
    popoverAnchor = target
    hoverTarget = {
      description: helper.description,
      code: getHelperExample(helper, mode.name === "javascript"),
    }
    popover.show()
  }

  const hidePopover = () => {
    hideTimeout = setTimeout(() => {
      popover.hide()
      popoverAnchor = null
      hoverTarget = null
      hideTimeout = null
    }, 100)
  }

  const stopHidingPopover = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
  }
</script>

<Popover
  align="left-outside"
  bind:this={popover}
  anchor={popoverAnchor}
  minWidth={0}
  maxWidth={480}
  maxHeight={480}
  dismissible={false}
  on:mouseenter={stopHidingPopover}
  on:mouseleave={hidePopover}
>
  <div class="helper">
    <Layout gap="S">
      {#if hoverTarget.description}
        <div>
          <!-- eslint-disable-next-line svelte/no-at-html-tags-->
          {@html hoverTarget.description}
        </div>
      {/if}
      {#if hoverTarget.code}
        <!-- eslint-disable-next-line svelte/no-at-html-tags-->
        <pre>{@html hoverTarget.code}</pre>
      {/if}
    </Layout>
  </div>
</Popover>

<Layout noPadding gap="S">
  {#if selectedCategory}
    <div class="sub-section-back">
      <ActionButton
        secondary
        icon={"ArrowLeft"}
        on:click={() => {
          selectedCategory = null
        }}
      >
        Back
      </ActionButton>
    </div>
  {/if}

  {#if !selectedCategory}
    <div class="search">
      <span class="search-input">
        <Input
          placeholder={"Search for bindings"}
          autocomplete="off"
          bind:value={search}
        />
      </span>

      <span
        class="search-input-icon"
        on:click={() => {
          search = null
        }}
        class:searching={search}
      >
        <Icon name={search ? "Close" : "Search"} />
      </span>
    </div>
  {/if}

  {#if !selectedCategory && !search}
    <ul class="category-list">
      {#each categoryNames as categoryName}
        <li
          on:click={() => {
            selectedCategory = categoryName
          }}
        >
          <Icon name={categoryIcons[categoryName]} />
          <span class="category-name">{categoryName} </span>
          <span class="category-chevron"><Icon name="ChevronRight" /></span>
        </li>
      {/each}
    </ul>
  {/if}

  {#if selectedCategory || search}
    {#each filteredCategories as category}
      {#if category.bindings?.length}
        <div class="sub-section">
          <div class="cat-heading">
            <Icon name={categoryIcons[category.name]} />{category.name}
          </div>
          <ul>
            {#each category.bindings as binding}
              <li
                class="binding"
                on:mouseenter={e => showBindingPopover(binding, e.target)}
                on:mouseleave={hidePopover}
                on:click={() => addBinding(binding)}
              >
                <span class="binding__label">
                  {#if binding.display?.name}
                    {binding.display.name}
                  {:else if binding.fieldSchema?.name}
                    {binding.fieldSchema?.name}
                  {:else}
                    {binding.readableBinding}
                  {/if}
                </span>
                {#if binding.display?.type || binding.fieldSchema?.type}
                  <span class="binding__typeWrap">
                    <span class="binding__type">
                      {binding.display?.type || binding.fieldSchema?.type}
                    </span>
                  </span>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/each}

    {#if selectedCategory === "Helpers" || search}
      {#if filteredHelpers?.length}
        <div class="sub-section">
          <div class="cat-heading">Helpers</div>
          <ul class="helpers">
            {#each filteredHelpers as helper}
              <li
                class="binding"
                on:mouseenter={e => showHelperPopover(helper, e.target)}
                on:mouseleave={hidePopover}
                on:click={() => addHelper(helper, mode.name === "javascript")}
              >
                <span class="binding__label">{helper.displayText}</span>
                <span class="binding__typeWrap">
                  <span class="binding__type">function</span>
                </span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/if}
  {/if}
</Layout>

<style>
  .search :global(input) {
    border: none;
    border-radius: 0;
    background: none;
    padding: 0;
  }

  .search {
    padding: var(--spacing-m) var(--spacing-l);
    display: flex;
    align-items: center;
    border-top: 0;
    border-bottom: var(--border-light);
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
    margin-right: 1px;
    position: sticky;
    top: 0;
    background-color: var(--background);
    z-index: 2;
  }

  .search-input {
    flex: 1;
  }

  .search-input-icon.searching {
    cursor: pointer;
  }

  ul.category-list {
    padding: 0 var(--spacing-l);
    padding-bottom: var(--spacing-l);
  }
  .sub-section {
    padding: var(--spacing-l);
    padding-top: 0;
  }
  .sub-section-back {
    padding: var(--spacing-l);
    padding-top: var(--spacing-xl);
    padding-bottom: 0;
  }
  .cat-heading {
    margin-bottom: var(--spacing-l);
  }
  ul.helpers li * {
    pointer-events: none;
  }
  ul.category-list li {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }
  ul.category-list .category-name {
    font-weight: 600;
    text-transform: capitalize;
  }
  ul.category-list .category-chevron {
    flex: 1;
    text-align: right;
  }
  ul.category-list .category-chevron :global(div.icon),
  .cat-heading :global(div.icon) {
    display: inline-block;
  }
  li.binding {
    display: flex;
    align-items: center;
  }
  li.binding .binding__typeWrap {
    flex: 1;
    text-align: right;
    text-transform: capitalize;
  }

  :global(.drawer-actions) {
    display: flex;
    gap: var(--spacing-m);
  }

  .cat-heading {
    font-size: var(--font-size-s);
    font-weight: 600;
    text-transform: uppercase;
    color: var(--spectrum-global-color-gray-600);
  }

  .cat-heading {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    font-size: var(--font-size-s);
    padding: var(--spacing-m);
    border-radius: 4px;
    background-color: var(--spectrum-global-color-gray-200);
    transition: background-color 130ms ease-in-out, color 130ms ease-in-out,
      border-color 130ms ease-in-out;
    word-wrap: break-word;
  }
  li:not(:last-of-type) {
    margin-bottom: var(--spacing-s);
  }
  li :global(*) {
    transition: color 130ms ease-in-out;
  }
  li:hover {
    color: var(--spectrum-global-color-gray-900);
    background-color: var(--spectrum-global-color-gray-50);
    cursor: pointer;
  }

  .binding__label {
    font-weight: 600;
    text-transform: capitalize;
  }

  .binding__type {
    font-family: var(--font-mono);
    background-color: var(--spectrum-global-color-gray-200);
    border-radius: var(--border-radius-s);
    padding: 2px 4px;
    margin-left: 2px;
    font-weight: 600;
  }

  .helper pre {
    padding: 0;
    margin: 0;
    font-size: 12px;
    white-space: pre;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .helper pre :global(span) {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
  .helper :global(p) {
    padding: 0;
    margin: 0;
  }
</style>
