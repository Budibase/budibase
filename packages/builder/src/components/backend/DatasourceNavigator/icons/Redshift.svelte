<script>
  export let width = "100"
  export let height = "100"
</script>

<svg
  {width}
  {height}
  viewBox="0 0 80 80"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="redshift-gradient">
      <stop stop-color="#4D27A8" offset="0%"></stop>
      <stop stop-color="#A166FF" offset="100%"></stop>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="80" height="80" fill="url(#redshift-gradient)" />
  <g fill="white" stroke="white" stroke-width="1.5">
    <!-- Database cylinder icon -->
    <ellipse cx="40" cy="20" rx="20" ry="6" fill="white" />
    <rect x="20" y="20" width="40" height="30" fill="white" />
    <ellipse cx="40" cy="50" rx="20" ry="6" fill="white" />

    <!-- Connection lines -->
    <path
      d="M25 35 L15 45 L25 55"
      stroke="white"
      stroke-width="2"
      fill="none"
    />
    <path
      d="M55 35 L65 45 L55 55"
      stroke="white"
      stroke-width="2"
      fill="none"
    />
    <path d="M40 60 L40 70" stroke="white" stroke-width="2" />

    <!-- Data flow indicators -->
    <circle cx="30" cy="30" r="2" fill="#4D27A8" />
    <circle cx="40" cy="30" r="2" fill="#4D27A8" />
    <circle cx="50" cy="30" r="2" fill="#4D27A8" />
    <circle cx="30" cy="40" r="2" fill="#4D27A8" />
    <circle cx="40" cy="40" r="2" fill="#4D27A8" />
    <circle cx="50" cy="40" r="2" fill="#4D27A8" />
  </g>
</svg>
