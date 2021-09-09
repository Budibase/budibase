import Utils from '../../utils/Utils'
import CoreUtils from '../CoreUtils'

export default class PointAnnotations {
  constructor(annoCtx) {
    this.w = annoCtx.w
    this.annoCtx = annoCtx
  }

  addPointAnnotation(anno, parent, index) {
    const w = this.w

    let x = 0
    let y = 0
    let pointY = 0

    if (this.annoCtx.invertAxis) {
      console.warn(
        'Point annotation is not supported in horizontal bar charts.'
      )
    }

    let annoY = parseFloat(anno.y)

    if (typeof anno.x === 'string') {
      let catIndex = w.globals.labels.indexOf(anno.x)

      if (w.config.xaxis.convertedCatToNumeric) {
        catIndex = w.globals.categoryLabels.indexOf(anno.x)
      }

      x = this.annoCtx.helpers.getStringX(anno.x)

      if (anno.y === null) {
        annoY = w.globals.series[anno.seriesIndex][catIndex]
      }
    } else {
      x = (anno.x - w.globals.minX) / (w.globals.xRange / w.globals.gridWidth)
    }

    // count series assign to the same axis
    let duplicateSeriesName = []
    let countDuplicateSeriesName = 0
    for (let i = 0; i <= anno.seriesIndex; i++) {
      let serieName = w.config.yaxis[i].seriesName
      if (serieName)
        for (let j = i + 1; j <= anno.seriesIndex; j++) {
          if (
            w.config.yaxis[j].seriesName === serieName &&
            duplicateSeriesName.indexOf(serieName) === -1
          ) {
            countDuplicateSeriesName++
            duplicateSeriesName.push(serieName)
          }
        }
    }

    let yPos
    if (w.config.yaxis[anno.yAxisIndex].logarithmic) {
      const coreUtils = new CoreUtils(this.annoCtx.ctx)
      annoY = coreUtils.getLogVal(annoY, anno.yAxisIndex)
      yPos = annoY / w.globals.yLogRatio[anno.yAxisIndex]
    } else {
      // calculate the right position in array for this yAxisIndex
      let actualSerieIndex = anno.yAxisIndex + countDuplicateSeriesName
      yPos =
        (annoY - w.globals.minYArr[actualSerieIndex]) /
        (w.globals.yRange[actualSerieIndex] / w.globals.gridHeight)
    }

    y =
      w.globals.gridHeight -
      yPos -
      parseFloat(anno.label.style.fontSize) -
      anno.marker.size

    pointY = w.globals.gridHeight - yPos

    if (
      w.config.yaxis[anno.yAxisIndex] &&
      w.config.yaxis[anno.yAxisIndex].reversed
    ) {
      y = yPos + parseFloat(anno.label.style.fontSize) + anno.marker.size
      pointY = yPos
    }

    if (!Utils.isNumber(x)) return

    let optsPoints = {
      pSize: anno.marker.size,
      pointStrokeWidth: anno.marker.strokeWidth,
      pointFillColor: anno.marker.fillColor,
      pointStrokeColor: anno.marker.strokeColor,
      shape: anno.marker.shape,
      pRadius: anno.marker.radius,
      class: `apexcharts-point-annotation-marker ${anno.marker.cssClass} ${
        anno.id ? anno.id : ''
      }`
    }

    let point = this.annoCtx.graphics.drawMarker(
      x + anno.marker.offsetX,
      pointY + anno.marker.offsetY,
      optsPoints
    )

    parent.appendChild(point.node)

    const text = anno.label.text ? anno.label.text : ''

    let elText = this.annoCtx.graphics.drawText({
      x: x + anno.label.offsetX,
      y: y + anno.label.offsetY,
      text,
      textAnchor: anno.label.textAnchor,
      fontSize: anno.label.style.fontSize,
      fontFamily: anno.label.style.fontFamily,
      fontWeight: anno.label.style.fontWeight,
      foreColor: anno.label.style.color,
      cssClass: `apexcharts-point-annotation-label ${
        anno.label.style.cssClass
      } ${anno.id ? anno.id : ''}`
    })

    elText.attr({
      rel: index
    })

    parent.appendChild(elText.node)

    // TODO: deprecate this as we will use custom
    if (anno.customSVG.SVG) {
      let g = this.annoCtx.graphics.group({
        class:
          'apexcharts-point-annotations-custom-svg ' + anno.customSVG.cssClass
      })

      g.attr({
        transform: `translate(${x + anno.customSVG.offsetX}, ${y +
          anno.customSVG.offsetY})`
      })

      g.node.innerHTML = anno.customSVG.SVG
      parent.appendChild(g.node)
    }

    if (anno.image.path) {
      let imgWidth = anno.image.width ? anno.image.width : 20
      let imgHeight = anno.image.height ? anno.image.height : 20

      this.annoCtx.addImage({
        x: x + anno.image.offsetX - imgWidth / 2,
        y: y + anno.image.offsetY - imgHeight / 2,
        width: imgWidth,
        height: imgHeight,
        path: anno.image.path,
        appendTo: '.apexcharts-point-annotations'
      })
    }
  }

  drawPointAnnotations() {
    let w = this.w

    let elg = this.annoCtx.graphics.group({
      class: 'apexcharts-point-annotations'
    })

    w.config.annotations.points.map((anno, index) => {
      this.addPointAnnotation(anno, elg.node, index)
    })

    return elg
  }
}
