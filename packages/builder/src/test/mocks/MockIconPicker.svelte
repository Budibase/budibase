<script lang="ts">
  export let value = ""
  export let disabled = false
</script>

<label>
  <span>Icon</span>
  <input aria-label="Icon" bind:value {disabled} />
</label>
