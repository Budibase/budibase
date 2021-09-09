import CoreUtils from '../modules/CoreUtils'
import Bar from './Bar'
import Graphics from '../modules/Graphics'
import Utils from '../utils/Utils'

/**
 * ApexCharts BarStacked Class responsible for drawing both Stacked Columns and Bars.
 *
 * @module BarStacked
 * The whole calculation for stacked bar/column is different from normal bar/column,
 * hence it makes sense to derive a new class for it extending most of the props of Parent Bar
 **/

class BarStacked extends Bar {
  draw(series, seriesIndex) {
    let w = this.w
    this.graphics = new Graphics(this.ctx)
    this.bar = new Bar(this.ctx, this.xyRatios)

    const coreUtils = new CoreUtils(this.ctx, w)
    series = coreUtils.getLogSeries(series)
    this.yRatio = coreUtils.getLogYRatios(this.yRatio)

    this.barHelpers.initVariables(series)

    if (w.config.chart.stackType === '100%') {
      series = w.globals.seriesPercent.slice()
    }

    this.series = series

    this.totalItems = 0

    this.prevY = [] // y position on chart
    this.prevX = [] // x position on chart
    this.prevYF = [] // y position including shapes on chart
    this.prevXF = [] // x position including shapes on chart
    this.prevYVal = [] // y values (series[i][j]) in columns
    this.prevXVal = [] // x values (series[i][j]) in bars

    this.xArrj = [] // xj indicates x position on graph in bars
    this.xArrjF = [] // xjF indicates bar's x position + roundedShape's positions in bars
    this.xArrjVal = [] // x val means the actual series's y values in horizontal/bars
    this.yArrj = [] // yj indicates y position on graph in columns
    this.yArrjF = [] // yjF indicates bar's y position + roundedShape's positions in columns
    this.yArrjVal = [] // y val means the actual series's y values in columns

    for (let sl = 0; sl < series.length; sl++) {
      if (series[sl].length > 0) {
        this.totalItems += series[sl].length
      }
    }

    let ret = this.graphics.group({
      class: 'apexcharts-bar-series apexcharts-plot-series'
    })

    let x = 0
    let y = 0

    for (let i = 0, bc = 0; i < series.length; i++, bc++) {
      let xDivision // xDivision is the GRIDWIDTH divided by number of datapoints (columns)
      let yDivision // yDivision is the GRIDHEIGHT divided by number of datapoints (bars)
      let zeroH // zeroH is the baseline where 0 meets y axis
      let zeroW // zeroW is the baseline where 0 meets x axis

      let xArrValues = []
      let yArrValues = []

      let realIndex = w.globals.comboCharts ? seriesIndex[i] : i

      if (this.yRatio.length > 1) {
        this.yaxisIndex = realIndex
      }

      this.isReversed =
        w.config.yaxis[this.yaxisIndex] &&
        w.config.yaxis[this.yaxisIndex].reversed

      // el to which series will be drawn
      let elSeries = this.graphics.group({
        class: `apexcharts-series`,
        seriesName: Utils.escapeString(w.globals.seriesNames[realIndex]),
        rel: i + 1,
        'data:realIndex': realIndex
      })
      this.ctx.series.addCollapsedClassToSeries(elSeries, realIndex)

      // eldatalabels
      let elDataLabelsWrap = this.graphics.group({
        class: 'apexcharts-datalabels',
        'data:realIndex': realIndex
      })

      let barHeight = 0
      let barWidth = 0

      let initPositions = this.initialPositions(
        x,
        y,
        xDivision,
        yDivision,
        zeroH,
        zeroW
      )
      y = initPositions.y
      barHeight = initPositions.barHeight
      yDivision = initPositions.yDivision
      zeroW = initPositions.zeroW

      x = initPositions.x
      barWidth = initPositions.barWidth
      xDivision = initPositions.xDivision
      zeroH = initPositions.zeroH

      this.yArrj = []
      this.yArrjF = []
      this.yArrjVal = []
      this.xArrj = []
      this.xArrjF = []
      this.xArrjVal = []

      // if (!this.horizontal) {
      // this.xArrj.push(x + barWidth / 2)
      // }

      // fix issue #1215;
      // where all stack bar disappear after collapsing the first series
      // sol: if only 1 arr in this.prevY(this.prevY.length === 1) and all are NaN
      if (this.prevY.length === 1 && this.prevY[0].every((val) => isNaN(val))) {
        // make this.prevY[0] all zeroH
        this.prevY[0] = this.prevY[0].map((val) => zeroH)
        // make this.prevYF[0] all 0
        this.prevYF[0] = this.prevYF[0].map((val) => 0)
      }

      for (let j = 0; j < w.globals.dataPoints; j++) {
        const strokeWidth = this.barHelpers.getStrokeWidth(i, j, realIndex)
        const commonPathOpts = {
          indexes: { i, j, realIndex, bc },
          strokeWidth,
          x,
          y,
          elSeries
        }
        let paths = null
        if (this.isHorizontal) {
          paths = this.drawStackedBarPaths({
            ...commonPathOpts,
            zeroW,
            barHeight,
            yDivision
          })
          barWidth = this.series[i][j] / this.invertedYRatio
        } else {
          paths = this.drawStackedColumnPaths({
            ...commonPathOpts,
            xDivision,
            barWidth,
            zeroH
          })
          barHeight = this.series[i][j] / this.yRatio[this.yaxisIndex]
        }

        y = paths.y
        x = paths.x

        xArrValues.push(x)
        yArrValues.push(y)

        let pathFill = this.barHelpers.getPathFillColor(series, i, j, realIndex)

        elSeries = this.renderSeries({
          realIndex,
          pathFill,
          j,
          i,
          pathFrom: paths.pathFrom,
          pathTo: paths.pathTo,
          strokeWidth,
          elSeries,
          x,
          y,
          series,
          barHeight,
          barWidth,
          elDataLabelsWrap,
          type: 'bar',
          visibleSeries: 0
        })
      }

      // push all x val arrays into main xArr
      w.globals.seriesXvalues[realIndex] = xArrValues
      w.globals.seriesYvalues[realIndex] = yArrValues

      // push all current y values array to main PrevY Array
      this.prevY.push(this.yArrj)
      this.prevYF.push(this.yArrjF)
      this.prevYVal.push(this.yArrjVal)
      this.prevX.push(this.xArrj)
      this.prevXF.push(this.xArrjF)
      this.prevXVal.push(this.xArrjVal)

      ret.add(elSeries)
    }

    return ret
  }

  initialPositions(x, y, xDivision, yDivision, zeroH, zeroW) {
    let w = this.w

    let barHeight, barWidth
    if (this.isHorizontal) {
      // height divided into equal parts
      yDivision = w.globals.gridHeight / w.globals.dataPoints
      barHeight = yDivision

      barHeight =
        (barHeight * parseInt(w.config.plotOptions.bar.barHeight, 10)) / 100

      zeroW =
        this.baseLineInvertedY +
        w.globals.padHorizontal +
        (this.isReversed ? w.globals.gridWidth : 0) -
        (this.isReversed ? this.baseLineInvertedY * 2 : 0)

      // initial y position is half of barHeight * half of number of Bars
      y = (yDivision - barHeight) / 2
    } else {
      // width divided into equal parts
      xDivision = w.globals.gridWidth / w.globals.dataPoints

      barWidth = xDivision

      if (w.globals.isXNumeric && w.globals.dataPoints > 1) {
        // the check (w.globals.dataPoints > 1) fixes apexcharts.js #1617
        xDivision = w.globals.minXDiff / this.xRatio
        barWidth = (xDivision * parseInt(this.barOptions.columnWidth, 10)) / 100
      } else {
        barWidth =
          (barWidth * parseInt(w.config.plotOptions.bar.columnWidth, 10)) / 100
      }

      zeroH =
        this.baseLineY[this.yaxisIndex] +
        (this.isReversed ? w.globals.gridHeight : 0) -
        (this.isReversed ? this.baseLineY[this.yaxisIndex] * 2 : 0)

      // initial x position is one third of barWidth
      x = w.globals.padHorizontal + (xDivision - barWidth) / 2
    }
    return {
      x,
      y,
      yDivision,
      xDivision,
      barHeight,
      barWidth,
      zeroH,
      zeroW
    }
  }

  drawStackedBarPaths({
    indexes,
    barHeight,
    strokeWidth,
    zeroW,
    x,
    y,
    yDivision,
    elSeries
  }) {
    let w = this.w
    let barYPosition = y
    let barXPosition
    let i = indexes.i
    let j = indexes.j

    let prevBarW = 0
    for (let k = 0; k < this.prevXF.length; k++) {
      prevBarW = prevBarW + this.prevXF[k][j]
    }

    if (i > 0) {
      let bXP = zeroW

      if (this.prevXVal[i - 1][j] < 0) {
        bXP =
          this.series[i][j] >= 0
            ? this.prevX[i - 1][j] +
              prevBarW -
              (this.isReversed ? prevBarW : 0) * 2
            : this.prevX[i - 1][j]
      } else if (this.prevXVal[i - 1][j] >= 0) {
        bXP =
          this.series[i][j] >= 0
            ? this.prevX[i - 1][j]
            : this.prevX[i - 1][j] -
              prevBarW +
              (this.isReversed ? prevBarW : 0) * 2
      }

      barXPosition = bXP
    } else {
      // the first series will not have prevX values
      barXPosition = zeroW
    }

    if (this.series[i][j] === null) {
      x = barXPosition
    } else {
      x =
        barXPosition +
        this.series[i][j] / this.invertedYRatio -
        (this.isReversed ? this.series[i][j] / this.invertedYRatio : 0) * 2
    }

    const paths = this.barHelpers.getBarpaths({
      barYPosition,
      barHeight,
      x1: barXPosition,
      x2: x,
      strokeWidth,
      series: this.series,
      realIndex: indexes.realIndex,
      i,
      j,
      w
    })

    this.barHelpers.barBackground({
      j,
      i,
      y1: barYPosition,
      y2: barHeight,
      elSeries
    })

    y = y + yDivision

    return {
      pathTo: paths.pathTo,
      pathFrom: paths.pathFrom,
      x,
      y
    }
  }

  drawStackedColumnPaths({
    indexes,
    x,
    y,
    xDivision,
    barWidth,
    zeroH,
    strokeWidth,
    elSeries
  }) {
    let w = this.w
    let i = indexes.i
    let j = indexes.j
    let bc = indexes.bc

    if (w.globals.isXNumeric) {
      let seriesVal = w.globals.seriesX[i][j]
      if (!seriesVal) seriesVal = 0
      x = (seriesVal - w.globals.minX) / this.xRatio - barWidth / 2
    }

    let barXPosition = x
    let barYPosition

    let prevBarH = 0
    for (let k = 0; k < this.prevYF.length; k++) {
      // fix issue #1215
      // in case where this.prevYF[k][j] is NaN, use 0 instead
      prevBarH = prevBarH + (!isNaN(this.prevYF[k][j]) ? this.prevYF[k][j] : 0)
    }

    if (
      (i > 0 && !w.globals.isXNumeric) ||
      (i > 0 &&
        w.globals.isXNumeric &&
        w.globals.seriesX[i - 1][j] === w.globals.seriesX[i][j])
    ) {
      let bYP
      let prevYValue
      const p = Math.min(this.yRatio.length + 1, i + 1)
      if (this.prevY[i - 1] !== undefined) {
        for (let ii = 1; ii < p; ii++) {
          if (!isNaN(this.prevY[i - ii][j])) {
            // find the previous available value to give prevYValue
            prevYValue = this.prevY[i - ii][j]
            // if found it, break the loop
            break
          }
        }
      }

      for (let ii = 1; ii < p; ii++) {
        // find the previous available value(non-NaN) to give bYP
        if (this.prevYVal[i - ii][j] < 0) {
          bYP =
            this.series[i][j] >= 0
              ? prevYValue - prevBarH + (this.isReversed ? prevBarH : 0) * 2
              : prevYValue
          // found it? break the loop
          break
        } else if (this.prevYVal[i - ii][j] >= 0) {
          bYP =
            this.series[i][j] >= 0
              ? prevYValue
              : prevYValue + prevBarH - (this.isReversed ? prevBarH : 0) * 2
          // found it? break the loop
          break
        }
      }

      if (typeof bYP === 'undefined') bYP = w.globals.gridHeight

      // if this.prevYF[0] is all 0 resulted from line #486
      // AND every arr starting from the second only contains NaN
      if (
        this.prevYF[0].every((val) => val === 0) &&
        this.prevYF.slice(1, i).every((arr) => arr.every((val) => isNaN(val)))
      ) {
        // Use the same calc way as line #485
        barYPosition = w.globals.gridHeight - zeroH
      } else {
        // Nothing special
        barYPosition = bYP
      }
    } else {
      // the first series will not have prevY values, also if the prev index's series X doesn't matches the current index's series X, then start from zero
      barYPosition = w.globals.gridHeight - zeroH
    }

    y =
      barYPosition -
      this.series[i][j] / this.yRatio[this.yaxisIndex] +
      (this.isReversed ? this.series[i][j] / this.yRatio[this.yaxisIndex] : 0) *
        2

    const paths = this.barHelpers.getColumnPaths({
      barXPosition,
      barWidth,
      y1: barYPosition,
      y2: y,
      yRatio: this.yRatio[this.yaxisIndex],
      strokeWidth: this.strokeWidth,
      series: this.series,
      realIndex: indexes.realIndex,
      i,
      j,
      w
    })

    this.barHelpers.barBackground({
      bc,
      j,
      i,
      x1: barXPosition,
      x2: barWidth,
      elSeries
    })

    x = x + xDivision

    return {
      pathTo: paths.pathTo,
      pathFrom: paths.pathFrom,
      x: w.globals.isXNumeric ? x - xDivision : x,
      y
    }
  }
}

export default BarStacked
