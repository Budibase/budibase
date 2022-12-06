import html2pdf from "html2pdf.js"

// Orientation options for generated PDF's
export const Orientations = {
  PORTRAIT: "portrait",
  LANDSCAPE: "landscape",
}

// Function to manipulate the pageSize prop of a html2pdf worker
function manipulatePageSize(pageSize, factor) {
  pageSize.width *= factor
  pageSize.height *= factor
  pageSize.inner.width *= factor
  pageSize.inner.height *= factor
  pageSize.inner.px.width *= factor
  pageSize.inner.px.height *= factor
}

// Converts an HTML string or an array of HTML pages into a PDF document and downloads it
export function htmlToPdf(pages = [], opts = {}) {
  const defaultOpts = {
    fileName: "file.pdf",
    margin: 60,
    orientation: Orientations.PORTRAIT,
    htmlScale: 1,
    progressCallback: () => {},
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

    // Function to add a PDF page to a html2pdf worker chain
    const addPage = (page, worker) => {
      return worker
        .set(options)
        .from(page)
        .then(() => {
          manipulatePageSize(worker.prop.pageSize, options.htmlScale)
        })
        .to("canvas")
        .get("canvas")
        .then(canvas => {
          // Original dimensions of content
          const originalWidth = Math.round(
            parseInt(canvas.style.width) / options.htmlScale
          )
          const originalHeight = Math.round(
            parseInt(canvas.style.height) / options.htmlScale
          )

          // Create new canvas, sized exactly for 1 page
          const newWidth = originalWidth
          const newHeight = Math.floor(
            newWidth * worker.prop.pageSize.inner.ratio
          )
          const newCanvas = document.createElement("canvas")
          newCanvas.width = newWidth * options.html2canvas.scale
          newCanvas.height = newHeight * options.html2canvas.scale
          newCanvas.style.width = `${newWidth}px`
          newCanvas.style.height = `${newHeight}px`

          // Draw original canvas, scaled appropriately
          const drawnWidth = Math.min(
            originalWidth * options.html2canvas.scale,
            newCanvas.width
          )
          const drawnHeight = Math.min(
            originalHeight * options.html2canvas.scale,
            newCanvas.height
          )

          // Draw new canvas image if valid
          if (drawnHeight > 0) {
            const ctx = newCanvas.getContext("2d")
            ctx.drawImage(canvas, 0, 0, drawnWidth, drawnHeight)
          }

          // Replace existing canvas with new canvas
          worker.prop.canvas = newCanvas

          // Revert pageSize prop manipulation
          manipulatePageSize(worker.prop.pageSize, 1 / options.htmlScale)
        })
        .to("pdf")
    }

    // Generate each page individually
    options.progressCallback(1, pages.length)

    // Create html2pdf worker
    let worker = addPage(pages[0], html2pdf())

    // Add other pages
    pages.slice(1).forEach((page, pageIdx) => {
      worker = worker.get("pdf").then(pdf => {
        pdf.addPage()
        options.progressCallback(pageIdx + 2, pages.length)
      })
      worker = addPage(page, worker)
    })

    // Add footer
    worker = worker.get("pdf").then(pdf => {
      const totalPages = pdf.internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(10)
        pdf.setTextColor(150)
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pdf.internal.pageSize.getWidth() - options.margin,
          pdf.internal.pageSize.getHeight() - 30,
          "right"
        )
        pdf.text(
          options.filename.replace(".pdf", ""),
          options.margin,
          pdf.internal.pageSize.getHeight() - 30
        )
      }
    })

    // Save PDF
    worker.save().then(() => {
      resolve()
    })
  })
}
