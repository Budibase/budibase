<script lang="ts">
  import { Icon, Popover, Body, Button } from "@budibase/bbui"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "@/components/common/CodeEditor"
  import SnippetDrawer from "../SnippetDrawer.svelte"
  import { licensing } from "@/stores/portal"
  import UpgradeButton from "@/pages/builder/portal/_components/UpgradeButton.svelte"
  import type { Snippet } from "@budibase/types"

  export let addSnippet
  export let snippets
  export let search

  let popover: Popover
  let popoverAnchor: HTMLElement | null
  let hoverTarget: {
    type: "binding" | "helper" | "snippet"
    code: string
    description?: string
  } | null
  let hideTimeout: ReturnType<typeof setTimeout> | null
  let snippetDrawer: SnippetDrawer
  let editableSnippet: Snippet | null

  $: enableSnippets = !$licensing.isFreePlan

  $: filteredSnippets = getFilteredSnippets(enableSnippets, snippets, search)

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

  const createSnippet = () => {
    editableSnippet = null
    snippetDrawer.show()
  }

  const editSnippet = (e: Event, snippet: Snippet) => {
    e.preventDefault()
    e.stopPropagation()
    editableSnippet = snippet
    snippetDrawer.show()
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
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="snippet-list">
  {#if enableSnippets}
    {#each filteredSnippets as snippet}
      <div
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
      </div>
    {/each}
  {:else if !search}
    <div class="upgrade">
      <Body size="S">
        Snippets let you create reusable JS functions and values that can all be
        managed in one place
      </Body>
      {#if enableSnippets}
        <Button cta on:click={createSnippet}>Create snippet</Button>
      {:else}
        <UpgradeButton />
      {/if}
    </div>
  {/if}
</div>

{#if hoverTarget && popoverAnchor}
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
      {#key hoverTarget}
        <CodeEditor
          value={hoverTarget.code?.trim()}
          mode={EditorModes.JS}
          readonly
        />
      {/key}
    </div>
  </Popover>
{/if}

<SnippetDrawer bind:this={snippetDrawer} snippet={editableSnippet} />

<style>
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
