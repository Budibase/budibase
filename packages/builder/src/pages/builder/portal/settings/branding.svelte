<script>
  import {
    Layout,
    Heading,
    Body,
    Divider,
    Label,
    Dropzone,
    notifications,
  } from "@budibase/bbui"
  import { auth, organisation } from "stores/portal"
  import { API } from "api"

  $: logo: $organisation.logoUrl
    ? { url: $organisation.logoUrl, type: "image", name: "Logo" }
    : null,
    async function uploadLogo(file) {
      try {
        let data = new FormData()
        data.append("file", file)
        await API.uploadLogo(data)
      } catch (error) {
        notifications.error("Error uploading logo")
      }
    }
</script>

{#if $auth.isAdmin}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M">Branding</Heading>
      <Body />
    </Layout>
    <Divider />
    <div class="fields">
      <div class="field logo">
        <Label size="L">Logo</Label>
        <div class="file">
          <Dropzone
            value={[logo]}
            on:change={e => {
              if (!e.detail || e.detail.length === 0) {
                logo = null
              } else {
                logo = e.detail[0]
              }
            }}
          />
        </div>
      </div>
    </div>
  </Layout>
{/if}

<style>
</style>
