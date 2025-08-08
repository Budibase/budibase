<script lang="ts">
  // Invisible anchor node used as a target for edges that only need an action label
  export let id
  export let data
</script>

<div class="anchor" />

<style>
  .anchor {
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }
</style>
