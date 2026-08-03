<svelte:options runes={true} />

<script lang="ts">
  import { Badge, Body, Button, Icon, ProgressCircle } from "@budibase/bbui"
  import type { FunctionRunnerStatus } from "@budibase/types"

  export interface Props {
    status?: FunctionRunnerStatus
    loading?: boolean
    error?: string
    onretry?: () => void
  }

  let {
    status,
    loading = false,
    error = "",
    onretry = () => {},
  }: Props = $props()

  const labels: Record<FunctionRunnerStatus, string> = {
    healthy: "Runner healthy",
    disabled: "Runner disabled",
    unhealthy: "Runner unhealthy",
    busy: "Runner busy",
  }

  const descriptions: Record<FunctionRunnerStatus, string> = {
    healthy: "The local Function runner is available.",
    disabled: "Function execution is disabled on this installation.",
    unhealthy: "The local Function runner is unavailable or unhealthy.",
    busy: "The local Function runner has reached its concurrency limit.",
  }
</script>

<div class="runtime-notices">
  <section
    class="runner-status"
    class:error={status === "unhealthy" || !!error}
    class:warning={status === "disabled" || status === "busy"}
    data-testid="function-runner-status"
    data-status={status || "unknown"}
    aria-label="Function runner status"
  >
    {#if loading}
      <ProgressCircle size="S" />
      <Body size="S">Checking Function runner...</Body>
    {:else if error}
      <Icon name="warning-circle" size="S" />
      <Body size="S">{error}</Body>
      <Button secondary on:click={onretry}>Retry</Button>
    {:else if status}
      <Badge
        size="S"
        green={status === "healthy"}
        red={status === "unhealthy"}
        orange={status === "busy"}
        grey={status === "disabled"}
      >
        {labels[status]}
      </Badge>
      <Body size="S">{descriptions[status]}</Body>
    {/if}
  </section>

  <section class="trusted-author-warning" role="note">
    <Icon name="warning-circle" size="S" />
    <Body size="S">
      Functions use a local runner intended for trusted Function authors. Do not
      give Function authoring access to untrusted users; hostile authors require
      a hardened external executor that is not included in this alpha.
    </Body>
  </section>
</div>

<style>
  .runtime-notices {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    margin-bottom: var(--spacing-l);
  }
  .runner-status,
  .trusted-author-warning {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-s) var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--radius-m);
  }
  .runner-status.error {
    border-color: var(--spectrum-global-color-red-400);
    color: var(--spectrum-global-color-red-700);
  }
  .runner-status.warning {
    border-color: var(--spectrum-global-color-orange-400);
  }
  .trusted-author-warning {
    align-items: flex-start;
    border-color: var(--spectrum-global-color-orange-400);
    background: var(--spectrum-global-color-orange-100);
    color: var(--spectrum-global-color-orange-900);
  }
  .runner-status :global(.spectrum-Body) {
    flex: 1;
  }
</style>
