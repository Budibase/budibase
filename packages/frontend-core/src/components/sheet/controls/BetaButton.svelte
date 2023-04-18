<script>
  import { Button } from "@budibase/bbui"
</script>

<div class="beta-background" />
<div class="beta">
  Enjoying the spreadsheet?
  <Button size="M" cta>Give Feedback</Button>
</div>

<style>
  .beta {
    position: absolute;
    bottom: 32px;
    right: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
  .beta :global(.spectrum-Button) {
    background: var(--spectrum-global-color-magenta-400);
    border-color: var(--spectrum-global-color-magenta-400);
  }
  .beta-background {
    z-index: 0;
    pointer-events: none;
    position: absolute;
    bottom: -205px;
    right: -105px;
    width: 1400px;
    height: 320px;
    transform: rotate(-20deg);
    background: linear-gradient(
      to top,
      var(--cell-background) 20%,
      transparent
    );
  }
</style>
