<script>
  import { General, Permissions, Users, Integrations, DangerZone } from "./tabs"

  import { Input, TextArea, Button, Switcher } from "@budibase/bbui"
  import { SettingsIcon, CloseIcon } from "components/common/Icons/"
  import { getContext } from "svelte"
  import { post } from "builderStore/api"

  const { open, close } = getContext("simple-modal")
  export let name = ""
  export let description = ""
  const tabs = [
    {
      title: "General",
      key: "GENERAL",
      component: General,
    },
    {
      title: "Permissions",
      key: "PERMISSIONS",
      component: Permissions,
    },
    {
      title: "Users",
      key: "USERS",
      component: Users,
    },
    {
      title: "Integrations",
      key: "INTEGRATIONS",
      component: Integrations,
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
  <div class="body">
    <div class="heading">
      <span class="icon">
        <SettingsIcon />
      </span>
      <h3>Settings</h3>
    </div>
    <Switcher headings={tabs} bind:value>
      <svelte:component this={selectedTab} />
    </Switcher>
  </div>
  <div class="close-button" on:click={close}>
    <CloseIcon />
  </div>
</div>

<style>
  .container {
    position: relative;
  }

  .close-button {
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .close-button :global(svg) {
    width: 24px;
    height: 24px;
  }
  .heading {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  }
  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
  }
  .icon {
    display: grid;
    border-radius: 3px;
    align-content: center;
    justify-content: center;
    margin-right: 12px;
    height: 20px;
    width: 20px;
    padding: 10px;
    background-color: var(--blue-light);
  }
  .body {
    padding: 40px 40px 80px 40px;
    display: grid;
    grid-gap: 20px;
  }
</style>
