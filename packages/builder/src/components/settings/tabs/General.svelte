<script>
  import { Input, TextArea, Button } from "@budibase/bbui"
  import Title from "../TabTitle.svelte"
</script>

<Title>General</Title>
<div class="container">
  <div class="background">
    <Input thin edit placeholder="Enter your name" label="Name" />
  </div>
  <div class="background">
    <TextArea thin edit placeholder="Enter your name" label="Name" />
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-gap: var(--space);
  }
  .background {
    border-radius: 5px;
    background-color: var(--light-grey);
    padding: 12px 12px 18px 12px;
  }
</style>
