<script>
  import { goto as gotoStore, params as paramsStore } from "@roxi/routify"
  import { Modal, ModalContent, Body, Heading } from "@budibase/bbui"
  import FontAwesomeIcon from "components/common/FontAwesomeIcon.svelte"

  const handleOpen = (modal, params) => {
    if (params["?promptQuery"] && modal?.show) {
      modal.show()
      history.replaceState({}, null, window.location.pathname)
    }
  }

  let modal
  $: params = $paramsStore
  $: goto = $gotoStore
  $: handleOpen(modal, params)
</script>

<Modal bind:this={modal}>
  <ModalContent
    size="L"
    cancelText="Cancel"
    confirmText="Create new query"
    onConfirm={() => goto(`../../query/new/${params["datasourceId"]}`)}
    showCloseIcon={false}
  >
    <div slot="header" class="header">
      <FontAwesomeIcon name="fa-solid fa-circle-check" />
      <Heading size="M">You're ready to query your data!</Heading>
    </div>
    <div class="body">
      <Body>Your database is connected and ready to use.</Body>
      <Body
        >Create a query using <span>Create</span>, <span>Read</span>,
        <span>Update</span>
        and <span>Delete</span> functions.</Body
      >
    </div>
  </ModalContent>
</Modal>

<style>
  .header {
    display: flex;
    align-items: center;
  }

  .header :global(svg) {
    margin-right: 10px;
    margin-bottom: 1px;
    color: #009562;
  }

  .body :global(p:first-child) {
    margin-bottom: 16px;
  }

  .body :global(span) {
    font-weight: bold;
  }
</style>
