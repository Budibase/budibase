<script>
  import "@spectrum-css/tags/dist/index-vars.css"
</script>

<div class="spectrum-Tags" role="list" aria-label="list">
  <slot />
</div>

<style>
  .spectrum-Tags {
    margin-top: -8px;
    margin-left: -4px;
  }
  .spectrum-Tags :global(.spectrum-Tags-item) {
    margin: 8px 0 0 4px !important;
  }
</style>
