<script>
  import Input from "../Form/Input.svelte"
  let value = ""
</script>

<Input label="Your Name" bind:value />

<style>
  p {
    font-size: var(--font-size-m);
    margin: 0;
    font-family: var(--font-sans);
    font-weight: 400;
    line-height: 1.5;
    color: var(--grey-7);
  }
</style>
