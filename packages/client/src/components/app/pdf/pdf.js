import html2pdf from "html2pdf.js"

export const pxToPt = px => (px / 4) * 3
export const ptToPx = pt => (pt / 3) * 4
export const A4HeightPx = ptToPx(841.92) + 1

export async function htmlToPdf(el, opts = {}) {
  const defaultOpts = {
    fileName: "file.pdf",
    margin: 60,
    orientation: "portrait",
    htmlScale: 1,
    progressCallback: () => {},
    footer: true,
  }
  opts = {
    ...defaultOpts,
    ...opts,
  }

  return new Promise(resolve => {
    // Sanity check title
    let fileName = opts.fileName
    if (!fileName.endsWith(".pdf")) {
      fileName += ".pdf"
    }

    // Config
    const options = {
      margin: opts.margin,
      filename: fileName,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { dpi: 192, scale: 2, useCORS: true },
      jsPDF: {
        orientation: opts.orientation,
        unit: "pt",
        format: "a4",
      },
      pagebreak: { avoid: ".no-break" },

      // Custom params
      htmlScale: opts.htmlScale,
      progressCallback: opts.progressCallback,
    }

    html2pdf().set(options).from(el).save().then(resolve)
  })
}
