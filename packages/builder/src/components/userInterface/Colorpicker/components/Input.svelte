<script>
  export let value = ""
</script>

<div>
  <input on:input on:change type="text" {value} maxlength="25" />
</div>

<style>
  div {
    display: flex;
    justify-content: center;
    margin: 5px 0px;
  }

  input {
    width: 175px;
    font-size: 13px;
    background: #f1f3f4;
    border-radius: 8px;
    height: 20px;
    outline-color: #003cb0;
    color: inherit;
    text-align: center;
    border: 1px solid #dadada;
    font-weight: 550;
  }
</style>
