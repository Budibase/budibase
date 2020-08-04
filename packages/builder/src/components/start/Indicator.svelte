<script>
  export let step, done, active
</script>

<div class="container" class:active class:done>
  <div class="circle" class:active class:done>
    {#if done}
      <svg
        width="12"
        height="10"
        viewBox="0 0 12 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.1212 0.319527C10.327 0.115582 10.6047 0.000803464 10.8944
          4.20219e-06C11.1841 -0.00079506 11.4624 0.11245 11.6693
          0.315256C11.8762 0.518062 11.9949 0.794134 11.9998 1.08379C12.0048
          1.37344 11.8955 1.65339 11.6957 1.86313L5.82705 9.19893C5.72619
          9.30757 5.60445 9.39475 5.46913 9.45527C5.3338 9.51578 5.18766 9.54839
          5.03944 9.55113C4.89123 9.55388 4.74398 9.52671 4.60651
          9.47124C4.46903 9.41578 4.34416 9.33316 4.23934 9.22833L0.350925
          5.33845C0.242598 5.23751 0.155712 5.11578 0.0954499 4.98054C0.0351876
          4.84529 0.00278364 4.69929 0.00017159 4.55124C-0.00244046 4.4032
          0.024793 4.25615 0.0802466 4.11886C0.1357 3.98157 0.218238 3.85685
          0.322937 3.75215C0.427636 3.64746 0.55235 3.56492 0.68964
          3.50946C0.82693 3.45401 0.973983 3.42678 1.12203 3.42939C1.27007 3.432
          1.41607 3.46441 1.55132 3.52467C1.68657 3.58493 1.80829 3.67182
          1.90923 3.78014L4.98762 6.85706L10.0933 0.35187C10.1024 0.340482
          10.1122 0.329679 10.1227 0.319527H10.1212Z"
          fill="white" />
      </svg>
    {:else}{step}{/if}
  </div>
</div>

<style>
  .container::before {
    content: "";
    position: absolute;
    top: -30px;
    width: 1px;
    height: 30px;
    background: #bdbdbd;
  }
  .container:first-child::before {
    display: none;
  }
  .container {
    position: relative;
    height: 45px;
    display: grid;
    place-items: center;
  }
  .container.active {
    box-shadow: inset 3px 0 0 0 #4285f4;
  }
  .circle.active {
    background: #4285f4;
    color: white;
    border: none;
  }
  .circle.done {
    background: #bdbdbd;
    color: white;
    border: none;
  }
  .circle {
    color: #bdbdbd;
    font-size: 14px;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #bdbdbd;
    box-sizing: border-box;
  }
</style>
