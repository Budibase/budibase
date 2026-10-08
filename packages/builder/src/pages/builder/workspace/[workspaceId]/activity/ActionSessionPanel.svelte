<script lang="ts">
  import { API } from "@/api"
  import { automationStore, builderStore } from "@/stores/builder"
  import { agentsStore } from "@/stores/portal"
  import { Body, InlineAlert } from "@budibase/bbui"
  import { BuilderSocketEvent } from "@budibase/shared-core"
  import type {
    ActionEvent,
    ActionSession,
    ActionSessionChangeEvent,
    ActionsPagination,
  } from "@budibase/types"
  import { onMount, untrack } from "svelte"
  import ActivityDetailsList from "./ActivityDetailsList.svelte"
  import ActivityLoadError from "./ActivityLoadError.svelte"
  import ActivityPanelShell from "./ActivityPanelShell.svelte"
  import ActivityTableFooter from "./ActivityTableFooter.svelte"
  import ActivityTimeline from "./ActivityTimeline.svelte"
  import { toActionTimelineItem } from "./actionEventTimeline"
  import {
    getActionSessionDetails,
    getActionSessionRowId,
    getActionSessionTitle,
  } from "./actionSessionRows"
  import { getPaginationLabel, PAGE_SIZE } from "./pagination"

  interface PageRequest {
    page: number
    bookmark?: string
  }
  interface LoadEventsOptions {
    request?: PageRequest
    // Refreshes the current events page without a loading state, keeping
    // the current events if it fails
    background?: boolean
  }

  let {
    session,
    outdated = false,
    onClose,
  }: {
    session: ActionSession | undefined
    // The session is no longer in the list results, so its details can't be
    // refreshed
    outdated?: boolean
    onClose: () => void
  } = $props()

  let events = $state<ActionEvent[]>([])
  let total = $state(0)
  let pagination = $state<ActionsPagination | null>(null)
  let currentPage = $state(1)
  let loading = $state(false)
  let loadFailed = $state(false)
  let lastRequest: PageRequest = { page: 1 }
  let loadInFlight = false
  let refreshQueued = false
  let destroyed = false

  let sessionKey = $derived(session ? getActionSessionRowId(session) : null)

  let stepNames = $derived(
    Object.fromEntries(
      Object.entries($automationStore.blockDefinitions.ACTION).flatMap(
        ([stepId, definition]) =>
          definition ? [[stepId, definition.name]] : []
      )
    )
  )
  let agentNames = $derived(
    Object.fromEntries(
      $agentsStore.agents.flatMap(agent =>
        agent._id ? [[agent._id, agent.name]] : []
      )
    )
  )

  let timelineItems = $derived(
    events.map(event =>
      toActionTimelineItem({ event, stepNames, agentNames, session })
    )
  )

  let hasPrevPage = $derived(
    !!pagination?.hasPreviousPage && !!pagination.previousBookmark
  )
  let hasNextPage = $derived(
    !!pagination?.hasNextPage && !!pagination.nextBookmark
  )

  let paginationLabel = $derived(
    getPaginationLabel({
      page: currentPage,
      pageSize: PAGE_SIZE,
      rowCount: events.length,
      total,
    })
  )

  const loadEvents = (() => {
    let requestSequence = 0

    return async function loadEvents({
      request = { page: 1 },
      background = false,
    }: LoadEventsOptions = {}) {
      const sequence = ++requestSequence
      lastRequest = request
      if (!background) {
        // This load already covers every change notified so far
        refreshQueued = false
      }
      if (!session) {
        events = []
        pagination = null
        loading = false
        loadInFlight = false
        refreshQueued = false
        return
      }

      loadInFlight = true
      if (!background) {
        loading = true
        loadFailed = false
      }
      try {
        const response = await API.fetchActionSessionEvents({
          sourceType: session.sourceType,
          sourceId: session.sourceId,
          env: session.environment,
          limit: PAGE_SIZE,
          bookmark: request.bookmark,
        })
        if (sequence !== requestSequence) {
          return
        }
        events = response.events
        total = response.summary.total
        pagination = response.pagination
        currentPage = request.page
        loadFailed = false
      } catch (error) {
        if (sequence !== requestSequence) {
          return
        }
        if (background) {
          console.error("Failed to refresh action session events", error)
          return
        }
        console.error("Failed to fetch action session events", error)
        events = []
        pagination = null
        loadFailed = true
      } finally {
        if (sequence === requestSequence) {
          loading = false
          loadInFlight = false
          if (refreshQueued && !destroyed) {
            refreshQueued = false
            loadEvents({ request: lastRequest, background: true })
          }
        }
      }
    }
  })()

  // Events are append-only, so re-fetching the current page keeps it stable
  // while new events show up on the last page
  function refreshEvents() {
    if (!session) {
      return
    }
    if (loadInFlight) {
      refreshQueued = true
      return
    }
    loadEvents({ request: lastRequest, background: true })
  }

  function handleActionSessionChange(event: ActionSessionChangeEvent) {
    if (!session || event.environment !== session.environment) {
      return
    }
    const { sourceType, sourceId } = session
    if (
      event.truncated ||
      event.sessions.some(
        changed =>
          changed.sourceType === sourceType && changed.sourceId === sourceId
      )
    ) {
      refreshEvents()
    }
  }

  function goToPrevPage() {
    if (loading || !hasPrevPage) {
      return
    }
    loadEvents({
      request: {
        page: Math.max(1, currentPage - 1),
        bookmark: pagination?.previousBookmark,
      },
    })
  }

  function goToNextPage() {
    if (loading || !hasNextPage) {
      return
    }
    loadEvents({
      request: {
        page: currentPage + 1,
        bookmark: pagination?.nextBookmark,
      },
    })
  }

  onMount(() => {
    return () => {
      destroyed = true
    }
  })

  $effect(() => {
    const socket = builderStore.websocket
    if (!socket) {
      return
    }

    socket.on(BuilderSocketEvent.ActionSessionChange, handleActionSessionChange)
    // Notifications aren't replayed, so catch up on anything missed while
    // disconnected
    socket.on("connect", refreshEvents)
    return () => {
      socket.off(
        BuilderSocketEvent.ActionSessionChange,
        handleActionSessionChange
      )
      socket.off("connect", refreshEvents)
    }
  })

  $effect(() => {
    // Only a change of session identity resets the timeline
    sessionKey
    untrack(() => {
      events = []
      total = 0
      pagination = null
      currentPage = 1
      loadFailed = false
      loadEvents()
    })
  })
</script>

<ActivityPanelShell
  open={!!session}
  title={session ? getActionSessionTitle(session) : ""}
  {onClose}
>
  {#if session}
    <section class="activity-panel-section">
      <div class="section-title">Details</div>

      {#if outdated}
        <InlineAlert
          type="info"
          header="Details may be out of date"
          message="This session is no longer in the current results."
        />
      {/if}

      <ActivityDetailsList details={getActionSessionDetails(session)} />
    </section>

    <section class="activity-panel-section">
      <div class="section-title">Timeline</div>

      {#if loading}
        <div role="status">
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            Loading events...
          </Body>
        </div>
      {/if}

      {#if loadFailed}
        <ActivityLoadError
          message="Failed to load events."
          onRetry={() => loadEvents({ request: lastRequest })}
        />
      {:else if !loading || events.length > 0}
        <ActivityTimeline
          items={timelineItems}
          emptyText="No events recorded yet."
        />

        {#if events.length > 0}
          <ActivityTableFooter
            label={paginationLabel}
            page={currentPage}
            {hasPrevPage}
            {hasNextPage}
            disabled={loading}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
          />
        {/if}
      {/if}
    </section>
  {/if}
</ActivityPanelShell>
