<script>
  import { createEventDispatcher } from "svelte"
  import { Body, Select, ModalContent, notifications } from "@budibase/bbui"
  import { users } from "stores/portal"
  import { _ as t } from "svelte-i18n"

  export let app
  export let user

  const dispatch = createEventDispatcher()

  const roles = app.roles
  let options = roles
    .filter(role => role._id !== "PUBLIC")
    .map(role => ({ value: role._id, label: role.name }))
  let selectedRole = user?.roles?.[app?._id]

  async function updateUserRoles() {
    const res = await users.save({
      ...user,
      roles: {
        ...user.roles,
        [app._id]: selectedRole,
      },
    })
    if (res.status === 400) {
      notifications.error($t("failed-to-update-role"))
    } else {
      notifications.success($t("role-updated"))
      dispatch("update")
    }
  }
</script>

<ModalContent
  onConfirm={updateUserRoles}
  title={$t("update-app-role")}
  confirmText={$t("update-role")}
  cancelText={$t("cancel")}
  size="M"
  showCloseIcon={false}
>
  <Body>
    {$t("update")}
    {user.email}{$t("s-role-for")} <strong>{app.name}</strong>.
  </Body>
  <Select
    placeholder={null}
    bind:value={selectedRole}
    on:change
    {options}
    label={$t("role")}
    getOptionLabel={role => role.label}
    getOptionValue={role => role.value}
  />
</ModalContent>
