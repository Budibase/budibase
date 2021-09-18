<script>
  import { Input, notifications, ModalContent } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { views as viewsStore } from "stores/backend"
  import { tables } from "stores/backend"
  import analytics from "analytics"
  import { _ as t } from "svelte-i18n"

  let name
  let field

  $: views = $tables.list.flatMap(table => Object.keys(table.views || {}))

  function saveView() {
    if (views.includes(name)) {
      notifications.error($t("view-exists-with-name") + ` ${name}.`)
      return
    }
    viewsStore.save({
      name,
      tableId: $tables.selected._id,
      field,
    })
    notifications.success($t("view") + ` ${name} ` + $t("created"))
    analytics.captureEvent("View Created", { name })
    $goto(`../../view/${name}`)
  }
</script>

<ModalContent
  cancelText={$t("cancel")}
  title={$t("create-view")}
  confirmText={$t("create-view")}
  onConfirm={saveView}
>
  <Input label={$t("view-name")} thin bind:value={name} />
</ModalContent>
