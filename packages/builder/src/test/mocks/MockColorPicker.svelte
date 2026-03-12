<script lang="ts">
  export let value = ""
  export let disabled = false
</script>

<label>
  <span>Color</span>
  <input aria-label="Color" bind:value {disabled} />
</label>
