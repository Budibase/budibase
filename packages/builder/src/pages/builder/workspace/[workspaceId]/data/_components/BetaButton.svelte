<script>
  import { Button } from "@budibase/bbui"
</script>

<div class="beta">
  <Button
    size="M"
    cta
    on:click={() => window.open("https://t.maze.co/165900794", "_blank")}
  >
    Give Feedback
  </Button>
</div>

<style>
  .beta {
    position: absolute;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    z-index: 10;
  }
  .beta :global(.spectrum-Button) {
    background: var(--spectrum-global-color-magenta-400);
    border-color: var(--spectrum-global-color-magenta-400);
  }
</style>
