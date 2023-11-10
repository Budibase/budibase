<script>
  import {
    Modal,
    ModalContent,
    Button,
    Label,
    Input,
    Context,
  } from "@budibase/bbui"
  import { getContext } from "svelte"
  import DeletePluginModal from "./DeletePluginModal.svelte"

  export let plugin

  const modalContext = getContext(Context.Modal)

  let deleteModal

  $: friendlyName = plugin?.schema?.schema?.friendlyName
</script>

<ModalContent
  size="M"
  title="Plugin details"
  showConfirmButton={false}
  showCancelButton={false}
>
  <div class="details-row">
    <Label size="M">Name</Label>
    <Input disabled value={plugin.name} />
  </div>

  <div class="details-row">
    <Label size="M">Friendly name</Label>
    <Input disabled value={friendlyName} />
  </div>

  <div class="details-row">
    <Label size="M">Type</Label>
    <Input
      disabled
      value={plugin.schema.type.charAt(0).toUpperCase() +
        plugin.schema.type.slice(1)}
    />
  </div>
  <div class="details-row">
    <Label size="M">Source</Label>
    <Input disabled value={plugin.source || "N/A"} />
  </div>
  <div class="details-row">
    <Label size="M">Version</Label>
    <Input disabled value={plugin.version} />
  </div>
  <div class="details-row">
    <Label size="M">License</Label>
    <Input disabled value={plugin.package.license} />
  </div>
  <div class="details-row">
    <Label size="M">Author</Label>
    <Input disabled value={plugin.package.author || "N/A"} />
  </div>

  <div class="footer" slot="footer">
    <Button on:click={deleteModal.show} warning>Delete</Button>
  </div>
</ModalContent>

<Modal bind:this={deleteModal}>
  <DeletePluginModal {plugin} on:deleted={modalContext.hide} />
</Modal>

<style>
  .details-row {
    display: grid;
    grid-template-columns: 70px 1fr;
    grid-gap: var(--spacing-l) var(--spacing-l);
    align-items: center;
  }
  .footer {
    display: flex;
    gap: var(--spacing-l);
  }
</style>
