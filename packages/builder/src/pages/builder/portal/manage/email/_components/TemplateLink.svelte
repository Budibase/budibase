<script>
  import { goto } from "@roxi/routify"

  export let value
</script>

<span on:click={() => $goto(`./${value}`)}>{value}</span>

<style>
  span {
    text-transform: capitalize;
  }
</style>
