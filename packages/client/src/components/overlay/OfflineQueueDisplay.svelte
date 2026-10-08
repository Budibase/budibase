<script lang="ts">
  import { ActionButton, Body, Icon } from "@budibase/bbui"
  import { offlineQueueStore } from "@/stores"

  let expanded = $state(false)

  const queue = $derived($offlineQueueStore)
  const total = $derived(queue.pendingCount + queue.failedCount)
  const summary = $derived.by(() => {
    const parts = []
    if (queue.pendingCount) {
      parts.push(`${queue.pendingCount} waiting to sync`)
    }
    if (queue.failedCount) {
      parts.push(`${queue.failedCount} failed`)
    }
    return parts.join(", ")
  })
</script>

{#if total}
  <div class="offline-queue" class:expanded>
    <button class="summary" onclick={() => (expanded = !expanded)}>
      <Icon
        name={queue.failedCount ? "warning" : "cloud-arrow-up"}
        size="S"
        color={queue.failedCount
          ? "var(--spectrum-global-color-red-600)"
          : undefined}
      />
      <Body size="S">{summary}</Body>
      <Icon name={expanded ? "caret-down" : "caret-up"} size="S" />
    </button>

    {#if expanded}
      <div class="submissions">
        {#each queue.submissions as submission (submission.id)}
          <div class="submission">
            <div class="details">
              <Body size="S">
                {new Date(submission.createdAt).toLocaleString()}
              </Body>
              {#if submission.status === "failed"}
                <Body size="XS" color="var(--spectrum-global-color-red-600)">
                  {submission.error}
                </Body>
              {:else}
                <Body size="XS">Waiting to sync</Body>
              {/if}
            </div>
            {#if submission.status === "failed"}
              <ActionButton
                size="S"
                on:click={() => offlineQueueStore.actions.retry(submission.id)}
              >
                Retry
              </ActionButton>
            {/if}
            <ActionButton
              size="S"
              quiet
              on:click={() => offlineQueueStore.actions.remove(submission.id)}
            >
              Discard
            </ActionButton>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .offline-queue {
    position: fixed;
    bottom: var(--spacing-l);
    left: var(--spacing-l);
    z-index: 999;
    max-width: calc(100vw - 2 * var(--spacing-l));
    width: 320px;
    background: var(--spectrum-global-color-gray-50);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .summary {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    width: 100%;
    padding: var(--spacing-m);
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    text-align: left;
  }
  .summary :global(p) {
    flex: 1 1 auto;
  }
  .submissions {
    max-height: 240px;
    overflow-y: auto;
    border-top: 1px solid var(--spectrum-global-color-gray-300);
  }
  .submission {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-s) var(--spacing-m);
  }
  .details {
    flex: 1 1 auto;
    min-width: 0;
    overflow-wrap: anywhere;
  }
</style>
