<script>
  import { Button, Input, Label, Layout, Select } from "@budibase/bbui"

  const securityOptions = [
    { label: "SSL/TLS", value: true },
    { label: "None/STARTTLS", value: false },
  ]

  let imapConfig = {
    host: "",
    secure: true,
    port: 993,
    username: "",
    password: "",
  }
</script>

<Layout noPadding gap="S">
  <Layout gap="XS" noPadding>
    <div class="form-row">
      <Label size="L">Host</Label>
      <Input bind:value={imapConfig.host} />
    </div>
    <div class="form-row">
      <Label size="L">Security type</Label>
      <Select bind:value={imapConfig.secure} options={securityOptions} />
    </div>
    <div class="form-row">
      <Label size="L">Port</Label>
      <Input type="number" bind:value={imapConfig.port} />
    </div>
    <div class="form-row">
      <Label size="L">Username</Label>
      <Input bind:value={imapConfig.username} />
    </div>
    <div class="form-row">
      <Label size="L">Password</Label>
      <Input type="password" bind:value={imapConfig.password} />
    </div>
  </Layout>

  <div class="spectrum-ButtonGroup spectrum-Settings-buttonGroup">
    <Button disabled>Save</Button>
    <Button secondary disabled>Reset</Button>
  </div>
</Layout>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
  .spectrum-Settings-buttonGroup {
    gap: var(--spectrum-global-dimension-static-size-200);
    align-items: flex-end;
  }
  .imap-placeholder {
    margin-top: var(--spacing-m);
  }
</style>
