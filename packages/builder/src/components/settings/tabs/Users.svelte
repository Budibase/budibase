<script>
  import { Input, Select, Button } from "@budibase/bbui"
  import Title from "../TabTitle.svelte"
</script>

<Title>Users</Title>
<div class="container">
  <div class="background">
    <div class="title">Create new user</div>
    <Input thin placeholder="Enter name" label="Name" />
    <Input thin placeholder="Enter Password" label="Password" />
    <div>
      <label>Access Level</label>
      <Select>
        <option value="admin">Admin</option>
        <option value="poweruser">Power User</option>
      </Select>
    </div>
    <div class="create-button">
      <Button attention>Create</Button>
    </div>
  </div>
</div>

<style>
  label {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.17;
    font: var(--ink);
    margin-bottom: 12px;
  }
  .container {
    display: grid;
    grid-gap: var(--space);
  }
  .background {
    display: grid;
    grid-gap: var(--space-md);
    position: relative;
    border-radius: 5px;
    background-color: var(--light-grey);
    padding: 12px 12px 18px 12px;
  }
  .background :global(select) {
    min-width: 100%;
    padding: 12px 9px;
    height: initial;
  }
  .create-button {
    display: flex;
    justify-content: flex-end;
  }
  .title {
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.14;
    letter-spacing: 0.14px;
    text-align: left;
    color: var(--font);
  }
</style>
