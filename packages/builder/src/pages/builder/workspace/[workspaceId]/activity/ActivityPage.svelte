<script lang="ts">
  import type { Snippet } from "svelte"

  let { children }: { children: Snippet } = $props()
</script>

<div class="activity-page">
  <div class="activity-page-content">
    {@render children()}
  </div>
</div>

<style>
  .activity-page {
    display: flex;
    justify-content: center;
    min-height: 100%;
    padding: 0 var(--spacing-l);
    box-sizing: border-box;
    background: var(--background-alt);
  }

  .activity-page-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    max-width: 1280px;
    padding: 20px 0 32px;
  }

  @media (max-width: 720px) {
    .activity-page-content {
      padding: 20px 0 24px;
    }
  }
</style>
