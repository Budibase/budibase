<script>
  import { Input } from "@budibase/bbui"

  export let object = {}

  let fields = []

  $: object = fields.reduce(
    (acc, next) => ({ ...acc, [next.name]: next.value }),
    {}
  )

  function addEntry() {
    fields = [...fields, {}]
  }

  function deleteEntry(idx) {
    fields.splice(idx, 1)
    fields = fields
  }
</script>

<!-- Builds Objects with Key Value Pairs. Useful for building things like Request Headers. -->
<div class="container">
  {#each fields as field, idx}
    <Input outline thin bind:value={field.name} />
    <Input outline bind:value={field.value} />
    <i class="ri-close-circle-fill" on:click={() => deleteEntry(idx)} />
  {/each}
</div>
<i class="ri-add-circle-fill" on:click={addEntry} />

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 20px;
    grid-gap: var(--spacing-m);
    align-items: center;
  }

  .ri-close-circle-fill,
  .ri-add-circle-fill {
    cursor: pointer;
  }
</style>
