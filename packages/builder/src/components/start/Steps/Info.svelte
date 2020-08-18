<script>
  import { Input } from "@budibase/bbui"
  export let validationErrors

  let blurred = { appName: false }
</script>

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
