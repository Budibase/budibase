<script lang="ts">
  import { Icon } from "@budibase/bbui"

  export let title = "No production data yet"
  export let description = "Publish this table to view production data."
</script>

<div class="production-blank">
  <div class="blank-content">
    <div class="blank-icon">
      <Icon name="pulse" weight="duotone" size="44" />
    </div>
    <div class="blank-title">{title}</div>
    <div class="blank-description">{description}</div>
  </div>
</div>

<style>
  .production-blank {
    position: absolute;
    inset: 0;
    top: var(--controls-height, 50px);
    background: var(--spectrum-global-color-gray-50);
    border-top: var(--border-light);
    display: grid;
    place-items: center;
    z-index: 20;
  }
  .blank-content {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--spectrum-global-color-gray-600);
    max-width: 520px;
  }
  .blank-icon {
    color: var(--primaryColor, var(--spectrum-global-color-blue-400));
    margin-bottom: var(--spacing-xs);
  }
  .blank-title {
    font-weight: 600;
    font-size: var(--font-size-l);
    color: var(--spectrum-global-color-gray-800);
  }
  .blank-description {
    margin-top: var(--spacing-xxs);
    color: var(--grey-5);
  }
</style>
