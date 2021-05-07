<script>
  import { goto } from "@roxi/routify"
  import {
    ActionButton,
    Button,
    Layout,
    Heading,
    Body,
    Divider,
    Label,
    Input,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import { fetchData } from "helperStores"

  export let userId
  let deleteUserModal

  const request = fetchData(`/api/admin/users/${userId}`)
</script>

<Layout noPadding gap="XS">
  <div class="back">
    <ActionButton on:click={() => $goto("./")} quiet size="S" icon="BackAndroid"
      >Back to users</ActionButton
    >
  </div>
  <div class="heading">
    <Layout noPadding gap="XS">
      <Heading>User: {$request?.data?.email}</Heading>
      <Body
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis porro
        ut nesciunt ipsam perspiciatis aliquam et hic minus alias beatae. Odit
        veritatis quos quas laborum magnam tenetur perspiciatis ex hic.</Body
      >
    </Layout>
  </div>
  <Divider size="S" />
  <div class="general">
    <Heading size="S">General</Heading>
    <div class="fields">
      <div class="field">
        <Label size="L">Email</Label>
        <Input disabled thin value={$request?.data?.email} />
      </div>
    </div>
    <div class="regenerate">
      <ActionButton size="S" icon="Refresh" quiet
        >Regenerate password</ActionButton
      >
    </div>
  </div>
  <Divider size="S" />
  <div class="delete">
    <Layout gap="S" noPadding
      ><Heading size="S">Delete user</Heading>
      <Body>Deleting a user completely removes them from your account.</Body>
      <div class="delete-button">
        <Button warning on:click={deleteUserModal.show}>Delete user</Button>
      </div></Layout
    >
  </div>
</Layout>

<Modal bind:this={deleteUserModal}>
  <ModalContent
    title="Delete User"
    confirmText="Delete user"
    cancelText="Cancel"
    showCloseIcon={false}
  >
    <Body
      >Are you sure you want to delete <strong>{$request?.data?.email}</strong
      ></Body
    >
  </ModalContent>
</Modal>

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
    margin-top: var(--spacing-xl);
  }
  .field {
    display: grid;
    grid-template-columns: 32% 1fr;
    align-items: center;
  }
  .heading {
    margin-bottom: var(--spacing-xl);
  }
  .general {
    position: relative;
    margin: var(--spacing-xl) 0;
  }
  .delete {
    margin-top: var(--spacing-xl);
  }
  .regenerate {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
