<script>
  import {
    ColorPicker,
    Body,
    ModalContent,
    Input,
    IconPicker,
  } from "@budibase/bbui"

  import { _ } from "../../../../../../../lang/i18n"

  export let group
  export let saveGroup
</script>

<ModalContent
  onConfirm={() => saveGroup(group)}
  size="M"
  title={group?._rev
    ? $_(
        "pages.builder.portal.users.groups._components.CreateEditGroupModal.Edit_group"
      )
    : $_(
        "pages.builder.portal.users.groups._components.CreateEditGroupModal.Create_group"
      )}
  confirmText={$_(
    "pages.builder.portal.users.groups._components.CreateEditGroupModal.Save"
  )}
>
  <Input
    bind:value={group.name}
    label={$_(
      "pages.builder.portal.users.groups._components.CreateEditGroupModal.Name"
    )}
  />
  <div class="modal-format">
    <div class="modal-inner">
      <Body size="XS"
        >{$_(
          "pages.builder.portal.users.groups._components.CreateEditGroupModal.Icon"
        )}</Body
      >
      <div class="modal-spacing">
        <IconPicker
          bind:value={group.icon}
          on:change={e => (group.icon = e.detail)}
        />
      </div>
    </div>
    <div class="modal-inner">
      <Body size="XS"
        >{$_(
          "pages.builder.portal.users.groups._components.CreateEditGroupModal.Color"
        )}</Body
      >
      <div class="modal-spacing">
        <ColorPicker
          bind:value={group.color}
          on:change={e => (group.color = e.detail)}
        />
      </div>
    </div>
  </div>
</ModalContent>

<style>
  .modal-format {
    display: flex;
    justify-content: space-between;
    width: 40%;
  }

  .modal-inner {
    display: flex;
    align-items: center;
  }

  .modal-spacing {
    margin-left: var(--spacing-l);
  }
</style>
