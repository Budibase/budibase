<script>
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
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "@/components/common/CodeEditor"
  import SnippetDrawer from "./SnippetDrawer.svelte"
  import { licensing } from "@/stores/portal"
  import UpgradeButton from "@/pages/builder/portal/_components/UpgradeButton.svelte"

  export let addSnippet
  export let snippets

  let search = ""
  let searching = false
  let popover
  let popoverAnchor
  let hoveredSnippet
  let hideTimeout
  let snippetDrawer
  let editableSnippet

  $: enableSnippets = !$licensing.isFreePlan
  $: filteredSnippets = getFilteredSnippets(enableSnippets, snippets, search)

  const getFilteredSnippets = (enableSnippets, snippets, search) => {
    if (!enableSnippets || !snippets?.length) {
      return []
    }
    if (!search?.length) {
      return snippets
    }
    return snippets.filter(snippet =>
      snippet.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  const showSnippet = (snippet, target) => {
    stopHidingPopover()
    popoverAnchor = target
    hoveredSnippet = snippet
    popover.show()
  }

  const hidePopover = () => {
    hideTimeout = setTimeout(() => {
      popover.hide()
      popoverAnchor = null
      hoveredSnippet = null
      hideTimeout = null
    }, 100)
  }

  const stopHidingPopover = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
  }

  const startSearching = () => {
    searching = true
    search = ""
  }

  const stopSearching = () => {
    searching = false
    search = ""
  }

  const createSnippet = () => {
    editableSnippet = null
    snippetDrawer.show()
  }

  const editSnippet = (e, snippet) => {
    e.preventDefault()
    e.stopPropagation()
    editableSnippet = snippet
    snippetDrawer.show()
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="snippet-side-panel">
  <Layout noPadding gap="S">
    <div class="header">
      {#if enableSnippets}
        {#if searching}
          <div class="search-input">
            <Input
              placeholder="Search for snippets"
              autocomplete="off"
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
          <div class="title">Snippets</div>
          <Icon
            size="S"
            name="Search"
            hoverable
            newStyles
            on:click={startSearching}
          />
          <Icon
            size="S"
            name="Add"
            hoverable
            newStyles
            on:click={createSnippet}
          />
        {/if}
      {:else}
        <div class="title">
          Snippets
          <Tags>
            <Tag icon="LockClosed">Premium</Tag>
          </Tags>
        </div>
      {/if}
    </div>
    <div class="snippet-list">
      {#if enableSnippets && filteredSnippets?.length}
        {#each filteredSnippets as snippet}
          <div
            class="snippet"
            on:mouseenter={e => showSnippet(snippet, e.target)}
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
          </div>
        {/each}
      {:else}
        <div class="upgrade">
          <Body size="S">
            Snippets let you create reusable JS functions and values that can
            all be managed in one place
          </Body>
          {#if enableSnippets}
            <Button cta on:click={createSnippet}>Create snippet</Button>
          {:else}
            <UpgradeButton />
          {/if}
        </div>
      {/if}
    </div>
  </Layout>
</div>

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
  <div class="snippet-popover">
    {#key hoveredSnippet}
      <CodeEditor
        value={hoveredSnippet.code?.trim()}
        mode={EditorModes.JS}
        readonly
      />
    {/key}
  </div>
</Popover>

<SnippetDrawer bind:this={snippetDrawer} snippet={editableSnippet} />

<style>
  .snippet-side-panel {
    border-left: var(--border-light);
    height: 100%;
    overflow: auto;
  }

  /* Header */
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
  .title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
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

  /* List */
  .snippet-list {
    padding: 0 var(--spacing-l);
    padding-bottom: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
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

  /* Popover */
  .snippet-popover {
    width: 400px;
  }
</style>
