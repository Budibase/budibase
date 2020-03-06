<script>
  import { store } from "../builderStore"
  import HierarchyRow from "./HierarchyRow.svelte"
  import { hierarchy as hierarchyFunctions } from "../../../core/src"
  import NavItem from "./NavItem.svelte"

  var acc = document.getElementsByClassName("accordion")
  var i

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active")
      var panel = this.nextElementSibling
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px"
      }
    })
  }
</script>

<div class="items-root">
  <div class="header">
    <h1 class="budibase__label--medium">Database</h1>
  </div>

  <button class="accordion">What is a database</button>
  <div class="panel">
    <p>Lorem ipsum...</p>
  </div>

  <button class="accordion">What is a record</button>
  <div class="panel">
    <p>Lorem ipsum...</p>
  </div>

  <button class="accordion">What is an index</button>
  <div class="panel">
    <p>Lorem ipsum...</p>
  </div>

  <button class="accordion">How do records & indexes relate</button>
  <div class="panel">
    <p>Lorem ipsum...</p>
  </div>

  <hr class="hr"> 
  
  <div class="header">
    <h1 class="budibase__label--medium">Records</h1>
  </div>

  <button class="accordion">What is a database</button>
  <div class="panel">
    <p>Lorem ipsum...</p>
  </div>

  <button class="accordion">What is a record</button>
  <div class="panel">
    <p>Lorem ipsum...</p>
  </div>

  <button class="accordion">What is an index</button>
  <div class="panel">
    <p>Lorem ipsum...</p>
  </div>

  <button class="accordion">How do records & indexes relate</button>
  <div class="panel">
    <p>Lorem ipsum...</p>
  </div>

  <hr class="hr"> 

  <div class="header">
    <h1 class="budibase__label--medium">Indexes</h1>
  </div>

   <button class="accordion">What is an index</button>
  <div class="panel">
    <p>Lorem ipsum...</p>
  </div>

  <button class="accordion">How do records & indexes relate</button>
  <div class="panel">
    <p>Lorem ipsum...</p>
  </div>



</div>

<style>
  .items-root {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    height: 100%;
  }

  .header {
    margin: 20px 0px 0px 20px;
  }

  /* Style the buttons that are used to open and close the accordion panel */
  .accordion {
    margin: 0px 0px 10px 20px;
    background-color: #fafafa;
    color: #173157;
    font-size: 12px;
    cursor: pointer;
    padding: 10px 15px 10px 15px;
    width: 85%;
    text-align: left;
    border: none;
    font-weight: 400;
    border-radius: 2px;
    transition: 0.4s;
  }

  /* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
  .active,
  .accordion:hover {
    font-weight: 500;
  }

  /* Style the accordion panel. Note: hidden by default */
  .panel {
    padding: 0 18px;
    background-color: white;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
  }

  .hr {
    margin-top: 10px;
    margin-bottom: 00px;
  }

</style>
