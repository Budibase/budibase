<script lang="ts">
  export let inputRef: HTMLInputElement | undefined = undefined
  export let placeholder = ""
  export let value = ""
</script>

<input bind:this={inputRef} {placeholder} bind:value on:input />
