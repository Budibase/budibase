<script>
  import { ModalContent, Body, Detail } from "@budibase/bbui"

  let selectedNav
  export let navSelectionModal
</script>

<ModalContent
  title="Select navigation"
  cancelText="Back"
  onCancel={() => navSelectionModal.show()}
  size="M"
  disabled={!selectedNav}
>
  <Body size="S"
    >Please select your preferred layout for the new application:</Body
  >

  <div class="wrapper">
    <div
      on:click={() => (selectedNav = "sideNav")}
      class:unselected={selectedNav && selectedNav !== "sideNav"}
    >
      <div class="box">
        <div class="side-nav" />
      </div>
      <div><Detail>Side Nav</Detail></div>
    </div>
    <div
      on:click={() => (selectedNav = "topNav")}
      class:unselected={selectedNav && selectedNav !== "topNav"}
    >
      <div class="box">
        <div class="top-nav" />
      </div>
      <div><Detail>Top Nav</Detail></div>
    </div>
    <div
      on:click={() => (selectedNav = "noNav")}
      class:unselected={selectedNav && selectedNav !== "noNav"}
    >
      <div class="box" />
      <div><Detail>No Nav</Detail></div>
    </div>
  </div>
</ModalContent>

<style>
  .side-nav {
    float: left;
    background: #d3d3d3 0% 0% no-repeat padding-box;
    border-radius: 2px 0px 0px 2px;
    height: 100%;
    width: 10%;
  }

  .top-nav {
    background: #d3d3d3 0% 0% no-repeat padding-box;
    vertical-align: top;
    width: 100%;
    height: 15%;
  }
  .box {
    display: inline-block;
    background: #eaeaea 0% 0% no-repeat padding-box;
    border: 1px solid #d3d3d3;
    border-radius: 2px;
    opacity: 1;
    width: 120px;
    height: 70px;
    margin-right: 20px;
  }

  .wrapper {
    display: flex;
    padding-top: 4%;
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-right: 5%;
  }
  .unselected {
    opacity: 0.3;
  }
</style>
