import Fill from '../../../modules/Fill'
import Graphics from '../../../modules/Graphics'
import Series from '../../../modules/Series'

export default class Helpers {
  constructor(barCtx) {
    this.w = barCtx.w
    this.barCtx = barCtx
  }

  initVariables(series) {
    const w = this.w
    this.barCtx.series = series
    this.barCtx.totalItems = 0
    this.barCtx.seriesLen = 0
    this.barCtx.visibleI = -1 // visible Series
    this.barCtx.visibleItems = 1 // number of visible bars after user zoomed in/out

    for (let sl = 0; sl < series.length; sl++) {
      if (series[sl].length > 0) {
        this.barCtx.seriesLen = this.barCtx.seriesLen + 1
        this.barCtx.totalItems += series[sl].length
      }
      if (w.globals.isXNumeric) {
        // get max visible items
        for (let j = 0; j < series[sl].length; j++) {
          if (
            w.globals.seriesX[sl][j] > w.globals.minX &&
            w.globals.seriesX[sl][j] < w.globals.maxX
          ) {
            this.barCtx.visibleItems++
          }
        }
      } else {
        this.barCtx.visibleItems = w.globals.dataPoints
      }
    }

    if (this.barCtx.seriesLen === 0) {
      // A small adjustment when combo charts are used
      this.barCtx.seriesLen = 1
    }
    this.barCtx.zeroSerieses = []
    this.barCtx.radiusOnSeriesNumber = series.length - 1 // which series to draw ending shape on

    if (!w.globals.comboCharts) {
      this.checkZeroSeries({ series })
    }
  }

  initialPositions() {
    let w = this.w
    let x, y, yDivision, xDivision, barHeight, barWidth, zeroH, zeroW

    let dataPoints = w.globals.dataPoints
    if (this.barCtx.isTimelineBar) {
      // timeline rangebar chart
      dataPoints = w.globals.labels.length
    }

    let seriesLen = this.barCtx.seriesLen
    if (w.config.plotOptions.bar.rangeBarGroupRows) {
      seriesLen = 1
    }

    if (this.barCtx.isHorizontal) {
      // height divided into equal parts
      yDivision = w.globals.gridHeight / dataPoints
      barHeight = yDivision / seriesLen

      if (w.globals.isXNumeric) {
        yDivision = w.globals.gridHeight / this.barCtx.totalItems
        barHeight = yDivision / this.barCtx.seriesLen
      }

      barHeight =
        (barHeight * parseInt(this.barCtx.barOptions.barHeight, 10)) / 100

      zeroW =
        this.barCtx.baseLineInvertedY +
        w.globals.padHorizontal +
        (this.barCtx.isReversed ? w.globals.gridWidth : 0) -
        (this.barCtx.isReversed ? this.barCtx.baseLineInvertedY * 2 : 0)

      y = (yDivision - barHeight * this.barCtx.seriesLen) / 2
    } else {
      // width divided into equal parts
      xDivision = w.globals.gridWidth / this.barCtx.visibleItems
      if (w.config.xaxis.convertedCatToNumeric) {
        xDivision = w.globals.gridWidth / w.globals.dataPoints
      }
      barWidth =
        ((xDivision / this.barCtx.seriesLen) *
          parseInt(this.barCtx.barOptions.columnWidth, 10)) /
        100

      if (w.globals.isXNumeric) {
        // max barwidth should be equal to minXDiff to avoid overlap
        let xRatio = this.barCtx.xRatio
        if (w.config.xaxis.convertedCatToNumeric) {
          xRatio = this.barCtx.initialXRatio
        }
        if (
          w.globals.minXDiff &&
          w.globals.minXDiff !== 0.5 &&
          w.globals.minXDiff / xRatio > 0
        ) {
          xDivision = w.globals.minXDiff / xRatio
        }

        barWidth =
          ((xDivision / this.barCtx.seriesLen) *
            parseInt(this.barCtx.barOptions.columnWidth, 10)) /
          100

        if (barWidth < 1) {
          barWidth = 1
        }
      }

      zeroH =
        w.globals.gridHeight -
        this.barCtx.baseLineY[this.barCtx.yaxisIndex] -
        (this.barCtx.isReversed ? w.globals.gridHeight : 0) +
        (this.barCtx.isReversed
          ? this.barCtx.baseLineY[this.barCtx.yaxisIndex] * 2
          : 0)

      x =
        w.globals.padHorizontal +
        (xDivision - barWidth * this.barCtx.seriesLen) / 2
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

  getPathFillColor(series, i, j, realIndex) {
    const w = this.w
    let fill = new Fill(this.barCtx.ctx)

    let fillColor = null
    let seriesNumber = this.barCtx.barOptions.distributed ? j : i

    if (this.barCtx.barOptions.colors.ranges.length > 0) {
      const colorRange = this.barCtx.barOptions.colors.ranges
      colorRange.map((range) => {
        if (series[i][j] >= range.from && series[i][j] <= range.to) {
          fillColor = range.color
        }
      })
    }

    if (w.config.series[i].data[j] && w.config.series[i].data[j].fillColor) {
      fillColor = w.config.series[i].data[j].fillColor
    }

    let pathFill = fill.fillPath({
      seriesNumber: this.barCtx.barOptions.distributed
        ? seriesNumber
        : realIndex,
      dataPointIndex: j,
      color: fillColor,
      value: series[i][j]
    })

    return pathFill
  }

  getStrokeWidth(i, j, realIndex) {
    let strokeWidth = 0
    const w = this.w

    if (
      typeof this.barCtx.series[i][j] === 'undefined' ||
      this.barCtx.series[i][j] === null
    ) {
      this.barCtx.isNullValue = true
    } else {
      this.barCtx.isNullValue = false
    }
    if (w.config.stroke.show) {
      if (!this.barCtx.isNullValue) {
        strokeWidth = Array.isArray(this.barCtx.strokeWidth)
          ? this.barCtx.strokeWidth[realIndex]
          : this.barCtx.strokeWidth
      }
    }
    return strokeWidth
  }

  barBackground({ j, i, x1, x2, y1, y2, elSeries }) {
    const w = this.w
    const graphics = new Graphics(this.barCtx.ctx)

    const sr = new Series(this.barCtx.ctx)
    let activeSeriesIndex = sr.getActiveConfigSeriesIndex()

    if (
      this.barCtx.barOptions.colors.backgroundBarColors.length > 0 &&
      activeSeriesIndex === i
    ) {
      if (j >= this.barCtx.barOptions.colors.backgroundBarColors.length) {
        j -= this.barCtx.barOptions.colors.backgroundBarColors.length
      }

      let bcolor = this.barCtx.barOptions.colors.backgroundBarColors[j]
      let rect = graphics.drawRect(
        typeof x1 !== 'undefined' ? x1 : 0,
        typeof y1 !== 'undefined' ? y1 : 0,
        typeof x2 !== 'undefined' ? x2 : w.globals.gridWidth,
        typeof y2 !== 'undefined' ? y2 : w.globals.gridHeight,
        this.barCtx.barOptions.colors.backgroundBarRadius,
        bcolor,
        this.barCtx.barOptions.colors.backgroundBarOpacity
      )
      elSeries.add(rect)
      rect.node.classList.add('apexcharts-backgroundBar')
    }
  }

  getColumnPaths({
    barWidth,
    barXPosition,
    yRatio,
    y1,
    y2,
    strokeWidth,
    series,
    realIndex,
    i,
    j,
    w
  }) {
    const graphics = new Graphics(this.barCtx.ctx)
    strokeWidth = Array.isArray(strokeWidth)
      ? strokeWidth[realIndex]
      : strokeWidth
    if (!strokeWidth) strokeWidth = 0

    let shapeOpts = {
      barWidth,
      strokeWidth,
      yRatio,
      barXPosition,
      y1,
      y2
    }
    let newPath = this.getRoundedBars(w, shapeOpts, series, i, j)

    const x1 = barXPosition
    const x2 = barXPosition + barWidth

    let pathTo = graphics.move(x1, y1)
    let pathFrom = graphics.move(x1, y1)

    const sl = graphics.line(x2 - strokeWidth, y1)
    if (w.globals.previousPaths.length > 0) {
      pathFrom = this.barCtx.getPreviousPath(realIndex, j, false)
    }

    pathTo =
      pathTo +
      graphics.line(x1, newPath.y2) +
      newPath.pathWithRadius +
      graphics.line(x2 - strokeWidth, newPath.y2) +
      sl +
      sl +
      'z'

    // the lines in pathFrom are repeated to equal it to the points of pathTo
    // this is to avoid weird animation (bug in svg.js)
    pathFrom =
      pathFrom +
      graphics.line(x1, y1) +
      sl +
      sl +
      sl +
      sl +
      sl +
      graphics.line(x1, y1)

    if (w.config.chart.stacked) {
      this.barCtx.yArrj.push(newPath.y2)
      this.barCtx.yArrjF.push(Math.abs(y1 - newPath.y2))
      this.barCtx.yArrjVal.push(this.barCtx.series[i][j])
    }

    return {
      pathTo,
      pathFrom
    }
  }

  getBarpaths({
    barYPosition,
    barHeight,
    x1,
    x2,
    strokeWidth,
    series,
    realIndex,
    i,
    j,
    w
  }) {
    const graphics = new Graphics(this.barCtx.ctx)
    strokeWidth = Array.isArray(strokeWidth)
      ? strokeWidth[realIndex]
      : strokeWidth
    if (!strokeWidth) strokeWidth = 0

    let shapeOpts = {
      barHeight,
      strokeWidth,
      barYPosition,
      x2,
      x1
    }

    let newPath = this.getRoundedBars(w, shapeOpts, series, i, j)

    let pathTo = graphics.move(x1, barYPosition)
    let pathFrom = graphics.move(x1, barYPosition)

    if (w.globals.previousPaths.length > 0) {
      pathFrom = this.barCtx.getPreviousPath(realIndex, j, false)
    }

    const y1 = barYPosition
    const y2 = barYPosition + barHeight

    const sl = graphics.line(x1, y2 - strokeWidth)
    pathTo =
      pathTo +
      graphics.line(newPath.x2, y1) +
      newPath.pathWithRadius +
      graphics.line(newPath.x2, y2 - strokeWidth) +
      sl +
      sl +
      'z'

    pathFrom =
      pathFrom +
      graphics.line(x1, y1) +
      sl +
      sl +
      sl +
      sl +
      sl +
      graphics.line(x1, y1)

    if (w.config.chart.stacked) {
      this.barCtx.xArrj.push(newPath.x2)
      this.barCtx.xArrjF.push(Math.abs(x1 - newPath.x2))
      this.barCtx.xArrjVal.push(this.barCtx.series[i][j])
    }
    return {
      pathTo,
      pathFrom
    }
  }

  /** getRoundedBars draws border radius for bars/columns
   * @memberof Bar
   * @param {object} w - chart context
   * @param {object} opts - consists several properties like barHeight/barWidth
   * @param {array} series - global primary series
   * @param {int} i - current iterating series's index
   * @param {int} j - series's j of i
   * @return {object} pathWithRadius - ending shape path string
   *         newY/newX - which is calculated from existing x/y based on rounded border
   **/
  getRoundedBars(w, opts, series, i, j) {
    let graphics = new Graphics(this.barCtx.ctx)
    let radius = w.config.plotOptions.bar.borderRadius

    if (
      w.config.chart.stacked &&
      series.length > 1 &&
      i !== this.barCtx.radiusOnSeriesNumber
    ) {
      radius = 0
    }

    if (this.barCtx.isHorizontal) {
      let pathWithRadius = ''
      let x2 = opts.x2

      if (Math.abs(opts.x1 - opts.x2) < radius) {
        radius = Math.abs(opts.x1 - opts.x2)
      }

      if (typeof series[i][j] !== 'undefined' || series[i][j] !== null) {
        let inverse = this.barCtx.isReversed
          ? series[i][j] > 0
          : series[i][j] < 0

        if (inverse) radius = radius * -1

        x2 = x2 - radius

        pathWithRadius =
          graphics.quadraticCurve(
            x2 + radius,
            opts.barYPosition,
            x2 + radius,
            opts.barYPosition + (!inverse ? radius : radius * -1)
          ) +
          graphics.line(
            x2 + radius,
            opts.barYPosition +
              opts.barHeight -
              opts.strokeWidth -
              (!inverse ? radius : radius * -1)
          ) +
          graphics.quadraticCurve(
            x2 + radius,
            opts.barYPosition + opts.barHeight - opts.strokeWidth,
            x2,
            opts.barYPosition + opts.barHeight - opts.strokeWidth
          )
      }

      return {
        pathWithRadius,
        x2
      }
    } else {
      let pathWithRadius = ''
      let y2 = opts.y2

      if (Math.abs(opts.y1 - opts.y2) < radius) {
        radius = Math.abs(opts.y1 - opts.y2)
      }

      if (typeof series[i][j] !== 'undefined' || series[i][j] !== null) {
        let inverse = series[i][j] < 0

        if (inverse) radius = radius * -1

        y2 = y2 + radius

        pathWithRadius =
          graphics.quadraticCurve(
            opts.barXPosition,
            y2 - radius,
            opts.barXPosition + (!inverse ? radius : radius * -1),
            y2 - radius
          ) +
          graphics.line(
            opts.barXPosition +
              opts.barWidth -
              opts.strokeWidth -
              (!inverse ? radius : radius * -1),
            y2 - radius
          ) +
          graphics.quadraticCurve(
            opts.barXPosition + opts.barWidth - opts.strokeWidth,
            y2 - radius,
            opts.barXPosition + opts.barWidth - opts.strokeWidth,
            y2
          )
      }

      return {
        pathWithRadius,
        y2
      }
    }
  }

  checkZeroSeries({ series }) {
    let w = this.w
    for (let zs = 0; zs < series.length; zs++) {
      let total = 0
      for (
        let zsj = 0;
        zsj < series[w.globals.maxValsInArrayIndex].length;
        zsj++
      ) {
        total += series[zs][zsj]
      }
      if (total === 0) {
        this.barCtx.zeroSerieses.push(zs)
      }
    }

    // After getting all zeroserieses, we need to ensure whether radiusOnSeriesNumber is not in that zeroseries array
    for (let s = series.length - 1; s >= 0; s--) {
      if (
        this.barCtx.zeroSerieses.indexOf(s) > -1 &&
        s === this.radiusOnSeriesNumber
      ) {
        this.barCtx.radiusOnSeriesNumber -= 1
      }
    }

    for (let s = series.length - 1; s >= 0; s--) {
      if (
        w.globals.collapsedSeriesIndices.indexOf(
          this.barCtx.radiusOnSeriesNumber
        ) > -1
      ) {
        this.barCtx.radiusOnSeriesNumber -= 1
      }
    }
  }

  getXForValue(value, zeroW, zeroPositionForNull = true) {
    let xForVal = zeroPositionForNull ? zeroW : null
    if (typeof value !== 'undefined' && value !== null) {
      xForVal =
        zeroW +
        value / this.barCtx.invertedYRatio -
        (this.barCtx.isReversed ? value / this.barCtx.invertedYRatio : 0) * 2
    }
    return xForVal
  }

  getYForValue(value, zeroH, zeroPositionForNull = true) {
    let yForVal = zeroPositionForNull ? zeroH : null
    if (typeof value !== 'undefined' && value !== null) {
      yForVal =
        zeroH -
        value / this.barCtx.yRatio[this.barCtx.yaxisIndex] +
        (this.barCtx.isReversed
          ? value / this.barCtx.yRatio[this.barCtx.yaxisIndex]
          : 0) *
          2
    }
    return yForVal
  }

  getGoalValues(type, zeroW, zeroH, i, j) {
    const w = this.w

    let goals = []
    if (
      w.globals.seriesGoals[i] &&
      w.globals.seriesGoals[i][j] &&
      Array.isArray(w.globals.seriesGoals[i][j])
    ) {
      w.globals.seriesGoals[i][j].forEach((goal) => {
        goals.push({
          [type]:
            type === 'x'
              ? this.getXForValue(goal.value, zeroW, false)
              : this.getYForValue(goal.value, zeroH, false),
          attrs: goal
        })
      })
    }
    return goals
  }

  drawGoalLine({
    barXPosition,
    barYPosition,
    goalX,
    goalY,
    barWidth,
    barHeight
  }) {
    let graphics = new Graphics(this.barCtx.ctx)
    const lineGroup = graphics.group({
      className: 'apexcharts-bar-goals-groups'
    })

    let line = null
    if (this.barCtx.isHorizontal) {
      if (Array.isArray(goalX)) {
        goalX.forEach((goal) => {
          line = graphics.drawLine(
            goal.x,
            barYPosition,
            goal.x,
            barYPosition + barHeight,
            goal.attrs.strokeColor ? goal.attrs.strokeColor : undefined,
            0,
            goal.attrs.strokeWidth ? goal.attrs.strokeWidth : 2
          )
          lineGroup.add(line)
        })
      }
    } else {
      if (Array.isArray(goalY)) {
        goalY.forEach((goal) => {
          line = graphics.drawLine(
            barXPosition,
            goal.y,
            barXPosition + barWidth,
            goal.y,
            goal.attrs.strokeColor ? goal.attrs.strokeColor : undefined,
            0,
            goal.attrs.strokeWidth ? goal.attrs.strokeWidth : 2
          )
          lineGroup.add(line)
        })
      }
    }

    return lineGroup
  }
}
