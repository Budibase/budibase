<script>
  import { goto } from "@roxi/routify"
  import { Body, ModalContent, notifications } from "@budibase/bbui"

  import { users } from "stores/portal"

  import { _ } from "../../../../../../../lang/i18n"

  export let user

  async function deleteUser() {
    try {
      await users.delete(user._id)
      notifications.success(
        `${$_(
          "pages.builder.portal.users.users._components.DeleteUserModal.User"
        )} ${user?.email} ${$_(
          "pages.builder.portal.users.users._components.DeleteUserModal.deleted"
        )}.`
      )
      $goto("./")
    } catch (error) {
      notifications.error(
        $_(
          "pages.builder.portal.users.users._components.DeleteUserModal.Error_deleting"
        )
      )
    }
  }
</script>

<ModalContent
  warning
  onConfirm={deleteUser}
  title={$_(
    "pages.builder.portal.users.users._components.DeleteUserModal.Delete_User"
  )}
  confirmText={$_(
    "pages.builder.portal.users.users._components.DeleteUserModal.Delete_User"
  )}
  cancelText={$_(
    "pages.builder.portal.users.users._components.DeleteUserModal.Cancel"
  )}
  showCloseIcon={false}
>
  <Body>
    {$_(
      "pages.builder.portal.users.users._components.DeleteUserModal.want_delete"
    )} <strong>{user?.email}</strong>
  </Body>
</ModalContent>
