<script lang="ts">
  import {
    ActionMenu,
    Button,
    MenuItem,
    MenuSeparator,
    PopoverAlignment,
    Tag,
  } from "@budibase/bbui"
  import { getHomeTypeIcon, getHomeTypeIconColor } from "./rows"

  export let variant: "button" | "pill" = "button"
  export let portalTarget: string | undefined = undefined
  export let onCreateAgent: () => void = () => {}
  export let onCreateAutomation: () => void = () => {}
  export let onCreateApp: () => void = () => {}
  export let onCreateConnection: () => void = () => {}
  export let onCreateTable: () => void = () => {}
  export let onCreateApi: () => void = () => {}
</script>

<ActionMenu
  align={PopoverAlignment.Right}
  {portalTarget}
  animate={false}
>
  <div
    slot="control"
    class="create-menu-control"
    class:create-pill={variant === "pill"}
  >
    {#if variant === "pill"}
      <button type="button" class="create-pill-btn">
        <span class="create-pill-icon">+</span>
        Create
      </button>
    {:else}
      <Button size="M" icon="plus" primary>Create</Button>
    {/if}
  </div>

  <MenuItem
    icon={getHomeTypeIcon("agent")}
    iconColour={getHomeTypeIconColor("agent")}
    iconWeight="fill"
    on:click={onCreateAgent}
  >
    Agent
    <div slot="right">
      <Tag emphasized>Beta</Tag>
    </div>
  </MenuItem>
  <MenuItem
    icon={getHomeTypeIcon("automation")}
    iconColour={getHomeTypeIconColor("automation")}
    iconWeight="fill"
    on:click={onCreateAutomation}
  >
    Automation
  </MenuItem>
  <MenuItem
    icon={getHomeTypeIcon("app")}
    iconColour={getHomeTypeIconColor("app")}
    iconWeight="fill"
    on:click={onCreateApp}
  >
    App
  </MenuItem>

  <MenuSeparator />
  <MenuItem icon="cube" on:click={onCreateConnection}>Connection</MenuItem>
  <MenuItem icon="grid-nine" on:click={onCreateTable}>Table</MenuItem>
  <MenuItem icon="globe-simple" on:click={onCreateApi}>API request</MenuItem>
</ActionMenu>

<style>
  .create-pill-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 15px 7px;
    border: none;
    border-radius: 100px;
    background: var(--spectrum-global-color-gray-900);
    color: var(--background-alt);
    font-family: var(--font-sans);
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
    cursor: pointer;
    transition: opacity 130ms ease-out;
  }

  .create-pill-btn:hover {
    opacity: 0.9;
  }

  .create-pill-icon {
    font-size: 16px;
    line-height: 1;
  }

  .create-menu-control.create-pill {
    display: flex;
  }
</style>
