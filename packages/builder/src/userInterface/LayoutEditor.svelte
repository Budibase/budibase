<script>
  import InputGroup from '../common/Inputs/InputGroup.svelte';

  export let onStyleChanged = () => {};
  export let componentInfo;

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


  $: layout  = componentInfo._layout;

  $: positions = {
    gridarea: ['Grid Area', tbrl, 'small'],
    column: ['Column', se],
    row: ['Row', se],
    gap: ['Gap', single],
  };

  $: spacing = {
    margin: ['Margin', tbrl, 'small'],
    padding: ['Padding', tbrl, 'small']
  };

  $: zindex = {
    zindex: ['Z-Index', single]
  }

  const newValue = n => Array(n).fill('');
</script>


<h3>Layout</h3>

<h4>Positioning</h4>

<div class="layout-pos">
 {#each Object.entries(positions) as [key, [name, meta, size]]}
    <div class="grid">
      <h5>{name}:</h5>
      <InputGroup onStyleChanged={_value => onStyleChanged(key, _value)}
                  values={layout[key] || newValue(meta.length)}
                  {meta}
                  {size} />
    </div>
  {/each}
</div>

<h4>Spacing</h4>
<div class="layout-spacing">
  {#each Object.entries(spacing) as [key, [name, meta, size]]}
    <div class="grid">
      <h5>{name}:</h5>
      <InputGroup onStyleChanged={_value => onStyleChanged(key, _value)}
                  values={layout[key] || newValue(meta.length)}
                  {meta}
                  {size} />
    </div>
  {/each}
</div>

<h4>Z-Index</h4>
<div class="layout-layer">
  {#each Object.entries(zindex) as [key, [name, meta, size]]}
    <div class="grid">
      <h5>{name}:</h5>
      <InputGroup onStyleChanged={_value => onStyleChanged(key, _value)}
                  values={layout[key] || newValue(meta.length)}
                  {meta}
                  {size} />
    </div>
  {/each}
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
