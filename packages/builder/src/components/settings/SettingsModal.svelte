<script>
  import { General, Users, DangerZone, APIKeys } from "./tabs"
  import { Switcher } from "@budibase/bbui"
  import { ModalTitle } from "components/common/Modal"

  const tabs = [
    {
      title: "General",
      key: "GENERAL",
      component: General,
    },
    {
      title: "Users",
      key: "USERS",
      component: Users,
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

  function hide() {}
</script>

<div class="container">
  <ModalTitle>Settings</ModalTitle>
  <Switcher headings={tabs} bind:value>
    <svelte:component this={selectedTab} />
  </Switcher>
</div>

<style>
  .container {
    display: grid;
    grid-gap: var(--spacing-xl);
  }
  .container :global(section > header) {
    /* Fix margin defined in BBUI as L rather than XL */
    margin-bottom: var(--spacing-xl);
  }
  .container :global(textarea) {
    min-height: 60px;
  }
</style>
