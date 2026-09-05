<script lang="ts">
  export let href: string
</script>

<a {href} on:click|preventDefault><slot /></a>
