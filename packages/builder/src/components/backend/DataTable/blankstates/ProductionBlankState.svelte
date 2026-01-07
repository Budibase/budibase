<script lang="ts">
  import { Button } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  export let title = "To view your production table:"
  export let description = ""
  export let publishing = false
  export let canSeed = true
  let loadingAction: "publish" | "seed" | null = null
  let publishCycleStarted = false
  let loading = false
  let publishLoading = false
  let seedLoading = false

  $: loading = publishing || loadingAction !== null
  $: publishLoading =
    loading && (loadingAction === null || loadingAction === "publish")
  $: seedLoading =
    loading && (loadingAction === null || loadingAction === "seed")
  $: {
    if (publishing) {
      publishCycleStarted = true
    } else if (publishCycleStarted && loadingAction) {
      loadingAction = null
      publishCycleStarted = false
    }
  }

  const dispatch = createEventDispatcher()

  const publishEmpty = () => {
    if (loading) {
      return
    }
    loadingAction = "publish"
    dispatch("publish")
  }

  const seedAndPublish = () => {
    if (loading || !canSeed) {
      return
    }
    loadingAction = "seed"
    dispatch("seedPublish")
  }
</script>

<div class="production-blank">
  <div class="blank-content card-stack">
    <div class="blank-header">{title}</div>
    {#if description}
      <div class="blank-description">{description}</div>
    {/if}

    <div class="card">
      <div class="card-title">Publish</div>
      <div class="card-body">
        <div class="card-text">
          Publish Dev schema to Prod (without copying any data).
        </div>
        <Button disabled={loading} on:click={publishEmpty}>
          <div class="button-content" aria-live="polite">
            {#if publishLoading}
              <span class="spinner" aria-hidden="true"></span>
            {/if}
            <span>{publishLoading ? "Publishing..." : "Publish"}</span>
          </div>
        </Button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Seed and Publish</div>
      <div class="card-body">
        <div class="card-text">
          Publish Dev schema and copy Dev rows into Prod.
        </div>
        <div class="card-text">
          This can only be done once when there is no production table.
        </div>
        <Button
          secondary
          disabled={loading || !canSeed}
          on:click={seedAndPublish}
        >
          <div class="button-content" aria-live="polite">
            {#if seedLoading}
              <span class="spinner" aria-hidden="true"></span>
            {/if}
            <span
              >{seedLoading
                ? "Seeding & Publishing..."
                : "Seed & Publish"}</span
            >
          </div>
        </Button>
      </div>
    </div>
  </div>
</div>

<style>
  .production-blank {
    position: absolute;
    inset: 0;
    top: var(--controls-height, 50px);
    background: var(--spectrum-alias-background-color-primary);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: grid;
    place-items: center;
    z-index: 20;
    padding-bottom: 10rem;
  }
  .blank-content {
    color: var(--spectrum-global-color-gray-50);
    max-width: 560px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .card-stack {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    margin: 0 auto;
  }
  .blank-header {
    font-weight: 600;
    font-size: var(--font-size-l);
    color: var(--spectrum-global-color-gray-900);
  }
  .blank-description {
    color: var(--spectrum-global-color-gray-900);
    font-size: 14px;
    line-height: 1.5;
  }
  .card {
    background: var(--spectrum-alias-background-color-primary);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }
  .card-title {
    padding: var(--spacing-m) var(--spacing-l);
    background: #080808;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    letter-spacing: 0.1px;
  }
  .card-body {
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
  .card-body :global(.spectrum-Button) {
    align-self: flex-start;
    width: auto;
  }
  .card-text {
    color: var(--spectrum-global-color-gray-900);
    line-height: 1.5;
  }
  .production-blank :global(.spectrum-Button.is-disabled) {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .button-content {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .spinner {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid var(--spectrum-global-color-gray-400);
    border-top-color: var(--spectrum-global-color-gray-900);
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
