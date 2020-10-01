<script>
  import { General, Users, DangerZone, APIKeys } from "./tabs"

  import { Input, TextArea, Button, Switcher } from "@budibase/bbui"
  import { SettingsIcon, CloseIcon } from "components/common/Icons/"
  import { getContext } from "svelte"
  import { post } from "builderStore/api"

  export let name = ""
  export let description = ""
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
</script>

<div class="container">
  <div class="heading">
    <i class="ri-settings-2-fill" />
    <h3>Settings</h3>
  </div>
  <Switcher headings={tabs} bind:value>
    <svelte:component this={selectedTab} />
  </Switcher>
</div>

<style>
  .container {
    padding: 30px;
    display: grid;
    grid-gap: var(--spacing-xl);
  }
  .container :global(section > header) {
    /* Fix margin defined in BBUI as L rather than XL */
    margin-bottom: var(--spacing-xl);
  }

  .heading {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .heading h3 {
    font-size: var(--font-size-xl);
    color: var(--ink);
    font-weight: 600;
    margin: 0;
  }
  .heading i {
    margin-right: var(--spacing-m);
    font-size: 28px;
    color: var(--grey-6);
  }
</style>
