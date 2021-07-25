<script>
  import {
    TextArea,
    DetailSummary,
    ActionButton,
    Drawer,
    DrawerContent,
    Layout,
    Body,
    Button,
  } from "@budibase/bbui"
  import { store } from "builderStore"

  export let componentInstance

  let tempValue
  let drawer

  const openDrawer = () => {
    tempValue = componentInstance?._styles?.custom
    drawer.show()
  }

  const save = () => {
    store.actions.components.updateCustomStyle(tempValue)
    drawer.hide()
  }
</script>

<DetailSummary
  name={`Custom CSS${componentInstance?._styles?.custom ? " *" : ""}`}
  collapsible={false}
>
  <div>
    <ActionButton on:click={openDrawer}>Edit custom CSS</ActionButton>
  </div>
</DetailSummary>
{#key componentInstance?._id}
  <Drawer bind:this={drawer} title="Custom CSS">
    <Button cta slot="buttons" on:click={save}>Save</Button>
    <DrawerContent slot="body">
      <div class="content">
        <Layout gap="S" noPadding>
          <Body size="S">Custom CSS overrides all other component styles.</Body>
          <TextArea bind:value={tempValue} placeholder="Enter some CSS..." />
        </Layout>
      </div>
    </DrawerContent>
  </Drawer>
{/key}

<style>
  .content {
    max-width: 800px;
    margin: 0 auto;
  }
  .content :global(textarea) {
    font-family: monospace;
    min-height: 240px !important;
    font-size: var(--font-size-s);
  }
</style>
