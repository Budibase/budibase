<script>
  import { goto } from "@roxi/routify"
  import { database } from "stores/backend"
  import { automationStore } from "builderStore"
  import { notifications } from "@budibase/bbui"
  import { Icon, Input, ModalContent } from "@budibase/bbui"
  import analytics from "analytics"
  import { _ as t } from "svelte-i18n"

  let name

  $: valid = !!name
  $: instanceId = $database._id

  async function createAutomation() {
    await automationStore.actions.create({
      name,
      instanceId,
    })
    notifications.success(`${$t("automation")} ${name} ${$t("created")}.`)
    $goto(`./${$automationStore.selectedAutomation.automation._id}`)
    analytics.captureEvent($t("automation-created"), { name })
  }
</script>

<ModalContent
  title={$t("create-automation")}
  confirmText={$t("create-0")}
  size="L"
  onConfirm={createAutomation}
  disabled={!valid}
>
  <Input bind:value={name} label={$t("name")} />
  <a
    slot="footer"
    target="_blank"
    href="https://docs.budibase.com/automate/introduction-to-automate"
  >
    <Icon name="InfoOutline" />
    <span>{$t("learn-about-automations")}</span>
  </a>
</ModalContent>

<style>
  a {
    color: var(--ink);
    font-size: 14px;
    vertical-align: middle;
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  a span {
    text-decoration: underline;
    margin-left: var(--spectrum-alias-item-padding-s);
  }
</style>
