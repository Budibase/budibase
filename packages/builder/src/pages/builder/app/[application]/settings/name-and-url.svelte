<script>
import { Body, Divider, Heading, Layout } from "@budibase/bbui"
import UpdateAppForm from "components/common/UpdateAppForm.svelte"
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Name and URL</Heading>
    <Body>Edit your app's name and URL</Body>
  </Layout>
  <Divider />
  <UpdateAppForm />
</Layout>
