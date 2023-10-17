<script>
  import { DrawerContent, Drawer, Button, Icon } from "@budibase/bbui"
  import ValidationDrawer from "components/design/settings/controls/ValidationEditor/ValidationDrawer.svelte"
  export let column
  export let type

  let drawer
</script>

<Icon name="Settings" hoverable size="S" on:click={drawer.show} />
<Drawer bind:this={drawer} title="Field Validation">
  <svelte:fragment slot="description">
    "{column.name}" field validation
  </svelte:fragment>
  <Button cta slot="buttons" on:click={drawer.hide}>Save</Button>
  <DrawerContent slot="body">
    <div class="container">
      <ValidationDrawer
        slot="body"
        bind:rules={column.validation}
        fieldName={column.name}
        {type}
      />
    </div>
  </DrawerContent>
</Drawer>
