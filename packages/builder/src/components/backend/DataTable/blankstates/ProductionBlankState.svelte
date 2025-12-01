<script lang="ts">
  import { Button } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  export let title = "To view your production table:"
  export let description = ""
  export let publishing = false
  export let canSeed = true

  const dispatch = createEventDispatcher()

  const publishEmpty = () => {
    if (publishing) {
      return
    }
    dispatch("publish")
  }

  const seedAndPublish = () => {
    if (publishing) {
      return
    }
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
          Publish Dev schema to Prod (no data copied).
        </div>
        <Button disabled={publishing} on:click={publishEmpty}>Publish</Button>
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
          disabled={publishing || !canSeed}
          on:click={seedAndPublish}
        >
          Seed &amp; Publish
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
  }
  .blank-content {
    color: var(--spectrum-global-color-gray-50);
    max-width: 560px;
    width: 100%;
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
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
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
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
  .card-text {
    color: var(--spectrum-global-color-gray-900);
    line-height: 1.5;
  }
  .card-subtext {
    color: var(--spectrum-global-color-gray-900);
    font-size: 13px;
  }
</style>
