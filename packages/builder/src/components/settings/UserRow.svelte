<script>
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()
  import { Input, Select, Button } from "@budibase/bbui"
  export let user

  let editMode = false
</script>

<div class="inputs">
  <Input
    disabled={!editMode}
    thin
    bind:value={user.username}
    name="Name"
    placeholder="Username" />
  <Select disabled={!editMode} bind:value={user.accessLevelId} thin>
    <option value="ADMIN">Admin</option>
    <option value="POWER_USER">Power User</option>
  </Select>
  {#if editMode}
    <Button
      blue
      on:click={() => {
        dispatch('save', user)
        editMode = false
      }}>
      Save
    </Button>
  {:else}
    <Button secondary on:click={() => (editMode = true)}>Edit</Button>
  {/if}
</div>

<style>
  .inputs {
    display: grid;
    justify-items: stretch;
    grid-gap: 18px;
    grid-template-columns: 1fr 1fr 1fr;
  }
</style>
