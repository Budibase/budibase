<script>
  import { Layout, Heading, Body, Divider, Button } from "@budibase/bbui"
  import { store } from "builderStore"
  import clientPackage from "@budibase/client/package.json"
  import VersionModal from "components/deploy/VersionModal.svelte"

  import { _ } from "../../../../../../lang/i18n"

  let versionModal

  $: updateAvailable = clientPackage.version !== $store.version
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading
      >{$_("pages.builder.portal.overview.appId.version.Version")}</Heading
    >
    <Body
      >{$_("pages.builder.portal.overview.appId.version.current_version")}</Body
    >
  </Layout>
  <Divider />
  {#if updateAvailable}
    <Body>
      {$_("pages.builder.portal.overview.appId.version.currently_using")}
      <strong>{$store.version}</strong>
      {$_("pages.builder.portal.overview.appId.version.but_version")}
      <strong>{clientPackage.version}</strong>
      {$_("pages.builder.portal.overview.appId.version.is_available")}
      <br />
      {$_("pages.builder.portal.overview.appId.version.Updates_fixes")}
    </Body>
    <div>
      <Button cta on:click={versionModal.show}
        >{$_("pages.builder.portal.overview.appId.version.Update_app")}</Button
      >
    </div>
  {:else}
    <Body>
      {$_("pages.builder.portal.overview.appId.version.version")}
      <strong>{$store.version}</strong>.
      <br />
      {$_("pages.builder.portal.overview.appId.version.latest!")}
    </Body>
    <div>
      <Button secondary on:click={versionModal.show}
        >{$_("pages.builder.portal.overview.appId.version.Revert_app")}</Button
      >
    </div>
  {/if}
</Layout>

<VersionModal bind:this={versionModal} hideIcon={true} />
