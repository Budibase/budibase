<script lang="ts">
  import groupBy from "lodash/fp/groupBy"
  import { convertToJS } from "@budibase/string-templates"
  import { licensing } from "@/stores/portal"
  import {
    Input,
    Layout,
    Icon,
    Popover,
    Tags,
    Tag,
    Body,
    Button,
  } from "@budibase/bbui"
  import { handlebarsCompletions } from "@/constants/completions"
  import type { EnrichedBinding, Helper, Snippet } from "@budibase/types"
  import { BindingMode } from "@budibase/types"
  import { EditorModes } from "../CodeEditor"
  import CodeEditor from "../CodeEditor/CodeEditor.svelte"

  import SnippetDrawer from "./SnippetDrawer.svelte"
  import UpgradeButton from "@/pages/builder/portal/_components/UpgradeButton.svelte"

  export let addHelper: (_helper: Helper, _js?: boolean) => void
  export let addBinding: (_binding: EnrichedBinding) => void
  export let addSnippet: (_snippet: Snippet) => void
  export let bindings: EnrichedBinding[]
  export let snippets: Snippet[] | null
  export let mode: BindingMode
  export let allowHelpers: boolean
  export let allowSnippets: boolean
  export let context = null

  let search = ""
  let searching = false
  let popover: Popover
  let popoverAnchor: HTMLElement | undefined
  let hoverTarget: {
    type: "binding" | "helper" | "snippet"
    code: string
    description?: string
  } | null
  let helpers = handlebarsCompletions()
  let selectedCategory: string | null
  let hideTimeout: ReturnType<typeof setTimeout> | null
  let editableSnippet: Snippet | null
  let showSnippetDrawer = false

  $: enableSnippets = !$licensing.isFreePlan
  $: bindingIcons = bindings?.reduce<Record<string, string>>((acc, ele) => {
    if (ele.icon) {
      acc[ele.category] = acc[ele.category] || ele.icon
    }
    return acc
  }, {})
  $: categoryIcons = {
    ...bindingIcons,
    Helpers: "MagicWand",
    Snippets: "Code",
  } as Record<string, string>
  $: categories = Object.entries(groupBy("category", bindings))

  $: categoryNames = getCategoryNames(
    categories,
    allowSnippets && mode === BindingMode.JavaScript
  )
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
      (mode !== BindingMode.JavaScript || helper.allowsJs)
    )
  })

  $: filteredSnippets = getFilteredSnippets(
    enableSnippets,
    snippets || [],
    search
  )

  function onModeChange(_mode: BindingMode) {
    selectedCategory = null
  }
  $: onModeChange(mode)

  const getHelperExample = (helper: Helper, js: boolean) => {
    let example = helper.example || ""
    if (js) {
      example = convertToJS(example).split("\n")[0].split("= ")[1]
      if (example === "null;") {
        example = ""
      }
    }
    return example || ""
  }

  const getCategoryNames = (
    categories: [string, EnrichedBinding[]][],
    showSnippets: boolean
  ) => {
    const names = [...categories.map(cat => cat[0])]
    if (allowHelpers) {
      names.push("Helpers")
    }
    if (showSnippets) {
      names.push("Snippets")
    }
    return names
  }

  const showBindingPopover = (
    binding: EnrichedBinding,
    target: HTMLElement
  ) => {
    if (!context || !binding.value || binding.value === "") {
      return
    }
    stopHidingPopover()
    popoverAnchor = target
    hoverTarget = {
      type: "binding",
      code: binding.valueHTML,
    }
    popover.show()
  }

  const showHelperPopover = (helper: Helper, target: HTMLElement) => {
    stopHidingPopover()
    if (!helper.displayText && helper.description) {
      return
    }
    popoverAnchor = target
    hoverTarget = {
      type: "helper",
      description: helper.description,
      code: getHelperExample(helper, mode === BindingMode.JavaScript),
    }
    popover.show()
  }

  const hidePopover = () => {
    hideTimeout = setTimeout(() => {
      popover.hide()
      popoverAnchor = undefined
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

  const startSearching = async () => {
    searching = true
    search = ""
  }

  const stopSearching = (e: Event) => {
    e.stopPropagation()
    searching = false
    search = ""
  }

  const getFilteredSnippets = (
    enableSnippets: boolean,
    snippets: Snippet[],
    search: string
  ) => {
    if (!enableSnippets || !snippets.length) {
      return []
    }
    if (!search?.length) {
      return snippets
    }
    return snippets.filter(snippet =>
      snippet.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  const showSnippet = (snippet: Snippet, target: HTMLElement) => {
    stopHidingPopover()
    if (!snippet.code) {
      return
    }
    popoverAnchor = target
    hoverTarget = {
      type: "snippet",
      code: snippet.code,
    }

    popover.show()
  }

  const createSnippet = () => {
    editableSnippet = null
    showSnippetDrawer = true
  }

  const editSnippet = (e: Event, snippet: Snippet) => {
    e.preventDefault()
    e.stopPropagation()
    editableSnippet = snippet
    showSnippetDrawer = true
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
  {#if hoverTarget}
    <div
      class="binding-popover"
      class:has-code={hoverTarget.type !== "binding"}
    >
      {#if hoverTarget.description}
        <div>
          <!-- eslint-disable-next-line svelte/no-at-html-tags-->
          {@html hoverTarget.description}
        </div>
      {/if}
      {#if hoverTarget.code}
        {#if mode === BindingMode.JavaScript}
          <CodeEditor
            value={hoverTarget.code?.trim()}
            mode={EditorModes.JS}
            readonly
          />
        {:else if mode === BindingMode.Text}
          <!-- eslint-disable-next-line svelte/no-at-html-tags-->
          <pre>{@html hoverTarget.code}</pre>
        {/if}
      {/if}
    </div>
  {/if}
</Popover>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="binding-side-panel">
  <Layout noPadding gap="S">
    {#if selectedCategory}
      <div class="header">
        <Icon
          name="BackAndroid"
          hoverable
          size="S"
          on:click={() => (selectedCategory = null)}
        />
        {selectedCategory}
        {#if selectedCategory === "Snippets"}
          {#if enableSnippets}
            <div class="add-snippet-button">
              <Icon
                size="S"
                name="Add"
                hoverable
                newStyles
                on:click={createSnippet}
              />
            </div>
          {:else}
            <div class="title">
              <Tags>
                <Tag icon="LockClosed">Premium</Tag>
              </Tags>
            </div>
          {/if}
        {/if}
      </div>
    {/if}

    {#if !selectedCategory}
      <div class="header">
        {#if searching}
          <div class="search-input">
            <Input
              placeholder="Search for bindings"
              autocomplete={false}
              bind:value={search}
              autofocus
            />
          </div>
          <Icon
            size="S"
            name="Close"
            hoverable
            newStyles
            on:click={stopSearching}
          />
        {:else}
          <div class="title">Bindings</div>
          <Icon
            size="S"
            name="Search"
            hoverable
            newStyles
            on:click={startSearching}
          />
        {/if}
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
            <Icon
              size="S"
              color="var(--spectrum-global-color-gray-700)"
              name={categoryIcons[categoryName]}
            />
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
            {#if filteredCategories.length > 1}
              <div class="cat-heading">
                <Icon name={categoryIcons[category.name]} />{category.name}
              </div>
            {/if}
            <ul>
              {#each category.bindings as binding}
                <li
                  class="binding"
                  on:mouseenter={e =>
                    showBindingPopover(binding, e.currentTarget)}
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
            <ul class="helpers">
              {#each filteredHelpers as helper}
                <li
                  class="binding"
                  on:mouseenter={e =>
                    showHelperPopover(helper, e.currentTarget)}
                  on:click={() =>
                    addHelper(helper, mode === BindingMode.JavaScript)}
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

      {#if selectedCategory === "Snippets" || search}
        <div class="snippet-list">
          {#if enableSnippets}
            {#each filteredSnippets as snippet}
              <li
                class="snippet"
                on:mouseenter={e => showSnippet(snippet, e.currentTarget)}
                on:mouseleave={hidePopover}
                on:click={() => addSnippet(snippet)}
              >
                {snippet.name}
                <Icon
                  name="Edit"
                  hoverable
                  newStyles
                  size="S"
                  on:click={e => editSnippet(e, snippet)}
                />
              </li>
            {/each}
          {:else if !search}
            <div class="upgrade">
              <Body size="S">
                Snippets let you create reusable JS functions and values that
                can all be managed in one place
              </Body>
              {#if enableSnippets}
                <Button cta on:click={createSnippet}>Create snippet</Button>
              {:else}
                <UpgradeButton />
              {/if}
            </div>
          {/if}
        </div>
      {/if}
    {/if}
  </Layout>
</div>

{#if showSnippetDrawer}
  <SnippetDrawer
    snippet={editableSnippet}
    on:drawerHide={() => (showSnippetDrawer = false)}
  />
{/if}

<style>
  .binding-side-panel {
    border-left: var(--border-light);
    height: 100%;
    overflow: auto;
  }

  .header {
    height: 53px;
    padding: 0 var(--spacing-l);
    display: flex;
    align-items: center;
    border-bottom: var(--border-light);
    position: sticky;
    top: 0;
    gap: var(--spacing-m);
    background: var(--background);
    z-index: 1;
  }
  .header :global(input) {
    border: none;
    border-radius: 0;
    background: none;
    padding: 0;
  }
  .search-input,
  .title {
    flex: 1 1 auto;
  }

  ul.category-list {
    padding: 0 var(--spacing-l);
    padding-bottom: var(--spacing-l);
  }
  .sub-section {
    padding: var(--spacing-l);
    padding-top: 0;
  }
  ul.helpers li * {
    pointer-events: none;
  }
  ul.category-list li {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }
  ul.category-list :global(.spectrum-Icon) {
    margin: -4px 0;
  }
  ul.category-list .category-name {
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
    gap: var(--spacing-m);
    justify-content: space-between;
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
    color: var(--spectrum-global-color-gray-700);
    margin-bottom: var(--spacing-s);
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
    transition: background-color 130ms ease-out, color 130ms ease-out,
      border-color 130ms ease-out;
    word-wrap: break-word;
  }
  li:not(:last-of-type) {
    margin-bottom: var(--spacing-s);
  }
  li :global(*) {
    transition: color 130ms ease-out;
  }
  li:hover {
    color: var(--spectrum-global-color-gray-900);
    background-color: var(--spectrum-global-color-gray-50);
    cursor: pointer;
  }

  .binding__label {
    text-transform: capitalize;
  }
  .binding__type {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--spectrum-global-color-gray-700);
  }

  .binding-popover {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    padding: var(--spacing-m);
  }
  .binding-popover pre {
    padding: 0;
    margin: 0;
    font-size: 12px;
    white-space: pre;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .binding-popover.has-code pre {
    color: var(--spectrum-global-color-blue-700);
  }
  .binding-popover pre :global(span) {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
  .binding-popover :global(p) {
    padding: 0;
    margin: 0;
  }
  .binding-popover.has-code :global(code) {
    font-size: 12px;
  }
  .binding-popover.has-code :global(.cm-line),
  .binding-popover.has-code :global(.cm-content) {
    padding: 0;
  }

  /* Snippets */
  .add-snippet-button {
    margin-left: auto;
  }
  .snippet-list {
    padding: 0 var(--spacing-l);
    padding-bottom: var(--spacing-l);
    display: flex;
    flex-direction: column;
  }
  .snippet {
    font-size: var(--font-size-s);
    padding: var(--spacing-m);
    border-radius: 4px;
    background-color: var(--spectrum-global-color-gray-200);
    transition: background-color 130ms ease-out, color 130ms ease-out,
      border-color 130ms ease-out;
    word-wrap: break-word;
    display: flex;
    justify-content: space-between;
  }
  .snippet:hover {
    color: var(--spectrum-global-color-gray-900);
    background-color: var(--spectrum-global-color-gray-50);
    cursor: pointer;
  }

  /* Upgrade */
  .upgrade {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-l);
  }
  .upgrade :global(p) {
    text-align: center;
    align-self: center;
  }
</style>
