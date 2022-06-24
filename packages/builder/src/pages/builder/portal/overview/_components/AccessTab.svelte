<script>
  import { Layout, Heading, Body, Button, List, ListItem } from "@budibase/bbui"
  import RoleSelect from "components/common/RoleSelect.svelte"
</script>

<div class="access-tab">
  <Layout>
    <div>
      <Heading>Access</Heading>
      <div class="subtitle">
        <Body size="S">
          Assign users to your app and define their access here</Body
        >
        <Button icon="User" cta>Assign users</Button>
      </div>
    </div>
    <List title="User Groups">
      <ListItem title="Design Team" icon="Brush" iconBackground="#348c6f">
        <RoleSelect autoWidth quiet value="POWER" />
      </ListItem>
      <ListItem title="Admin Team" icon="UserAdmin" iconBackground="#843c6f">
        <RoleSelect autoWidth quiet value="ADMIN" />
      </ListItem>
    </List>
    <List title="Users">
      <ListItem title="andy@gmail.com" avatar>
        <RoleSelect autoWidth quiet value="BASIC" />
      </ListItem>
      <ListItem title="jeff@gmail.com" avatar>
        <RoleSelect autoWidth quiet value="BASIC" />
      </ListItem>
      <ListItem title="tom@gmail.com" avatar>
        <RoleSelect autoWidth quiet value="BASIC" />
      </ListItem>
    </List>
  </Layout>
</div>

<style>
  .access-tab {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px;
  }
  .subtitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>
