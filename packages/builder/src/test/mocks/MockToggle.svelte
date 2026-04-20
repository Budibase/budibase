<script lang="ts">
  export let text = ""
  export let value = false
  export let disabled = false
</script>

<label>
  <span>{text}</span>
  <input type="checkbox" aria-label={text} bind:checked={value} {disabled} />
</label>
