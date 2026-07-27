<script lang="ts">
  export let cta = false
</script>

<button type="button" data-cta={cta} on:click>
  <slot />
</button>
