<script lang="ts" module>
  let lastTabId = "all"
</script>

<script lang="ts">
  import { onMount } from "svelte"
  import {
    ActionButton,
    Body,
    Divider,
    Heading,
    Icon,
    notifications,
    Pagination,
  } from "@budibase/bbui"
  import type { RequestRow } from "@budibase/types"
  import dayjs from "dayjs"
  import { API } from "@/api"

  interface RequestTab {
    id: string
    label: string
    empty: string
    filters: { awaitingMe?: boolean; isRequester?: boolean }
  }

  const tabs: RequestTab[] = [
    {
      id: "needsInput",
      label: "Needs input",
      empty: "Nothing needs your input",
      filters: { awaitingMe: true },
    },
    {
      id: "mine",
      label: "My requests",
      empty: "You haven't raised any requests",
      filters: { isRequester: true },
    },
    { id: "all", label: "All", empty: "No requests yet", filters: {} },
  ]

  let activeTab = $state.raw(tabs.find(tab => tab.id === lastTabId) ?? tabs[0])
  let requests = $state<RequestRow[]>([])
  let page = $state(1)
  let hasNextPage = $state(false)
  let loading = $state(true)
  let failedLoad = $state.raw<{ tab: RequestTab; nextPage: number }>()

  const isClosed = (request: RequestRow) =>
    request.status === "completed" || request.status === "failed"

  const dotClass = (request: RequestRow) => {
    if (request.awaitingMe) {
      return "awaiting"
    }
    return isClosed(request) ? "closed" : "open"
  }

  let requestSequence = 0

  const load = async ({
    tab,
    nextPage,
  }: {
    tab: RequestTab
    nextPage: number
  }) => {
    const sequence = ++requestSequence
    loading = true
    failedLoad = undefined
    try {
      const result = await API.fetchUserRequests({
        ...tab.filters,
        page: nextPage,
      })
      if (sequence !== requestSequence) {
        return
      }
      requests = result.requests
      page = result.page
      hasNextPage = result.hasNextPage
    } catch (error) {
      if (sequence === requestSequence) {
        failedLoad = { tab, nextPage }
        notifications.error("Error loading requests")
      }
    } finally {
      if (sequence === requestSequence) {
        loading = false
      }
    }
  }

  const selectTab = (tab: RequestTab) => {
    if (tab === activeTab) {
      return
    }
    activeTab = tab
    lastTabId = tab.id
    requests = []
    page = 1
    hasNextPage = false
    load({ tab, nextPage: 1 })
  }

  onMount(() => {
    load({ tab: activeTab, nextPage: 1 })
  })
</script>

<div class="title">
  <Heading size="M">Requests</Heading>
  <div class="tabs">
    {#each tabs as tab (tab.id)}
      <ActionButton
        quiet
        selected={activeTab === tab}
        on:click={() => selectTab(tab)}
      >
        {tab.label}
      </ActionButton>
    {/each}
  </div>
</div>
<Divider noMargin />

{#if failedLoad}
  <div class="load-failed">
    <Body size="S">Couldn't load requests.</Body>
    <ActionButton size="S" on:click={() => failedLoad && load(failedLoad)}>
      Retry
    </ActionButton>
  </div>
{/if}

{#if requests.length}
  <div class="requests">
    {#each requests as request (`${request.workspaceId}_${request.requestId}`)}
      <a
        class="request"
        class:closed={isClosed(request)}
        href={`/requests/${request.workspaceId}/${request.requestId}`}
      >
        <span class="dot {dotClass(request)}"></span>
        <span class="request-title">{request.title || request.requestId}</span>
        <span class="meta">
          {request.createdAt ? dayjs(request.createdAt).format("D MMM") : ""}
        </span>
        <Icon name="caret-right" size="S" />
      </a>
    {/each}
  </div>
{:else if !loading && !failedLoad}
  <Body size="S">{activeTab.empty}</Body>
{/if}

{#if page > 1 || hasNextPage}
  <div class="pagination">
    <Pagination
      {page}
      hasPrevPage={page > 1 && !loading}
      hasNextPage={hasNextPage && !loading}
      goToPrevPage={() => load({ tab: activeTab, nextPage: page - 1 })}
      goToNextPage={() => load({ tab: activeTab, nextPage: page + 1 })}
    />
  </div>
{/if}

<style>
  .load-failed {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-l);
  }
  .tabs {
    display: flex;
    gap: 4px;
    padding: 4px;
    border-radius: var(--border-radius-s);
    background: var(--spectrum-global-color-gray-100);
  }
  .tabs :global(.spectrum-ActionButton) {
    border-radius: var(--border-radius-s);
    border: 1px solid transparent;
    padding: 2px 8px;
    height: auto;
  }
  .tabs :global(.spectrum-ActionButton.is-selected) {
    background: var(--spectrum-global-color-gray-300);
  }
  .requests {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
  .request {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    gap: var(--spacing-l);
    padding: var(--spacing-l) var(--spacing-xl);
    border-radius: var(--border-radius-s);
    background-color: var(--background);
    color: var(--spectrum-global-color-gray-900);
  }
  .request:hover {
    background: var(--spectrum-global-color-gray-200);
    transition: background-color 130ms ease-in-out;
  }
  .request.closed {
    color: var(--spectrum-global-color-gray-700);
  }
  .request-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .meta {
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-600);
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .dot.awaiting {
    background: var(--spectrum-global-color-orange-500);
  }
  .dot.open {
    background: var(--spectrum-global-color-blue-500);
  }
  .dot.closed {
    background: var(--spectrum-global-color-gray-500);
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
  }
</style>
