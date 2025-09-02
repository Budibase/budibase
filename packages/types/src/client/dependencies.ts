interface LibDependency {
  sourceFile: string
  outFile: string
  windowObject: string
}

export const libDependencies: LibDependency[] = [
  {
    sourceFile: "apexcharts.ts",
    outFile: "apexcharts.js",
    windowObject: "_charts",
  },
  {
    sourceFile: "html5-qrcode.ts",
    outFile: "html5-qrcode.js",
    windowObject: "_qrcode",
  },
]
