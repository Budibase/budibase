// These helpers rely on native dynamic imports so the ESM bundle
// can split vendor code into separate chunks and fetch them on demand.
// Because Rollup inlines dynamic imports for the legacy IIFE build,
// this continues to work there (the code is simply included upfront).
export const loadCharts = async () => (await import("apexcharts")).default

export const loadQRCode = async () =>
  (await import("html5-qrcode")).Html5Qrcode
