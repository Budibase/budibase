// @ts-ignore
import html2pdf from "html2pdf.js"

export const pxToPt = (px: number) => (px / 4) * 3
export const ptToPx = (pt: number) => (pt / 3) * 4

export const A4HeightPx = ptToPx(841.92) + 1

export interface PDFOptions {
  fileName?: string
  marginPt?: number
  orientation?: "portrait" | "landscape"
  htmlScale?: number
  footer?: boolean
}

export async function htmlToPdf(el: HTMLElement, opts: PDFOptions = {}) {
  const userOpts: Required<PDFOptions> = {
    fileName: "file.pdf",
    marginPt: 60,
    orientation: "portrait",
    htmlScale: 1,
    footer: true,
    ...opts,
  }

  return new Promise(resolve => {
    // Sanity check title
    let fileName = userOpts.fileName
    if (!fileName.endsWith(".pdf")) {
      fileName += ".pdf"
    }

    // Config
    const options = {
      margin: userOpts.marginPt,
      filename: fileName,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { dpi: 192, scale: 2, useCORS: true },
      jsPDF: {
        orientation: userOpts.orientation,
        unit: "pt",
        format: "a4",
      },
      pagebreak: { avoid: ".no-break" },

      // Custom params
      htmlScale: userOpts.htmlScale,
    }

    let worker = html2pdf().set(options).from(el).toPdf()

    // Add footer if required
    if (opts.footer) {
      worker = worker.get("pdf").then((pdf: any) => {
        const totalPages = pdf.internal.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i)
          pdf.setFontSize(10)
          pdf.setTextColor(200)
          pdf.text(
            `Page ${i} of ${totalPages}`,
            pdf.internal.pageSize.getWidth() - options.margin,
            pdf.internal.pageSize.getHeight() - options.margin / 2,
            "right"
          )
          pdf.text(
            options.filename.replace(".pdf", ""),
            options.margin,
            pdf.internal.pageSize.getHeight() - options.margin / 2
          )
        }
      })
    }

    worker.save().then(resolve)
  })
}
