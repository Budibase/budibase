<script lang="ts">
  export let size = "64px"
  export let animate: boolean = false
</script>

<svg
  viewBox="0 0 150 150"
  width={size}
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g id="bbai">
    <g id="Group 48096461">
      {#if animate}
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 75 75"
          to="360 75 75"
          dur="2.5s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.3 0 0.5 1"
        />
      {/if}
      <path
        id="Vector"
        d="M22.3457 95.0839L51.9032 124.642C53.199 125.937 55.2988 125.937 56.5946 124.642L69.4653 111.771C70.6236 110.612 71.171 108.976 70.9436 107.352L67.4872 82.9246C67.2334 81.1475 65.8371 79.7512 64.0626 79.4999L39.6354 76.0436C38.0143 75.8135 36.3774 76.3609 35.2164 77.5218L22.3457 90.3926C21.0499 91.6884 21.0499 93.7881 22.3457 95.0839Z"
        fill="url(#paint0_linear_605_124)"
      />
      <path
        id="Vector_2"
        d="M92.0381 124.643L121.596 95.0851C122.891 93.7893 122.891 91.6895 121.596 90.3937L108.725 77.5229C107.567 76.3647 105.93 75.8172 104.306 76.0447L79.8787 79.501C78.1016 79.7549 76.7053 81.1512 76.454 82.9257L72.9977 107.353C72.7676 108.974 73.315 110.611 74.4759 111.772L87.3467 124.643C88.6425 125.938 90.7422 125.938 92.0381 124.643Z"
        fill="url(#paint1_linear_605_124)"
      />
      <path
        id="Vector_3"
        d="M121.654 54.92L92.0968 25.3624C90.801 24.0666 88.7012 24.0666 87.4054 25.3624L74.5347 38.2332C73.3764 39.3915 72.829 41.0284 73.0564 42.6521L76.5128 67.0793C76.7666 68.8565 78.1629 70.2527 79.9374 70.504L104.365 73.9603C105.986 74.1904 107.623 73.643 108.784 72.4821L121.654 59.6113C122.95 58.3155 122.95 56.2158 121.654 54.92Z"
        fill="url(#paint2_linear_605_124)"
      />
      <path
        id="Vector_4"
        d="M51.9619 25.3613L22.4044 54.9188C21.1086 56.2146 21.1086 58.3144 22.4044 59.6102L35.2752 72.481C36.4334 73.6393 38.0704 74.1867 39.6941 73.9592L64.1213 70.5029C65.8984 70.249 67.2947 68.8527 67.546 67.0782L71.0023 42.651C71.2324 41.0299 70.685 39.393 69.5241 38.2321L56.6533 25.3613C55.3575 24.0655 53.2578 24.0655 51.9619 25.3613Z"
        fill="url(#paint3_linear_605_124)"
      />
    </g>
  </g>
  <defs>
    <linearGradient
      id="paint0_linear_605_124"
      x1="52.1505"
      y1="121.517"
      x2="68.292"
      y2="84.222"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#6E56FF" />
      <stop offset="1" stop-color="#9F8FFF" />
    </linearGradient>
    <linearGradient
      id="paint1_linear_605_124"
      x1="118.471"
      y1="94.8378"
      x2="81.1761"
      y2="78.6963"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#6E56FF" />
      <stop offset="1" stop-color="#9F8FFF" />
    </linearGradient>
    <linearGradient
      id="paint2_linear_605_124"
      x1="91.8495"
      y1="28.4869"
      x2="75.708"
      y2="65.7819"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#6E56FF" />
      <stop offset="1" stop-color="#9F8FFF" />
    </linearGradient>
    <linearGradient
      id="paint3_linear_605_124"
      x1="25.5289"
      y1="55.1661"
      x2="62.8239"
      y2="71.3076"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#6E56FF" />
      <stop offset="1" stop-color="#9F8FFF" />
    </linearGradient>
  </defs>
</svg>
