<script lang="ts">
  import { Popover, ActionButton, Button, Input } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import phosphorIcons from "./phosphorIcons"

  interface PhosphorIconSelectEvents {
    change: string
  }

  const dispatch = createEventDispatcher<PhosphorIconSelectEvents>()

  export let value: string = ""
  export let maxIconsPerPage: number = 72

  let searchTerm: string = ""
  let currentPage: number = 1

  let buttonAnchor: HTMLDivElement
  let dropdown: Popover
  let loading: boolean = false
  let loadedWeights: Set<string> = new Set()
  let isLoadingWeight: boolean = false

  // Load phosphor icon weights dynamically when dropdown is opened
  async function loadRegularWeight(): Promise<void> {
    if (loadedWeights.has("regular") || isLoadingWeight) return

    isLoadingWeight = true
    try {
      // Load from CDN instead of bundled package
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href =
        "https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/regular/style.css"

      await new Promise<void>((resolve, reject) => {
        link.onload = () => resolve()
        link.onerror = () => reject()
        document.head.appendChild(link)
      })

      loadedWeights.add("regular")
    } catch (error) {
      console.error("Failed to load phosphor regular icons", error)
    } finally {
      isLoadingWeight = false
    }
  }

  // Load regular weight when dropdown opens
  async function onDropdownShow(): Promise<void> {
    await loadRegularWeight()
    dropdown.show()
  }

  // Reactive search - automatically filter icons when searchTerm changes
  $: filteredIcons = searchTerm
    ? phosphorIcons.filter((icon: string) =>
        icon.toLowerCase().includes(searchTerm.toLowerCase().trim())
      )
    : phosphorIcons

  // Reset to first page when search changes
  $: if (searchTerm !== undefined) {
    currentPage = 1
  }

  function pageClick(direction: "next" | "back"): void {
    if (
      (direction === "next" && currentPage >= totalPages) ||
      (direction === "back" && currentPage <= 1)
    ) {
      return
    }

    loading = true
    if (direction === "next") {
      currentPage++
    } else {
      currentPage--
    }
    loading = false
  }

  const select = (icon: string): void => {
    value = icon
    dispatch("change", icon)
    dropdown.hide()
  }

  $: displayValue = value || "Pick icon"
  $: totalPages = Math.max(1, Math.ceil(filteredIcons.length / maxIconsPerPage))
  $: pageEndIdx = maxIconsPerPage * currentPage
  $: pagedIcons = filteredIcons.slice(pageEndIdx - maxIconsPerPage, pageEndIdx)
  $: pagerText = `Page ${currentPage} of ${totalPages} (${filteredIcons.length} icons)`
</script>

<div bind:this={buttonAnchor}>
  <ActionButton fullWidth on:click={onDropdownShow}>
    {#if value}
      <i class="ph ph-{value}" style="margin-right: 8px;" />
    {/if}
    {displayValue}
  </ActionButton>
</div>

<Popover bind:this={dropdown} anchor={buttonAnchor} resizable={false}>
  <div class="container">
    <div class="search-input">
      <Input bind:value={searchTerm} placeholder={"Search phosphor icons..."} />
      {#if value}
        <Button primary on:click={() => select("")}>Clear</Button>
      {/if}
    </div>

    {#if totalPages > 1}
      <div class="page-area">
        <div class="pager">
          <i
            on:click={() => pageClick("back")}
            on:keypress={e => e.key === "Enter" && pageClick("back")}
            class="page-btn ri-arrow-left-line ri-sm"
            class:disabled={currentPage === 1}
            role="button"
            tabindex="0"
          />
          <span>{pagerText}</span>
          <i
            on:click={() => pageClick("next")}
            on:keypress={e => e.key === "Enter" && pageClick("next")}
            class="page-btn ri-arrow-right-line ri-sm"
            class:disabled={currentPage === totalPages}
            role="button"
            tabindex="0"
          />
        </div>
      </div>
    {/if}

    {#if pagedIcons.length > 0}
      <div class="icon-area">
        {#if !loading}
          {#each pagedIcons as icon}
            <div
              class="icon-container"
              class:selected={value === icon}
              on:click={() => select(icon)}
              role="button"
              tabindex="0"
              on:keypress={e => e.key === "Enter" && select(icon)}
            >
              <div class="icon-preview">
                <i class="ph ph-{icon}" />
              </div>
              <div class="icon-label">{icon}</div>
            </div>
          {/each}
        {/if}
      </div>
    {:else}
      <div class="no-icons">No icons found</div>
    {/if}
  </div>
</Popover>

<style>
  .container {
    width: 750px;
    height: 600px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    align-items: stretch;
    padding: var(--spacing-l);
    background: var(--spectrum-global-color-gray-100);
  }
  .icon-area {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    justify-content: flex-start;
    overflow-y: auto;
    max-height: 450px;
    align-content: start;
  }
  .no-icons {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--spectrum-global-color-gray-600);
  }
  .search-input {
    display: flex;
    gap: 10px;
  }
  .search-input :global(> :first-child) {
    flex: 1 1 auto;
  }
  .page-area {
    display: flex;
    justify-content: center;
    user-select: none;
  }
  .pager {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
  .page-area i {
    font-size: 16px;
    transition: color 130ms ease-out;
  }
  .page-area i:hover {
    color: var(--spectrum-global-color-blue-600);
    cursor: pointer;
  }
  .icon-container {
    height: 55px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
    transition: background 130ms ease-out;
    min-height: 55px;
  }
  .icon-container:hover {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-200);
  }
  .icon-container.selected {
    background: var(--spectrum-global-color-gray-300);
  }
  .icon-preview {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon-preview i {
    font-size: 20px;
  }
  .icon-label {
    flex: 0 0 20px;
    text-align: center;
    font-size: 12px;
    margin-bottom: 2px;
    color: var(--spectrum-global-color-gray-700);
  }
  .page-btn {
    color: var(--spectrum-global-color-gray-700);
  }
  .page-btn:hover {
    cursor: pointer;
  }
  .page-btn.disabled {
    color: var(--spectrum-global-color-gray-400);
    cursor: not-allowed;
  }
  .page-btn.disabled:hover {
    color: var(--spectrum-global-color-gray-400);
  }
</style>
