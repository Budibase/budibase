import BarDataLabels from './common/bar/DataLabels'
import BarHelpers from './common/bar/Helpers'
import CoreUtils from '../modules/CoreUtils'
import Utils from '../utils/Utils'
import Filters from '../modules/Filters'
import Graphics from '../modules/Graphics'

/**
 * ApexCharts Bar Class responsible for drawing both Columns and Bars.
 *
 * @module Bar
 **/

class Bar {
  constructor(ctx, xyRatios) {
    this.ctx = ctx
    this.w = ctx.w
    const w = this.w
    this.barOptions = w.config.plotOptions.bar

    this.isHorizontal = this.barOptions.horizontal
    this.strokeWidth = w.config.stroke.width
    this.isNullValue = false

    this.isTimelineBar =
      w.config.xaxis.type === 'datetime' &&
      w.globals.seriesRangeBarTimeline.length

    this.xyRatios = xyRatios

    if (this.xyRatios !== null) {
      this.xRatio = xyRatios.xRatio
      this.initialXRatio = xyRatios.initialXRatio
      this.yRatio = xyRatios.yRatio
      this.invertedXRatio = xyRatios.invertedXRatio
      this.invertedYRatio = xyRatios.invertedYRatio
      this.baseLineY = xyRatios.baseLineY
      this.baseLineInvertedY = xyRatios.baseLineInvertedY
    }
    this.yaxisIndex = 0
    this.seriesLen = 0

    this.barHelpers = new BarHelpers(this)
  }

  /** primary draw method which is called on bar object
   * @memberof Bar
   * @param {array} series - user supplied series values
   * @param {int} seriesIndex - the index by which series will be drawn on the svg
   * @return {node} element which is supplied to parent chart draw method for appending
   **/
  draw(series, seriesIndex) {
    let w = this.w
    let graphics = new Graphics(this.ctx)

    const coreUtils = new CoreUtils(this.ctx, w)
    series = coreUtils.getLogSeries(series)
    this.series = series
    this.yRatio = coreUtils.getLogYRatios(this.yRatio)

    this.barHelpers.initVariables(series)

    let ret = graphics.group({
      class: 'apexcharts-bar-series apexcharts-plot-series'
    })

    if (w.config.dataLabels.enabled) {
      if (this.totalItems > this.barOptions.dataLabels.maxItems) {
        console.warn(
          'WARNING: DataLabels are enabled but there are too many to display. This may cause performance issue when rendering.'
        )
      }
    }

    for (let i = 0, bc = 0; i < series.length; i++, bc++) {
      let x,
        y,
        xDivision, // xDivision is the GRIDWIDTH divided by number of datapoints (columns)
        yDivision, // yDivision is the GRIDHEIGHT divided by number of datapoints (bars)
        zeroH, // zeroH is the baseline where 0 meets y axis
        zeroW // zeroW is the baseline where 0 meets x axis

      let yArrj = [] // hold y values of current iterating series
      let xArrj = [] // hold x values of current iterating series

      let realIndex = w.globals.comboCharts ? seriesIndex[i] : i

      // el to which series will be drawn
      let elSeries = graphics.group({
        class: `apexcharts-series`,
        rel: i + 1,
        seriesName: Utils.escapeString(w.globals.seriesNames[realIndex]),
        'data:realIndex': realIndex
      })

      this.ctx.series.addCollapsedClassToSeries(elSeries, realIndex)

      if (series[i].length > 0) {
        this.visibleI = this.visibleI + 1
      }

      let barHeight = 0
      let barWidth = 0

      if (this.yRatio.length > 1) {
        this.yaxisIndex = realIndex
      }

      this.isReversed =
        w.config.yaxis[this.yaxisIndex] &&
        w.config.yaxis[this.yaxisIndex].reversed

      let initPositions = this.barHelpers.initialPositions()

      y = initPositions.y
      barHeight = initPositions.barHeight
      yDivision = initPositions.yDivision
      zeroW = initPositions.zeroW

      x = initPositions.x
      barWidth = initPositions.barWidth
      xDivision = initPositions.xDivision
      zeroH = initPositions.zeroH

      if (!this.horizontal) {
        xArrj.push(x + barWidth / 2)
      }

      // eldatalabels
      let elDataLabelsWrap = graphics.group({
        class: 'apexcharts-datalabels',
        'data:realIndex': realIndex
      })

      let elGoalsMarkers = graphics.group({
        class: 'apexcharts-bar-goals-markers',
        style: `pointer-events: none`
      })

      for (let j = 0; j < w.globals.dataPoints; j++) {
        const strokeWidth = this.barHelpers.getStrokeWidth(i, j, realIndex)

        let paths = null
        const pathsParams = {
          indexes: {
            i,
            j,
            realIndex,
            bc
          },
          x,
          y,
          strokeWidth,
          elSeries
        }
        if (this.isHorizontal) {
          paths = this.drawBarPaths({
            ...pathsParams,
            barHeight,
            zeroW,
            yDivision
          })
          barWidth = this.series[i][j] / this.invertedYRatio
        } else {
          paths = this.drawColumnPaths({
            ...pathsParams,
            xDivision,
            barWidth,
            zeroH
          })
          barHeight = this.series[i][j] / this.yRatio[this.yaxisIndex]
        }

        const barGoalLine = this.barHelpers.drawGoalLine({
          barXPosition: paths.barXPosition,
          barYPosition: paths.barYPosition,
          goalX: paths.goalX,
          goalY: paths.goalY,
          barHeight,
          barWidth
        })

        if (barGoalLine) {
          elGoalsMarkers.add(barGoalLine)
        }

        y = paths.y
        x = paths.x

        // push current X
        if (j > 0) {
          xArrj.push(x + barWidth / 2)
        }

        yArrj.push(y)

        let pathFill = this.barHelpers.getPathFillColor(series, i, j, realIndex)

        this.renderSeries({
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
          elGoalsMarkers,
          visibleSeries: this.visibleI,
          type: 'bar'
        })
      }

      // push all x val arrays into main xArr
      w.globals.seriesXvalues[realIndex] = xArrj
      w.globals.seriesYvalues[realIndex] = yArrj

      ret.add(elSeries)
    }

    return ret
  }

  renderSeries({
    realIndex,
    pathFill,
    lineFill,
    j,
    i,
    pathFrom,
    pathTo,
    strokeWidth,
    elSeries,
    x,
    y,
    y1,
    y2,
    series,
    barHeight,
    barWidth,
    barYPosition,
    elDataLabelsWrap,
    elGoalsMarkers,
    visibleSeries,
    type
  }) {
    const w = this.w
    const graphics = new Graphics(this.ctx)

    if (!lineFill) {
      /* fix apexcharts#341 */
      lineFill = this.barOptions.distributed
        ? w.globals.stroke.colors[j]
        : w.globals.stroke.colors[realIndex]
    }

    if (w.config.series[i].data[j] && w.config.series[i].data[j].strokeColor) {
      lineFill = w.config.series[i].data[j].strokeColor
    }

    if (this.isNullValue) {
      pathFill = 'none'
    }

    let delay =
      ((j / w.config.chart.animations.animateGradually.delay) *
        (w.config.chart.animations.speed / w.globals.dataPoints)) /
      2.4

    let renderedPath = graphics.renderPaths({
      i,
      j,
      realIndex,
      pathFrom,
      pathTo,
      stroke: lineFill,
      strokeWidth,
      strokeLineCap: w.config.stroke.lineCap,
      fill: pathFill,
      animationDelay: delay,
      initialSpeed: w.config.chart.animations.speed,
      dataChangeSpeed: w.config.chart.animations.dynamicAnimation.speed,
      className: `apexcharts-${type}-area`
    })

    renderedPath.attr('clip-path', `url(#gridRectMask${w.globals.cuid})`)

    const forecast = w.config.forecastDataPoints
    if (forecast.count > 0) {
      if (j >= w.globals.dataPoints - forecast.count) {
        renderedPath.node.setAttribute('stroke-dasharray', forecast.dashArray)
        renderedPath.node.setAttribute('stroke-width', forecast.strokeWidth)
        renderedPath.node.setAttribute('fill-opacity', forecast.fillOpacity)
      }
    }

    if (typeof y1 !== 'undefined' && typeof y2 !== 'undefined') {
      renderedPath.attr('data-range-y1', y1)
      renderedPath.attr('data-range-y2', y2)
    }

    const filters = new Filters(this.ctx)
    filters.setSelectionFilter(renderedPath, realIndex, j)
    elSeries.add(renderedPath)

    let barDataLabels = new BarDataLabels(this)
    let dataLabels = barDataLabels.handleBarDataLabels({
      x,
      y,
      y1,
      y2,
      i,
      j,
      series,
      realIndex,
      barHeight,
      barWidth,
      barYPosition,
      renderedPath,
      visibleSeries
    })
    if (dataLabels !== null) {
      elDataLabelsWrap.add(dataLabels)
    }

    elSeries.add(elDataLabelsWrap)

    if (elGoalsMarkers) {
      elSeries.add(elGoalsMarkers)
    }
    return elSeries
  }

  drawBarPaths({
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

    let i = indexes.i
    let j = indexes.j

    if (w.globals.isXNumeric) {
      y =
        (w.globals.seriesX[i][j] - w.globals.minX) / this.invertedXRatio -
        barHeight
    }

    let barYPosition = y + barHeight * this.visibleI

    x = this.barHelpers.getXForValue(this.series[i][j], zeroW)

    const paths = this.barHelpers.getBarpaths({
      barYPosition,
      barHeight,
      x1: zeroW,
      x2: x,
      strokeWidth,
      series: this.series,
      realIndex: indexes.realIndex,
      i,
      j,
      w
    })

    if (!w.globals.isXNumeric) {
      y = y + yDivision
    }

    this.barHelpers.barBackground({
      j,
      i,
      y1: barYPosition - barHeight * this.visibleI,
      y2: barHeight * this.seriesLen,
      elSeries
    })

    return {
      pathTo: paths.pathTo,
      pathFrom: paths.pathFrom,
      x,
      y,
      goalX: this.barHelpers.getGoalValues('x', zeroW, null, i, j),
      barYPosition
    }
  }

  drawColumnPaths({
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

    let realIndex = indexes.realIndex
    let i = indexes.i
    let j = indexes.j
    let bc = indexes.bc

    if (w.globals.isXNumeric) {
      let sxI = realIndex
      if (!w.globals.seriesX[realIndex].length) {
        sxI = w.globals.maxValsInArrayIndex
      }

      x =
        (w.globals.seriesX[sxI][j] - w.globals.minX) / this.xRatio -
        (barWidth * this.seriesLen) / 2
    }

    let barXPosition = x + barWidth * this.visibleI

    y = this.barHelpers.getYForValue(this.series[i][j], zeroH)

    const paths = this.barHelpers.getColumnPaths({
      barXPosition,
      barWidth,
      y1: zeroH,
      y2: y,
      strokeWidth,
      series: this.series,
      realIndex: indexes.realIndex,
      i,
      j,
      w
    })

    if (!w.globals.isXNumeric) {
      x = x + xDivision
    }

    this.barHelpers.barBackground({
      bc,
      j,
      i,
      x1: barXPosition - strokeWidth / 2 - barWidth * this.visibleI,
      x2: barWidth * this.seriesLen + strokeWidth / 2,
      elSeries
    })

    return {
      pathTo: paths.pathTo,
      pathFrom: paths.pathFrom,
      x,
      y,
      goalY: this.barHelpers.getGoalValues('y', null, zeroH, i, j),
      barXPosition
    }
  }

  /** getPreviousPath is a common function for bars/columns which is used to get previous paths when data changes.
   * @memberof Bar
   * @param {int} realIndex - current iterating i
   * @param {int} j - current iterating series's j index
   * @return {string} pathFrom is the string which will be appended in animations
   **/
  getPreviousPath(realIndex, j) {
    let w = this.w
    let pathFrom
    for (let pp = 0; pp < w.globals.previousPaths.length; pp++) {
      let gpp = w.globals.previousPaths[pp]

      if (
        gpp.paths &&
        gpp.paths.length > 0 &&
        parseInt(gpp.realIndex, 10) === parseInt(realIndex, 10)
      ) {
        if (typeof w.globals.previousPaths[pp].paths[j] !== 'undefined') {
          pathFrom = w.globals.previousPaths[pp].paths[j].d
        }
      }
    }
    return pathFrom
  }
}

export default Bar
