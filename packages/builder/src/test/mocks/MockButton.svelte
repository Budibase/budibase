<script lang="ts">
  export let type: HTMLButtonElement["type"] = "button"
</script>

<button {type} on:click>
  <slot />
</button>
