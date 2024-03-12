<script>
  import { Popover, Heading, Body, ActionButton } from "@budibase/bbui"
  import { getContext, onMount } from "svelte"

  let anchor
  let open = false

  $: activeButton = "Dev"
  $: isProdDisabled = true
  const { API } = getContext("grid")

  function handleClick(button) {
    if (button === "Prod" && isProdDisabled) {
      return
    }
    activeButton = button
  }

  const isAppDeployed = async () => {
    const appId = API.getAppID()
    const apps = await API.getApps()

    let deployed =
      apps.filter(app => appId === app.appId && app.deployed === true).length >
      0
  }

  onMount(async () => {
    isAppDeployed()
  })
</script>

<div class="toggle-container">
  <div bind:this={anchor} class="icon">
    <ActionButton
      emphasized={true}
      on:click={() => (open = true)}
      icon="Info"
      quiet
    />
  </div>

  <div class="toggle">
    <button
      class="toggle-btn"
      class:active={activeButton === "Dev"}
      on:click={() => handleClick("Dev")}
    >
      Dev
    </button>
    <button
      class="toggle-btn"
      class:active={activeButton === "Prod"}
      on:click={() => handleClick("Prod")}
      disabled={isProdDisabled}
      class:disabled={isProdDisabled}
    >
      Prod
    </button>
  </div>

  <div class="vertical-line" />

  <Popover bind:open {anchor} align="left">
    <div class="content">
      <Heading size="XS">Environments</Heading>
      <Heading size="XXS">Development</Heading>
      <Body size="S">
        You can create and edit table schemas in Development before publishing
        to production. Rows will not sync to production
      </Body>
      <Heading size="XXS">Production</Heading>
      <Body size="S"
        >You can edit rows on any tables that have been published to Production</Body
      >
    </div>
  </Popover>
</div>

<style>
  .toggle-container {
    display: inline-flex;
    align-items: center;
  }

  .toggle {
    border: 1px var(--background-alt);
    display: inline-flex;
    align-items: center;
    background-color: var(--spectrum-global-color-gray-200);
    border-radius: 20px;
    padding: 3px;
    font-size: 14px;
  }

  .toggle-btn {
    border: 1px solid transparent;
    background: none;
    color: var(--text);
    padding: 4px 12px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.5s ease, border-color 0.5s ease;
  }

  .toggle-btn.active:first-child {
    background-color: var(--background-alt);
    border-color: var(--purple);
  }

  .toggle-btn.active:last-child {
    background-color: var(--background-alt);
    border-color: var(--bb-coral);
  }

  .toggle-btn.disabled {
    opacity: 0.5;
  }

  .vertical-line {
    width: 2px;
    height: 30px;
    background-color: var(--spectrum-global-color-gray-200);
    margin-left: 8px;
  }

  .icon {
    display: flex;
  }

  .content {
    width: 300px;
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }
</style>
