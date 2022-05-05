<script>
  import { Layout, Divider, Heading, Body, Page, Button } from "@budibase/bbui"

  const selfHostPath =
    "https://docs.budibase.com/docs/hosting-methods#self-host-budibase"
</script>

<div class="self-host-tab">
  <Page wide={false}>
    <Layout noPadding>
      <Layout gap="XS" noPadding>
        <Heading>Self-host Budibase</Heading>
        <Divider />
        <Body>
          <p>
            Self-host Budibase for free to get unlimited apps and more - and it
            only takes a few minutes!
          </p>
          <div class="page-action">
            <Button
              cta
              on:click={() => {
                window.open(selfHostPath, "_blank")
              }}>Self-host Budibase</Button
            >
          </div>
        </Body>
      </Layout>
    </Layout>
  </Page>
</div>

<style>
  .page-action {
    padding-top: var(--spacing-xl);
  }
</style>
