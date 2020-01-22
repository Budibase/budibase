<script></script>


<h3>Layout</h3>

<h4>Positioning</h4>

<div class="layout-pos">
  <div class="grid">
    <h5>Grid Area:</h5>
    <div class="inputs small">
      <input type="number" placeholder="T"/>
      <input type="number" placeholder="R"/>
      <input type="number" placeholder="B"/>
      <input type="number" placeholder="L"/>
    </div>
  </div>

  <div class="grid">
    <h5>Column:</h5>
    <div class="inputs">
      <input type="number" placeholder="START"/>
      <input type="number" placeholder="END"/>
    </div>
  </div>

  <div class="grid">
    <h5>Row:</h5>
    <div class="inputs">
      <input type="number" placeholder="START"/>
      <input type="number" placeholder="END"/>
    </div>
  </div>

  <div class="grid">
    <h5>Gap:</h5>
    <div class="inputs">
      <input type="number"/>
    </div>
  </div>
</div>

<h4>Spacing</h4>

<div class="layout-spacing">
  <div class="grid">
    <h5>Margin:</h5>
    <div class="inputs small">
      <input type="number" placeholder="T"/>
      <input type="number" placeholder="R"/>
      <input type="number" placeholder="B"/>
      <input type="number" placeholder="L"/>
    </div>
  </div>

  <div  class="grid">
    <h5>Padding:</h5>
    <div class="inputs small">
      <input type="number" placeholder="T"/>
      <input type="number" placeholder="R"/>
      <input type="number" placeholder="B"/>
      <input type="number" placeholder="L"/>
    </div>
  </div>
</div>

<h4>Z-Index</h4>

<div class="layout-layer">
  <div class="grid">
    <h5>Z-Index:</h5>
    <div class="inputs">
      <input type="text">
    </div>
  </div>
</div>

<style>
  h3 {
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    color: #8997ab;
    margin-bottom: 10px;
  }

  h4 {
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 700;
    color: #163057;
    opacity: 0.3;
    margin-bottom: 15px;
  }

  h5 {
    font-size: 12px;
    font-weight: 700;
    color: #163057;
    opacity: 0.6;
    padding-top: 12px;
  }

  div > div {
    display: grid;
    grid-template-rows: 1fr;
    grid-gap: 10px;
    height: 40px;
    margin-bottom: 15px;
  }

  .grid {
    grid-template-columns: 70px 1fr;
  }

  .inputs {
    display: flex;
    justify-content: space-between;

  }

  input {
    width: 83px;
    font-size: 12px;
    font-weight: 700;
    color: #163057;
    opacity: 0.7;
    padding: 5px 10px;
    box-sizing: border-box;

    /* margin: 0; */
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
}

  .small > input {
    width: 38px;
    height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0;
  }

  .small > input::placeholder {
    text-align: center;
  }

  input, input {
    border: 1px solid #DBDBDB;
    border-radius: 2px;
    outline: none;
  }
</style>
