<script>
  import { getContext } from "svelte"
  import { Layout, Heading, Tabs, Tab, Icon } from "@budibase/bbui"
  import DevToolsStatsTab from "./DevToolsStatsTab.svelte"
  import DevToolsComponentTab from "./DevToolsComponentTab.svelte"
  import { devToolsStore } from "stores"

  const context = getContext("context")
</script>

<div
  class="devtools"
  class:hidden={!$devToolsStore.visible}
  class:mobile={$context.device.mobile}
>
  {#if $devToolsStore.visible}
    <Layout noPadding gap="XS">
      <div class="header">
        <Heading size="XS">Budibase DevTools</Heading>
        <Icon
          hoverable
          name="Close"
          on:click={() => devToolsStore.actions.setVisible(false)}
        />
      </div>
      <Tabs selected="Application">
        <Tab title="Application">
          <div class="tab-content">
            <DevToolsStatsTab />
          </div>
        </Tab>
        <Tab title="Components">
          <div class="tab-content">
            <DevToolsComponentTab />
          </div>
        </Tab>
      </Tabs>
    </Layout>
  {/if}
</div>

<style>
  .devtools {
    background: var(--spectrum-alias-background-color-primary);
    flex: 0 0 320px;
    border-left: 1px solid var(--spectrum-global-color-gray-300);
    overflow: auto;
    transition: margin-right 300ms ease;
    margin-right: 0;
  }
  .devtools.hidden {
    margin-right: -320px;
  }
  .devtools.mobile {
    display: none;
  }

  .header {
    padding: var(--spacing-xl) var(--spacing-xl) 0 var(--spacing-xl);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .tab-content {
    padding: 0 var(--spacing-xl);
  }
  @media print {
    .devtools {
      display: none;
    }
  }
</style>
