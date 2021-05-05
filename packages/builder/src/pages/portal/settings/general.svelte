<script>
  import {
    Layout,
    Heading,
    Body,
    Divider,
    Label,
    Input,
    Toggle,
    Dropzone,
  } from "@budibase/bbui"
</script>

<div class="container">
  <Layout noPadding>
    <div class="intro">
      <Heading size="M">General</Heading>
      <Body
        >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic vero, aut
        culpa provident sunt ratione! Voluptas doloremque, dicta nisi velit
        perspiciatis, ratione vel blanditiis totam, nam voluptate repellat
        aperiam fuga!</Body
      >
    </div>
    <Divider size="S" />
    <div class="information">
      <Heading size="S">Information</Heading>
      <Body>Here you can update your logo and organization name.</Body>
      <div class="fields">
        <div class="field">
          <Label>Organization name</Label>
          <Input />
        </div>
        <div class="field">
          <Label>Logo</Label>
          <div class="file">
            <Dropzone />
          </div>
        </div>
      </div>
    </div>
    <Divider size="S" />
    <div class="analytics">
      <Heading size="S">Analytics</Heading>
      <Body
        >If you would like to send analytics that help us make Budibase better,
        please let us know below.</Body
      >
      <div class="field">
        <Label>Send Analytics to Budibase</Label>
        <Toggle text="" />
      </div>
    </div>
  </Layout>
</div>

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 30% 1fr;
  }
  .file {
    max-width: 30ch;
  }
  .intro {
    display: grid;
  }
</style>
