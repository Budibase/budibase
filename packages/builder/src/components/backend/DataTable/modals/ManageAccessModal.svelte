<script>
  import { roles, permissions as permissionsStore } from "stores/backend"
  import {
    Label,
    Input,
    Select,
    notifications,
    Body,
    ModalContent,
  } from "@budibase/bbui"
  import { capitalise } from "helpers"
  import { _ as t } from "svelte-i18n"

  export let resourceId
  export let permissions

  async function changePermission(level, role) {
    await permissionsStore.save({
      level,
      role,
      resource: resourceId,
    })

    // Show updated permissions in UI: REMOVE
    permissions = await permissionsStore.forResource(resourceId)
    notifications.success($t("updated-permissions"))
    // TODO: update permissions
    // permissions[]
  }
</script>

<ModalContent
  cancelText={$t("cancel")}
  title={$t("manage-access")}
  showCancelButton={false}
  confirmText={$t("done")}
>
  <Body size="S"
    >{$t("specify-the-minimum-access-level-role-for-this-data")}</Body
  >
  <div class="row">
    <Label extraSmall grey>{$t("level")}</Label>
    <Label extraSmall grey>{$t("role")}</Label>
    {#each Object.keys(permissions) as level}
      <Input value={capitalise(level)} disabled />
      <Select
        value={permissions[level]}
        on:change={e => changePermission(level, e.detail)}
        options={$roles}
        getOptionLabel={x => x.name}
        getOptionValue={x => x._id}
      />
    {/each}
  </div>
</ModalContent>

<style>
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--spacing-s);
  }
</style>
