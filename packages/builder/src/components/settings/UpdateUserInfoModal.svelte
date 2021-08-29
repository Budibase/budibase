<script>
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { writable } from "svelte/store"
  import { auth } from "stores/portal"
  import { _ as t } from "svelte-i18n"

  const values = writable({
    firstName: $auth.user.firstName,
    lastName: $auth.user.lastName,
  })

  const updateInfo = async () => {
    try {
      await auth.updateSelf($values)
      notifications.success($t("information-updated-successfully"))
    } catch (error) {
      notifications.error($t("failed-to-update-information"))
    }
  }
</script>

<ModalContent
  title={$t("update-user-information")}
  confirmText={$t("update-information")}
  onConfirm={updateInfo}
>
  <Body size="S">
    {$t("personalise-the-platform-by-adding-your-first-name-and-last-name")}
  </Body>
  <Input bind:value={$values.firstName} label={$t("first-name")} />
  <Input bind:value={$values.lastName} label={$t("last-name")} />
</ModalContent>
