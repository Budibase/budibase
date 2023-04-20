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

  import { _ } from "../../../../../../lang/i18n"

  export let plugin

  const modalContext = getContext(Context.Modal)

  let deleteModal

  $: friendlyName = plugin?.schema?.schema?.friendlyName
</script>

<ModalContent
  size="M"
  title={$_(
    "pages.builder.portal.plugins._components.EditPluginModal.Plugin_details"
  )}
  showConfirmButton={false}
  showCancelButton={false}
>
  <div class="details-row">
    <Label size="M"
      >{$_(
        "pages.builder.portal.plugins._components.EditPluginModal.Name"
      )}</Label
    >
    <Input disabled value={plugin.name} />
  </div>

  <div class="details-row">
    <Label size="M"
      >{$_(
        "pages.builder.portal.plugins._components.EditPluginModal.Friendly_name"
      )}</Label
    >
    <Input disabled value={friendlyName} />
  </div>

  <div class="details-row">
    <Label size="M"
      >{$_(
        "pages.builder.portal.plugins._components.EditPluginModal.Type"
      )}</Label
    >
    <Input
      disabled
      value={plugin.schema.type.charAt(0).toUpperCase() +
        plugin.schema.type.slice(1)}
    />
  </div>
  <div class="details-row">
    <Label size="M"
      >{$_(
        "pages.builder.portal.plugins._components.EditPluginModal.Source"
      )}</Label
    >
    <Input disabled value={plugin.source || "N/A"} />
  </div>
  <div class="details-row">
    <Label size="M"
      >{$_(
        "pages.builder.portal.plugins._components.EditPluginModal.Version"
      )}</Label
    >
    <Input disabled value={plugin.version} />
  </div>
  <div class="details-row">
    <Label size="M"
      >{$_(
        "pages.builder.portal.plugins._components.EditPluginModal.License"
      )}</Label
    >
    <Input disabled value={plugin.package.license} />
  </div>
  <div class="details-row">
    <Label size="M"
      >{$_(
        "pages.builder.portal.plugins._components.EditPluginModal.Author"
      )}</Label
    >
    <Input disabled value={plugin.package.author || "N/A"} />
  </div>

  <div class="footer" slot="footer">
    <Button on:click={deleteModal.show} warning
      >{$_(
        "pages.builder.portal.plugins._components.EditPluginModal.Delete"
      )}</Button
    >
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
