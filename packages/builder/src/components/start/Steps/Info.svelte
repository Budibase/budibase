<script>
  import { Input, Heading, Body } from "@budibase/bbui"
  export let validationErrors
  export let template

  let blurred = { appName: false }
</script>

{#if template}
  <Heading small black>Selected Template</Heading>
  <Body>{template.name}</Body>
{/if}
<h2>Create your web app</h2>
<div class="container">
  <Input
    on:input={() => (blurred.appName = true)}
    label="Web app name"
    name="applicationName"
    placeholder="Enter name of your web application"
    type="name"
    error={blurred.appName && validationErrors.applicationName} />
</div>

<style>
  .container {
    display: grid;
    grid-gap: 40px;
  }
</style>
