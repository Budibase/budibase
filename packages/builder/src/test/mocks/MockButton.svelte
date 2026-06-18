<script lang="ts">
  export let type = "button"
</script>

<button {type} on:click>
  <slot />
</button>
