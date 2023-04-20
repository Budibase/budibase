<script>
  import { _ } from "../../../lang/i18n"
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { writable } from "svelte/store"
  import { auth } from "stores/portal"

  const values = writable({
    firstName: $auth.user.firstName,
    lastName: $auth.user.lastName,
  })

  const updateInfo = async () => {
    try {
      await auth.updateSelf($values)
      notifications.success($_("components.settings.ProfileModal.Information"))
    } catch (error) {
      console.error(error)
      notifications.error($_("components.settings.ProfileModal.Failed"))
    }
  }
</script>

<ModalContent
  title={$_("components.settings.ProfileModal.My profle")}
  confirmText={$_("components.settings.ProfileModal.Save")}
  onConfirm={updateInfo}
>
  <Body size="S">
    {$_("components.settings.ProfileModal.Personalise")}
  </Body>
  <Input
    disabled
    bind:value={$auth.user.email}
    label={$_("components.settings.ProfileModal.Email")}
  />
  <Input
    bind:value={$values.firstName}
    label={$_("components.settings.ProfileModal.First_name")}
  />
  <Input
    bind:value={$values.lastName}
    label={$_("components.settings.ProfileModal.Last_name")}
  />
</ModalContent>
