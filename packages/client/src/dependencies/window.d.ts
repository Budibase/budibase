import ApexCharts from "apexcharts"
import { Html5Qrcode } from "html5-qrcode"

declare global {
  interface Window {
    _charts: typeof ApexCharts
    _qrcode: typeof Html5Qrcode
  }
}
