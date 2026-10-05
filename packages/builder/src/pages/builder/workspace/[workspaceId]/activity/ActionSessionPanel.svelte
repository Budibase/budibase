<script lang="ts">
  import { API } from "@/api"
  import { automationStore } from "@/stores/builder"
  import { agentsStore } from "@/stores/portal"
  import { Body, Button } from "@budibase/bbui"
  import type {
    ActionEvent,
    ActionSession,
    ActionsPagination,
  } from "@budibase/types"
  import { untrack } from "svelte"
  import ActivityDetailsList from "./ActivityDetailsList.svelte"
  import ActivityPanelShell from "./ActivityPanelShell.svelte"
  import ActivityTableFooter from "./ActivityTableFooter.svelte"
  import ActivityTimeline from "./ActivityTimeline.svelte"
  import { toActionTimelineItem } from "./actionEventTimeline"
  import {
    getActionSessionDetails,
    getActionSessionRowId,
    getActionSessionTitle,
  } from "./actionSessionRows"
  import { getPaginationLabel } from "./pagination"

  const PAGE_SIZE = 20

  interface PageRequest {
    page: number
    bookmark?: string
  }

  let {
    session,
    onClose,
  }: {
    session: ActionSession | undefined
    onClose: () => void
  } = $props()

  let events = $state<ActionEvent[]>([])
  let total = $state(0)
  let pagination = $state<ActionsPagination | null>(null)
  let currentPage = $state(1)
  let loading = $state(false)
  let loadFailed = $state(false)
  let lastRequest: PageRequest = { page: 1 }

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
    events.map(event => toActionTimelineItem({ event, stepNames, agentNames }))
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

    return async function loadEvents(request: PageRequest = { page: 1 }) {
      const sequence = ++requestSequence
      lastRequest = request
      if (!session) {
        events = []
        pagination = null
        loading = false
        return
      }

      loading = true
      loadFailed = false
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
      } catch (error) {
        if (sequence !== requestSequence) {
          return
        }
        console.error("Failed to fetch action session events", error)
        events = []
        pagination = null
        loadFailed = true
      } finally {
        if (sequence === requestSequence) {
          loading = false
        }
      }
    }
  })()

  function goToPrevPage() {
    if (loading || !hasPrevPage) {
      return
    }
    loadEvents({
      page: Math.max(1, currentPage - 1),
      bookmark: pagination?.previousBookmark,
    })
  }

  function goToNextPage() {
    if (loading || !hasNextPage) {
      return
    }
    loadEvents({
      page: currentPage + 1,
      bookmark: pagination?.nextBookmark,
    })
  }

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

      <ActivityDetailsList details={getActionSessionDetails(session)} />
    </section>

    <section class="activity-panel-section">
      <div class="section-title">Timeline</div>

      {#if loadFailed}
        <div class="load-error" role="alert">
          <Body size="S">Failed to load events.</Body>
          <Button secondary size="S" on:click={() => loadEvents(lastRequest)}
            >Try again</Button
          >
        </div>
      {:else if loading && events.length === 0}
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          Loading events...
        </Body>
      {:else}
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
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
          />
        {/if}
      {/if}
    </section>
  {/if}
</ActivityPanelShell>

<style>
  .load-error {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-m);
    padding: var(--spacing-l);
    border-radius: var(--border-radius-s);
    background: var(--spectrum-global-color-gray-100);
  }
</style>
