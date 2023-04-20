<script>
  import {
    Layout,
    Divider,
    Heading,
    Body,
    Button,
    Label,
    Modal,
    Icon,
  } from "@budibase/bbui"
  import { AppStatus } from "constants"
  import { overview } from "stores/portal"
  import UpdateAppModal from "components/start/UpdateAppModal.svelte"

  import { _ } from "../../../../../../lang/i18n"

  let updatingModal

  $: app = $overview.selectedApp
  $: appUrl = `${window.origin}/app${app?.url}`
  $: appDeployed = app?.status === AppStatus.DEPLOYED
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading
      >{$_(
        "pages.builder.portal.overview.appId.name-and-url.Name_URL"
      )}</Heading
    >
    <Body
      >{$_(
        "pages.builder.portal.overview.appId.name-and-url.Edit_name_URL"
      )}</Body
    >
  </Layout>
  <Divider />

  <Layout noPadding gap="XXS">
    <Label size="L"
      >{$_("pages.builder.portal.overview.appId.name-and-url.Name")}</Label
    >
    <Body>{app?.name}</Body>
  </Layout>

  <Layout noPadding gap="XS">
    <Label size="L"
      >{$_("pages.builder.portal.overview.appId.name-and-url.Icon")}</Label
    >
    <div class="icon">
      <Icon
        size="L"
        name={app?.icon?.name || "Apps"}
        color={app?.icon?.color}
      />
    </div>
  </Layout>

  <Layout noPadding gap="XXS">
    <Label size="L"
      >{$_("pages.builder.portal.overview.appId.name-and-url.URL")}</Label
    >
    <Body>{appUrl}</Body>
  </Layout>

  <div>
    <Button
      cta
      on:click={() => {
        updatingModal.show()
      }}
      disabled={appDeployed}
      tooltip={appDeployed
        ? $_("pages.builder.portal.overview.appId.name-and-url.must_unpublish")
        : null}
      icon={appDeployed ? "HelpOutline" : null}
    >
      {$_("pages.builder.portal.overview.appId.name-and-url.Edit")}
    </Button>
  </div>
</Layout>

<Modal bind:this={updatingModal} padding={false} width="600px">
  <UpdateAppModal app={$overview.selectedApp} />
</Modal>

<style>
  .icon {
    display: flex;
    justify-content: flex-start;
  }
</style>
