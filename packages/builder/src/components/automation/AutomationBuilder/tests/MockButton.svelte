<script lang="ts">
  export let ariaLabel: string | undefined = undefined
</script>

<button type="button" aria-label={ariaLabel} on:click>
  <slot />
</button>
