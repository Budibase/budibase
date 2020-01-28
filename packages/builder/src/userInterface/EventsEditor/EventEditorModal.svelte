<script>
  import Modal from "../../common/Modal.svelte";
  import EventSelector from "../EventSelector.svelte";

  export let event;
  export let open;
  export let closeModal;

  $: action = open && event ? "Edit" : "Create";

</script>

<Modal isOpen={open} onClosed={closeModal}>
  <h2>{action} Event</h2>
  <EventSelector 
    onChanged={console.log}
    onRemoved={console.log}
    {event} 
  />
</Modal>

<style>
  h3 {
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    color: #8997ab;
    margin-bottom: 10px;
  }

  .root {
    font-size: 10pt;
    width: 100%;
  }

  .form-root {
    display: flex;
    flex-wrap: wrap;
  }

  .prop-container {
    flex: 1 1 auto;
    min-width: 250px;
  }
  
  .edit-icon:hover {
    cursor: pointer;
  }
</style>