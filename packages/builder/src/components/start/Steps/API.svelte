<script>
  import { Input } from "@budibase/bbui"
  export let validationErrors

  let blurred = { api: false }
</script>

<h2>Setup your API Key</h2>
<div class="container">
  <Input
    on:input={() => (blurred.api = true)}
    label="API Key"
    name="apiKey"
    placeholder="Enter your API Key"
    type="password"
    error={blurred.api && validationErrors.apiKey} />
  <a target="_blank" href="https://portal.budi.live/">Get API Key</a>
</div>

<style>
  .container {
    display: grid;
    grid-gap: 40px;
  }
</style>
