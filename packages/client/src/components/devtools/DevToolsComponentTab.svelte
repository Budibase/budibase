<script>
  import {
    Body,
    Layout,
    Heading,
    Button,
    TextArea,
    Tabs,
    Tab,
    Toggle,
  } from "@budibase/bbui"
  import { builderStore, devToolsStore, componentStore } from "stores"
  import DevToolsStat from "./DevToolsStat.svelte"
  import { getSettingsDefinition } from "utils/componentProps.js"

  let showEnrichedSettings = true

  $: selectedInstance = $componentStore.selectedComponentInstance
  $: settingsDefinition = getSettingsDefinition(
    $componentStore.selectedComponentDefinition
  )
  $: rawSettings = selectedInstance?.getRawSettings()
  $: settings = selectedInstance?.getSettings()

  $: {
    if (!selectedInstance) {
      builderStore.actions.selectComponent(null)
    }
  }
</script>

{#if !$builderStore.selectedComponentId}
  <Layout noPadding gap="S">
    <Heading size="XS">Please choose a component</Heading>
    <Body size="S">
      Press the button below to enable component selection, then click a
      component in your app to view what context values are available.
    </Body>
    <div>
      <Button
        cta
        on:click={() => devToolsStore.actions.setAllowSelection(true)}
      >
        Choose component
      </Button>
    </div>
  </Layout>
{:else}
  <Layout noPadding>
    <Layout noPadding gap="XS">
      <DevToolsStat
        label="Component"
        value={$componentStore.selectedComponent?._instanceName}
      />
      <DevToolsStat
        label="Type"
        value={$componentStore.selectedComponentDefinition?.name}
      />
      <DevToolsStat label="ID" value={$componentStore.selectedComponent?._id} />
    </Layout>
    <div class="buttons">
      <Button
        cta
        on:click={() => devToolsStore.actions.setAllowSelection(true)}
      >
        Change component
      </Button>
      <Button
        quiet
        secondary
        on:click={() => builderStore.actions.selectComponent(null)}
      >
        Reset
      </Button>
    </div>

    <div class="data">
      <Layout noPadding gap="XS">
        <Tabs selected="Settings">
          <Tab title="Settings">
            <div class="tab-content">
              <Layout noPadding gap="S">
                <Toggle
                  text="Show enriched settings"
                  bind:value={showEnrichedSettings}
                />
                <Layout noPadding gap="XS">
                  {#each settingsDefinition as setting}
                    <DevToolsStat
                      label={setting.label}
                      value={JSON.stringify(
                        (showEnrichedSettings ? settings : rawSettings)?.[
                          setting.key
                        ]
                      )}
                    />
                  {/each}
                </Layout>
              </Layout>
            </div>
          </Tab>
          <Tab title="Context">
            <div class="tab-content">
              <TextArea
                readonly
                label="Data context"
                value={JSON.stringify(
                  selectedInstance?.getDataContext(),
                  null,
                  2
                )}
              />
            </div>
          </Tab>
        </Tabs>
      </Layout>
    </div>
  </Layout>
{/if}

<style>
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
  }
  .data {
    margin: 0 calc(-1 * var(--spacing-xl));
  }
  .data :global(.spectrum-Textfield-input) {
    min-height: 200px !important;
    white-space: pre;
    font-size: var(--font-size-s);
  }
  .tab-content {
    padding: 0 var(--spacing-xl);
  }
</style>
