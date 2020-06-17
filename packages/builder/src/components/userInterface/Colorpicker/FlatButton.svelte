<script>
  export let text = "";
  export let selected = false;
</script>

<style>
  .flatbutton {
    padding: 3px 15px;
    cursor: pointer;
    color: black;
    background-color: #dadada;
    border: 1px solid #d4d4d4;
    border-radius: 8px;
    text-transform: uppercase;
    margin: 5px;
    transition: all 0.3s;
  }

  .selected {
    color: #ffffff;
    background-color: #003cb0;
    border: none;
  }
</style>

<div class="flatbutton" class:selected on:click>{text}</div>
