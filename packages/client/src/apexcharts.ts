import ApexCharts from "apexcharts"

// Extend Window interface
declare global {
  interface Window {
    _charts: typeof ApexCharts
  }
}

// Export to global for runtime access
window._charts = ApexCharts

export default ApexCharts
