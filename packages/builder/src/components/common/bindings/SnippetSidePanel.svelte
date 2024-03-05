<script>
  import { Input, Layout, Icon, Popover } from "@budibase/bbui"

  export let addSnippet
  export let snippets

  let search = ""
  let searching = false
  let popover
  let popoverAnchor
  let hoveredSnippet
  let hideTimeout

  snippets = [
    {
      name: "Square",
      code: `
      return function(num) {
        return num * num
      }
    `,
    },
    {
      name: "HelloWorld",
      code: `
      return "Hello, world!"
    `,
    },
  ]

  $: filteredSnippets = getFilteredSnippets(snippets, search)

  const getFilteredSnippets = (snippets, search) => {
    if (!snippets?.length) {
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

  const openSnippetModal = () => {}
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
  <!-- eslint-disable-next-line svelte/no-at-html-tags-->
  <pre class="snippet-popover">{@html hoveredSnippet.code}</pre>
</Popover>

<div class="snippet-side-panel">
  <Layout noPadding gap="S">
    <div class="header">
      {#if searching}
        <div class="search-input">
          <Input
            placeholder="Search for snippets"
            autocomplete="off"
            bind:value={search}
          />
        </div>
        <Icon size="S" name="Close" hoverable on:click={stopSearching} />
      {:else}
        <div class="title">Snippets</div>
        <Icon size="S" name="Search" hoverable on:click={startSearching} />
        <Icon size="S" name="Add" hoverable on:click={openSnippetModal} />
      {/if}
    </div>

    <div class="snippet-list">
      {#each filteredSnippets as snippet}
        <div class="snippet">
          <div
            class="snippet-name"
            on:mouseenter={e => showSnippet(snippet, e.target)}
            on:mouseleave={hidePopover}
            on:click={() => addSnippet(snippet)}
          >
            {snippet.name}
          </div>
        </div>
      {/each}
    </div>
  </Layout>
</div>

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
  .search-input {
    flex: 1;
  }

  /* List */
  .snippet-list {
    padding: 0 var(--spacing-l);
    padding-bottom: var(--spacing-l);
  }
  .snippet {
    font-size: var(--font-size-s);
    padding: var(--spacing-m);
    border-radius: 4px;
    background-color: var(--spectrum-global-color-gray-200);
    transition: background-color 130ms ease-out, color 130ms ease-out,
      border-color 130ms ease-out;
    word-wrap: break-word;
  }

  /* Popover */
  .snippet-popover {
    padding: 0;
    margin: 0;
    font-size: 12px;
    white-space: pre;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
