<script>
  import InputGroup from '../common/Inputs/InputGroup.svelte';

  let grid_values = ['', '', '', ''];
  let column_values = ['', ''];
  let row_values = ['', ''];
  let gap_values = [''];
  let margin_values = ['', '', '', ''];
  let padding_values = ['', '', '', ''];
  let zindex_values = [''];

  const tbrl = [
    { placeholder: 'T' },
    { placeholder: 'R' },
    { placeholder: 'B' },
    { placeholder: 'L' }
  ];

  const se = [
    { placeholder: 'START' },
    { placeholder: 'END' },
  ]

  const single = [{ placeholder: '' }];
</script>


<h3>Layout</h3>

<h4>Positioning</h4>

<div class="layout-pos">
  <div class="grid">
    <h5>Grid Area:</h5>
    <InputGroup meta={tbrl} bind:values={grid_values} size="small"/>
  </div>

  <div class="grid">
    <h5>Column:</h5>
    <InputGroup meta={se} bind:values={column_values} />
  </div>

  <div class="grid">
    <h5>Row:</h5>
    <InputGroup meta={se} bind:values={row_values} />
  </div>

  <div class="grid">
    <h5>Gap:</h5>
    <InputGroup meta={single} bind:values={gap_values} />
  </div>
</div>

<h4>Spacing</h4>

<div class="layout-spacing">
  <div class="grid">
    <h5>Margin:</h5>
    <InputGroup meta={tbrl} bind:values={margin_values} size="small"/>
  </div>

  <div  class="grid">
    <h5>Padding:</h5>
    <InputGroup meta={tbrl} bind:values={padding_values} size="small"/>
  </div>
</div>

<h4>Z-Index</h4>

<div class="layout-layer">
  <div class="grid">
    <h5>Z-Index:</h5>
    <InputGroup meta={single} bind:values={zindex_values}/>
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
    margin-bottom: 0;
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

</style>
