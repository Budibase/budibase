<script>
  import Form from "@svelteschool/svelte-forms"
  import { Input } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()
  let values
  export let fields

  const handleSubmit = () => {
    dispatch("submit", values)
    values = {}
  }
</script>

<Form bind:values>
  {#each fields as { field, hide }}
    {#if !hide}
      <Input thin placeholder="Enter {field}" name={field} />
    {/if}
  {/each}
  <button on:click|preventDefault={handleSubmit}>Add row</button>
</Form>
