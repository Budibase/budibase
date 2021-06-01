<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Divider,
    Label,
    Input,
    Toggle,
    Dropzone,
    notifications,
  } from "@budibase/bbui"
  import { auth, organisation } from "stores/portal"
  import { post, get } from "builderStore/api"
  import analytics from "analytics"
  import { writable } from "svelte/store"
  import { redirect } from "@roxi/routify"

  // Only admins allowed here
  $: {
    if (!$auth.isAdmin) {
      $redirect("../../portal")
    }
  }

  async function updateBudibase() {
    try {
      notifications.info("Updating budibase..")
      const response = await fetch("/v1/update", {
        headers: {
          Authorization: "Bearer budibase",
        },
      })
      notifications.success("Your budibase installation is up to date.")
    } catch (err) {
      notifications.error(`Error installing budibase update ${err}`)
    }
  }
</script>

{#if $auth.isAdmin}
  <Layout>
    <Layout gap="XS" noPadding>
      <Heading size="M">Update</Heading>
      <Body>
        Keep your budibase installation up to date to take advantage of the
        latest features, security updates and much more.
      </Body>
    </Layout>
    <Divider size="S" />
    <div class="fields">
      <div class="field">
        <Button cta on:click={updateBudibase}>Check For Updates</Button>
      </div>
    </div>
  </Layout>
{/if}

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 33% 1fr;
    align-items: center;
  }
</style>
