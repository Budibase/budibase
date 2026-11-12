<script lang="ts">
  let { value = $bindable("") }: { value?: string } = $props()
</script>

<textarea aria-label="Function source" bind:value></textarea>
