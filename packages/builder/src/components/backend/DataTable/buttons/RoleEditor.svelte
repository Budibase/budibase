<script>
  import {
    Button,
    Modal,
    ModalContent,
    Drawer,
    DrawerContent,
  } from "@budibase/bbui"

  let drawer

  $: invalid = false

  const save = async () => {
    drawer.hide()
  }
</script>

<Button secondary icon="UsersLock" on:click on:click={drawer.show}>
  Role editor
</Button>

<Drawer
  bind:this={drawer}
  title="Role editor"
  on:drawerHide
  on:drawerShow
  forceModal
>
  <Button disabled={invalid} cta slot="buttons" on:click={save}>Save</Button>
  <DrawerContent slot="body">asdasdasd</DrawerContent>
</Drawer>
