<script>
  export let text = ""
  export let selected = false
</script>

<div class="flatbutton" class:selected on:click>{text}</div>

<style>
  .flatbutton {
    cursor: pointer;
    border: 1px solid #d4d4d4;
    border-radius: 8px;
    text-transform: uppercase;
    margin: 5px;
    transition: all 0.3s;
    font-size: 10px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f1f3f4;
  }

  .selected {
    color: #ffffff;
    background-color: #003cb0;
    border: none;
  }
</style>
