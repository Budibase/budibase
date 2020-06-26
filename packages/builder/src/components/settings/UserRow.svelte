<script>
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()
  import { Input, Select, Button } from "@budibase/bbui"
  export let user
</script>

<div class="inputs">
  <Input thin bind:value={user.username} name="Name" placeholder="Username" />
  <Select bind:value={user.accessLevelId} thin>
    <option value="ADMIN">Admin</option>
    <option value="POWER_USER">Power User</option>
  </Select>
  <Button on:click={() => dispatch('save', user)}>Edit</Button>
</div>

<style>
  .inputs {
    display: grid;
    justify-items: stretch;
    grid-gap: 18px;
    grid-template-columns: 1fr 1fr 1fr;
  }
</style>
