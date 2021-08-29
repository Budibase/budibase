<script>
  import { notifications } from "@budibase/bbui"
  import { store } from "builderStore"
  import { Input, ModalContent } from "@budibase/bbui"
  import { _ as t } from "svelte-i18n"

  let name = ""

  async function save() {
    try {
      await store.actions.layouts.save({ name })
      notifications.success($t('layout') + ` ${name} ` + $t('created-successfully'))
    } catch (err) {
      notifications.error($t('error-creating-layout') + ` ${name}.`)
    }
  }
</script>

<ModalContent title={ $t('create-layout') } confirmText={ $t('create') } onConfirm={save}>
  <Input thin label={ $t('name') } bind:value={name} />
</ModalContent>
