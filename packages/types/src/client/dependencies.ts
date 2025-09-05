export interface LibDependency {
  sourceFile: string
  outFile: string
  globalProperty: string
}

export const libDependencies: Record<string, LibDependency> = {
  charts: {
    sourceFile: "apexcharts.ts",
    outFile: "apexcharts.js",
    globalProperty: "_charts",
  },
  qrcode: {
    sourceFile: "html5-qrcode.ts",
    outFile: "html5-qrcode.js",
    globalProperty: "_qrcode",
  },
}
