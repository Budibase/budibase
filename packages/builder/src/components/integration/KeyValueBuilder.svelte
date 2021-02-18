<script>
  import { Input } from "@budibase/bbui"

  export let object = {}

  let fields = Object.entries(object).map(([name, value]) => ({ name, value }))

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
    <Input placeholder="Key" outline thin bind:value={field.name} />
    <Input placeholder="Value" outline thin bind:value={field.value} />
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
    margin-bottom: var(--spacing-m);
  }

  .ri-close-circle-fill,
  .ri-add-circle-fill {
    cursor: pointer;
  }
</style>
