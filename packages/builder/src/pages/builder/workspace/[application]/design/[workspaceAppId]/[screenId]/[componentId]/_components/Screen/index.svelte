<script>
  import GeneralPanel from "./GeneralPanel.svelte"
  import StylingPanel from "./StylingPanel.svelte"
  import { selectedScreen } from "@/stores/builder"
  import Panel from "@/components/design/Panel.svelte"
  import { Layout, ActionButton } from "@budibase/bbui"
  import { capitalise } from "@/helpers"

  const tabs = ["settings", "styles"]
  let section = "settings"

  $: $selectedScreen, (section = "settings")
</script>

{#if $selectedScreen}
  <Panel
    title={$selectedScreen.routing.route}
    icon={$selectedScreen.routing.route === "/" ? "house" : "browser"}
    borderLeft
    wide
  >
    <span slot="panel-header-content">
      <div class="settings-tabs">
        {#each tabs as tab}
          <ActionButton
            size="M"
            quiet
            selected={section === tab}
            on:click={() => (section = tab)}
          >
            {capitalise(tab)}
          </ActionButton>
        {/each}
      </div>
    </span>
    {#if section === "settings"}
      <Layout gap="XS" paddingX="XL" paddingY="XL">
        <GeneralPanel />
      </Layout>
    {/if}
    {#if section === "styles"}
      <StylingPanel />
    {/if}
  </Panel>
{/if}

<style>
  .settings-tabs {
    display: flex;
    gap: var(--spacing-xs);
    padding: 0 var(--spacing-l);
    padding-bottom: var(--spacing-l);
  }
</style>
