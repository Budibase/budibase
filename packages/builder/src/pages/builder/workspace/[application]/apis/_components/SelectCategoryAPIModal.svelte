<script lang="ts">
  import { Button, CollapsibleSearch, Divider } from "@budibase/bbui"
  import { createEventDispatcher, onDestroy, onMount, tick } from "svelte"
  import type { RestTemplate } from "@budibase/types"

  export let templates: RestTemplate[] = []
  export let loading = false
  export let customDisabled = false

  const dispatch = createEventDispatcher<{
    selectTemplate: RestTemplate
    custom: void
  }>()

  let scrolling = false
  let scrollContainer: HTMLDivElement | undefined
  let loadTrigger: HTMLDivElement | undefined
  let observer: IntersectionObserver | null = null
  let loadingMore = false
  let currentPage = 1
  let lastConnectorCount = 0
  let searchValue = ""
  let lastSearchValue = ""
  const itemsPerPage = 24

  $: normalizedSearchValue = searchValue.trim().toLowerCase()
  $: if (normalizedSearchValue !== lastSearchValue) {
    lastSearchValue = normalizedSearchValue
    currentPage = 1
    if (scrollContainer) {
      scrollContainer.scrollTop = 0
    }
    if (observer && loadTrigger) {
      observer.disconnect()
      observer.observe(loadTrigger)
    }
  }

  $: filteredTemplates = normalizedSearchValue
    ? templates.filter(
        t =>
          t.name.toLowerCase().includes(normalizedSearchValue) ||
          t.templates?.some(c =>
            c.name.toLowerCase().includes(normalizedSearchValue)
          )
      )
    : templates

  $: sortedTemplates = [...filteredTemplates].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  $: if (sortedTemplates.length !== lastConnectorCount) {
    lastConnectorCount = sortedTemplates.length
    currentPage = 1
  }

  $: totalPages = Math.max(1, Math.ceil(sortedTemplates.length / itemsPerPage))
  $: if (currentPage > totalPages) {
    currentPage = totalPages
  }

  $: pagedTemplates = sortedTemplates.slice(0, currentPage * itemsPerPage)
  $: hasNextPage = currentPage < totalPages

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLDivElement
    scrolling = target?.scrollTop !== 0
  }

  const handleTemplateSelection = (template: RestTemplate) => {
    dispatch("selectTemplate", template)
  }

  const handleCustomClick = () => {
    dispatch("custom")
  }

  const handleIntersect = async (entries: IntersectionObserverEntry[]) => {
    if (loadingMore || !hasNextPage) return
    const isVisible = entries.some(entry => entry.isIntersecting)
    if (!isVisible) return
    loadingMore = true
    currentPage += 1
    await tick()
    loadingMore = false
  }

  const ensureObserver = () => {
    if (!scrollContainer || !loadTrigger) return
    observer?.disconnect()
    if (!observer) {
      observer = new IntersectionObserver(handleIntersect, {
        root: scrollContainer,
        rootMargin: "80px",
        threshold: 0.1,
      })
    }
    observer.observe(loadTrigger)
  }

  onMount(() => {
    ensureObserver()
  })

  onDestroy(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })
</script>

<div class="api-main" class:scrolling>
  <div class="api-header">
    <div>API connectors</div>
    <div class="api-header-actions">
      <CollapsibleSearch
        placeholder="Search templates"
        value={searchValue}
        on:change={event => (searchValue = event.detail)}
      />
      <Button
        secondary
        icon="plus"
        disabled={loading || customDisabled}
        on:click={handleCustomClick}
      >
        Custom REST API
      </Button>
    </div>
  </div>
  <Divider size={"S"} noMargin />
  <div
    class="contents-wrap"
    bind:this={scrollContainer}
    on:scroll={handleScroll}
  >
    <div class="contents">
      <div class="grid">
        {#each pagedTemplates as template (template.id)}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            class="api"
            class:disabled={loading}
            on:click={() => handleTemplateSelection(template)}
          >
            <div class="api-icon">
              <img src={template.icon} alt={template.name} />
            </div>
            <div class="api-name">{template.name}</div>
          </div>
        {/each}
      </div>
      <div class="load-trigger" bind:this={loadTrigger}></div>
    </div>
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 190px);
    justify-content: space-between;
    gap: 12px;
  }

  .api {
    display: flex;
    height: 38px;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    cursor: pointer;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    background-color: var(--spectrum-global-color-gray-100);
  }

  .api:hover {
    background-color: var(--spectrum-global-color-gray-300);
  }

  .api.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .api.disabled img {
    filter: grayscale(100%);
    opacity: 0.6;
  }

  .api-icon img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  .api-name {
    min-width: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .api-icon {
    border-radius: 4px;
    display: flex;
    width: 36px;
    height: 36px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    margin-right: 10px;
    overflow: hidden;
  }

  .api-header {
    padding: var(--spacing-l) var(--spectrum-dialog-confirm-padding);
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--spectrum-global-color-gray-800);
    font-size: 16px;
    font-weight: 600;
  }

  .api-header-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .api-main .contents {
    padding-top: var(--spacing-xl);
    padding-left: var(--spectrum-dialog-confirm-padding);
    padding-right: var(--spectrum-dialog-confirm-padding);
    padding-bottom: var(--spacing-l);
  }

  .api-main :global(hr) {
    background-color: var(--spectrum-global-color-gray-300);
  }

  .contents-wrap {
    flex: 1 1 auto;
    overflow-y: auto;
    min-height: 0;
    position: relative;
    height: calc(
      (6 * 51px) + (5 * 12px) + var(--spacing-xl) + var(--spacing-l)
    );
  }

  .load-trigger {
    height: 1px;
  }
</style>
