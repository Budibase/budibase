<script lang="ts">
  import { Icon } from "@budibase/bbui"

  interface Props {
    thinking?: boolean
    label?: string
    interactive?: boolean
    expanded?: boolean
    content?: string
    ontoggle?: () => void
  }

  let {
    thinking = false,
    label = "Thought",
    interactive = false,
    expanded = false,
    content = "",
    ontoggle,
  }: Props = $props()

  const handleToggle = () => {
    if (!interactive) {
      return
    }

    ontoggle?.()
  }
</script>

<div class="reasoning-part">
  <button
    class="reasoning-toggle"
    class:reasoning-toggle-static={!interactive}
    type="button"
    onclick={handleToggle}
    aria-disabled={!interactive}
    tabindex={interactive ? undefined : -1}
  >
    <span class="reasoning-icon" class:shimmer={thinking}>
      <Icon
        name="brain"
        size="M"
        color="var(--spectrum-global-color-gray-600)"
      />
    </span>
    <span class="reasoning-label" class:shimmer={thinking}>{label}</span>
  </button>
  {#if expanded && content}
    <div class="reasoning-content">{content}</div>
  {/if}
</div>

<style>
  .reasoning-part {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .reasoning-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }

  .reasoning-toggle-static {
    cursor: default;
    pointer-events: none;
  }

  .reasoning-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .reasoning-label {
    font-size: 13px;
    color: var(--spectrum-global-color-gray-600);
  }

  .reasoning-label.shimmer,
  .reasoning-icon.shimmer {
    animation: shimmer 2s ease-in-out infinite;
  }

  .reasoning-content {
    font-size: 13px;
    color: var(--spectrum-global-color-gray-600);
    font-style: italic;
    line-height: 1.4;
  }

  @keyframes shimmer {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
</style>
