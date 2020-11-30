<script>
  import { General, DangerZone, APIKeys } from "./tabs"
  import { Switcher, ModalContent } from "@budibase/bbui"

  const tabs = [
    {
      title: "General",
      key: "GENERAL",
      component: General,
    },
    {
      title: "API Keys",
      key: "API_KEYS",
      component: APIKeys,
    },
    {
      title: "Danger Zone",
      key: "DANGERZONE",
      component: DangerZone,
    },
  ]

  let value = "GENERAL"

  $: selectedTab = tabs.find(tab => tab.key === value).component
</script>

<ModalContent
  title="Settings"
  showConfirmButton={false}
  showCancelButton={false}>
  <div class="container">
    <Switcher headings={tabs} bind:value>
      <svelte:component this={selectedTab} />
    </Switcher>
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
