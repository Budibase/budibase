<script>
  import { Input, TextArea, Button } from "@budibase/bbui"
  import { AppsIcon, InfoIcon, CloseIcon } from "components/common/Icons/"
  import { getContext } from "svelte"
  export let onCancel = () => {}
  export let onOkay = () => {}

  const { close } = getContext("simple-modal")
  
  let name = ""
  let description = ""
  
  const createNewApp = async () => {
    const data = { name, description}    
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
    } catch (error) {
      
    }
  }

  let value
  let onChange = () => {}

  function _onCancel() {
    onCancel()
    close()
  }

  async function _onOkay() {
    await createNewApp()
    close()
  }
</script>

<div class="container">
  <div class="body">
    <div class="heading">
      <span class="icon"><AppsIcon /></span>
      <h3>Create new web app</h3>
    </div>
    <Input name="name" label="Name" placeholder="Enter application name" on:change={(e) => name = e.target.value} on:input={(e) => name = e.target.value} />
    <TextArea
      bind:value={description}
      name="description"
      label="Description"
      placeholder="Describe your application" />
  </div>
  <div class="footer">
    <a href="./#" class="info"><InfoIcon />How to get started</a>
    <Button outline thin on:click={_onCancel}>
      Cancel
    </Button>
    <Button primary thin on:click={_onOkay}>
      Save
    </Button>
  </div>
  <div class="close-button" on:click={_onCancel}><CloseIcon /></div>
</div>

<style>

.container {
  position: relative;
}

  .close-button {
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .close-button :global(svg) {
    width: 24px;
    height: 24px;
  }
  .heading {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  }
  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
  }
  .icon {
    display: grid;
    border-radius: 3px;
    align-content: center;
    justify-content: center;
    margin-right: 12px;
    height: 20px;
    width: 20px;
    padding: 10px;
    background-color: var(--blue-light);
  }
  .info {
    color: var(--primary100);
    text-decoration-color: var(--primary100);
  }
  .info :global(svg) {
    fill: var(--primary100);
    margin-right: 8px;
    width: 24px;
    height: 24px;
  }
  .body {
    padding: 40px 40px 80px 40px;
    display: grid;
    grid-gap: 20px;
  }
  .footer {
    display: grid;
    grid-gap: 20px;
    align-items: center;
    grid-template-columns: 1fr auto auto;
    padding: 30px 40px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 50px;
    background-color: var(--grey-light);
  }
</style>
