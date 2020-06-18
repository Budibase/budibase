<script>
  export let value = "";
</script>

<style>
  div {
    display: flex;
    justify-content: center;
    margin: 5px 0px;
  }

  input {
    width: 185px;
    font-size: 14px;
    background: #f1f3f4;
    border-radius: 8px;
    height: 27px;
    outline-color: #003cb0;
    color: #565252;
    text-align: center;
    /* border: none; */
    border: 1px solid #dadada;
  }
</style>

<div>
  <input on:input type="text" {value} maxlength="25" />
</div>
