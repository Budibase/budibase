<script>
  import { General, DangerZone } from "./tabs"
  import { ModalContent, Tab, Tabs } from "@budibase/bbui"
</script>

<ModalContent
  title="Settings"
  showConfirmButton={false}
  showCancelButton={false}
>
  <div class="container">
    <Tabs selected="General">
      <Tab title="General">
        <General />
      </Tab>
      <!-- <Tab title="API Keys">
        <APIKeys />
      </Tab> -->
      <Tab title="Danger Zone">
        <DangerZone />
      </Tab>
    </Tabs>
  </div>
</ModalContent>

<style>
  .container :global(section > header) {
    /* Fix margin defined in BBUI as L rather than XL */
    margin-bottom: var(--spacing-xl);
  }
  .container :global(textarea) {
    min-height: 60px;
  }
</style>
