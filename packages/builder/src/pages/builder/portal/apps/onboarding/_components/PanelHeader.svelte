<script>
  import { Heading, Body } from "@budibase/bbui"

  export let title = ""
  export let subtitle = ""
</script>

<div class="header">
  <img alt="Budibase Logo" class="budibaseLogo" src="/builder/bblogo.png" />
  <Heading>{title}</Heading>
  <Body>{subtitle}</Body>
</div>

<style>
  .header {
    margin-bottom: 20px;
  }
  .budibaseLogo {
    width: 42px;
    margin-bottom: 20px;
  }
</style>
