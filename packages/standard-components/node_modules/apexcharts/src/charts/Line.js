import CoreUtils from '../modules/CoreUtils'
import Graphics from '../modules/Graphics'
import Fill from '../modules/Fill'
import DataLabels from '../modules/DataLabels'
import Markers from '../modules/Markers'
import Scatter from './Scatter'
import Utils from '../utils/Utils'
import Helpers from './common/line/Helpers'

/**
 * ApexCharts Line Class responsible for drawing Line / Area Charts.
 * This class is also responsible for generating values for Bubble/Scatter charts, so need to rename it to Axis Charts to avoid confusions
 * @module Line
 **/

class Line {
  constructor(ctx, xyRatios, isPointsChart) {
    this.ctx = ctx
    this.w = ctx.w

    this.xyRatios = xyRatios

    this.pointsChart =
      !(
        this.w.config.chart.type !== 'bubble' &&
        this.w.config.chart.type !== 'scatter'
      ) || isPointsChart

    this.scatter = new Scatter(this.ctx)

    this.noNegatives = this.w.globals.minX === Number.MAX_VALUE

    this.lineHelpers = new Helpers(this)
    this.markers = new Markers(this.ctx)

    this.prevSeriesY = []
    this.categoryAxisCorrection = 0
    this.yaxisIndex = 0
  }

  draw(series, ptype, seriesIndex) {
    let w = this.w
    let graphics = new Graphics(this.ctx)
    let type = w.globals.comboCharts ? ptype : w.config.chart.type
    let ret = graphics.group({
      class: `apexcharts-${type}-series apexcharts-plot-series`
    })

    const coreUtils = new CoreUtils(this.ctx, w)
    this.yRatio = this.xyRatios.yRatio
    this.zRatio = this.xyRatios.zRatio
    this.xRatio = this.xyRatios.xRatio
    this.baseLineY = this.xyRatios.baseLineY

    series = coreUtils.getLogSeries(series)
    this.yRatio = coreUtils.getLogYRatios(this.yRatio)

    // push all series in an array, so we can draw in reverse order (for stacked charts)
    let allSeries = []

    for (let i = 0; i < series.length; i++) {
      series = this.lineHelpers.sameValueSeriesFix(i, series)

      let realIndex = w.globals.comboCharts ? seriesIndex[i] : i

      this._initSerieVariables(series, i, realIndex)

      let yArrj = [] // hold y values of current iterating series
      let xArrj = [] // hold x values of current iterating series

      let x = w.globals.padHorizontal + this.categoryAxisCorrection
      let y = 1

      let linePaths = []
      let areaPaths = []

      this.ctx.series.addCollapsedClassToSeries(this.elSeries, realIndex)

      if (w.globals.isXNumeric && w.globals.seriesX.length > 0) {
        x = (w.globals.seriesX[realIndex][0] - w.globals.minX) / this.xRatio
      }

      xArrj.push(x)

      let pX = x
      let pY
      let prevX = pX
      let prevY = this.zeroY
      let lineYPosition = 0

      // the first value in the current series is not null or undefined
      let firstPrevY = this.lineHelpers.determineFirstPrevY({
        i,
        series,
        prevY,
        lineYPosition
      })
      prevY = firstPrevY.prevY

      yArrj.push(prevY)
      pY = prevY

      let pathsFrom = this._calculatePathsFrom({
        series,
        i,
        realIndex,
        prevX,
        prevY
      })

      let paths = this._iterateOverDataPoints({
        series,
        realIndex,
        i,
        x,
        y,
        pX,
        pY,
        pathsFrom,
        linePaths,
        areaPaths,
        seriesIndex,
        lineYPosition,
        xArrj,
        yArrj
      })

      this._handlePaths({ type, realIndex, i, paths })

      this.elSeries.add(this.elPointsMain)
      this.elSeries.add(this.elDataLabelsWrap)

      allSeries.push(this.elSeries)
    }

    if (w.config.chart.stacked) {
      for (let s = allSeries.length; s > 0; s--) {
        ret.add(allSeries[s - 1])
      }
    } else {
      for (let s = 0; s < allSeries.length; s++) {
        ret.add(allSeries[s])
      }
    }

    return ret
  }

  _initSerieVariables(series, i, realIndex) {
    const w = this.w
    const graphics = new Graphics(this.ctx)

    // width divided into equal parts
    this.xDivision =
      w.globals.gridWidth /
      (w.globals.dataPoints - (w.config.xaxis.tickPlacement === 'on' ? 1 : 0))

    this.strokeWidth = Array.isArray(w.config.stroke.width)
      ? w.config.stroke.width[realIndex]
      : w.config.stroke.width

    if (this.yRatio.length > 1) {
      this.yaxisIndex = realIndex
    }

    this.isReversed =
      w.config.yaxis[this.yaxisIndex] &&
      w.config.yaxis[this.yaxisIndex].reversed

    // zeroY is the 0 value in y series which can be used in negative charts
    this.zeroY =
      w.globals.gridHeight -
      this.baseLineY[this.yaxisIndex] -
      (this.isReversed ? w.globals.gridHeight : 0) +
      (this.isReversed ? this.baseLineY[this.yaxisIndex] * 2 : 0)

    this.areaBottomY = this.zeroY
    if (
      this.zeroY > w.globals.gridHeight ||
      w.config.plotOptions.area.fillTo === 'end'
    ) {
      this.areaBottomY = w.globals.gridHeight
    }

    this.categoryAxisCorrection = this.xDivision / 2

    // el to which series will be drawn
    this.elSeries = graphics.group({
      class: `apexcharts-series`,
      seriesName: Utils.escapeString(w.globals.seriesNames[realIndex])
    })

    // points
    this.elPointsMain = graphics.group({
      class: 'apexcharts-series-markers-wrap',
      'data:realIndex': realIndex
    })

    // eldatalabels
    this.elDataLabelsWrap = graphics.group({
      class: 'apexcharts-datalabels',
      'data:realIndex': realIndex
    })

    let longestSeries = series[i].length === w.globals.dataPoints
    this.elSeries.attr({
      'data:longestSeries': longestSeries,
      rel: i + 1,
      'data:realIndex': realIndex
    })

    this.appendPathFrom = true
  }

  _calculatePathsFrom({ series, i, realIndex, prevX, prevY }) {
    const w = this.w
    const graphics = new Graphics(this.ctx)
    let linePath, areaPath, pathFromLine, pathFromArea

    if (series[i][0] === null) {
      // when the first value itself is null, we need to move the pointer to a location where a null value is not found
      for (let s = 0; s < series[i].length; s++) {
        if (series[i][s] !== null) {
          prevX = this.xDivision * s
          prevY = this.zeroY - series[i][s] / this.yRatio[this.yaxisIndex]
          linePath = graphics.move(prevX, prevY)
          areaPath = graphics.move(prevX, this.areaBottomY)
          break
        }
      }
    } else {
      linePath = graphics.move(prevX, prevY)
      areaPath =
        graphics.move(prevX, this.areaBottomY) + graphics.line(prevX, prevY)
    }

    pathFromLine = graphics.move(-1, this.zeroY) + graphics.line(-1, this.zeroY)
    pathFromArea = graphics.move(-1, this.zeroY) + graphics.line(-1, this.zeroY)

    if (w.globals.previousPaths.length > 0) {
      const pathFrom = this.lineHelpers.checkPreviousPaths({
        pathFromLine,
        pathFromArea,
        realIndex
      })
      pathFromLine = pathFrom.pathFromLine
      pathFromArea = pathFrom.pathFromArea
    }

    return {
      prevX,
      prevY,
      linePath,
      areaPath,
      pathFromLine,
      pathFromArea
    }
  }

  _handlePaths({ type, realIndex, i, paths }) {
    const w = this.w
    const graphics = new Graphics(this.ctx)
    const fill = new Fill(this.ctx)

    // push all current y values array to main PrevY Array
    this.prevSeriesY.push(paths.yArrj)

    // push all x val arrays into main xArr
    w.globals.seriesXvalues[realIndex] = paths.xArrj
    w.globals.seriesYvalues[realIndex] = paths.yArrj

    const forecast = w.config.forecastDataPoints
    if (forecast.count > 0) {
      const forecastCutoff =
        w.globals.seriesXvalues[realIndex][
          w.globals.seriesXvalues[realIndex].length - forecast.count - 1
        ]
      const elForecastMask = graphics.drawRect(
        forecastCutoff,
        0,
        w.globals.gridWidth,
        w.globals.gridHeight,
        0
      )
      w.globals.dom.elForecastMask.appendChild(elForecastMask.node)

      const elNonForecastMask = graphics.drawRect(
        0,
        0,
        forecastCutoff,
        w.globals.gridHeight,
        0
      )
      w.globals.dom.elNonForecastMask.appendChild(elNonForecastMask.node)
    }

    // these elements will be shown after area path animation completes
    if (!this.pointsChart) {
      w.globals.delayedElements.push({
        el: this.elPointsMain.node,
        index: realIndex
      })
    }

    const defaultRenderedPathOptions = {
      i,
      realIndex,
      animationDelay: i,
      initialSpeed: w.config.chart.animations.speed,
      dataChangeSpeed: w.config.chart.animations.dynamicAnimation.speed,
      className: `apexcharts-${type}`
    }

    if (type === 'area') {
      let pathFill = fill.fillPath({
        seriesNumber: realIndex
      })

      for (let p = 0; p < paths.areaPaths.length; p++) {
        let renderedPath = graphics.renderPaths({
          ...defaultRenderedPathOptions,
          pathFrom: paths.pathFromArea,
          pathTo: paths.areaPaths[p],
          stroke: 'none',
          strokeWidth: 0,
          strokeLineCap: null,
          fill: pathFill
        })

        this.elSeries.add(renderedPath)
      }
    }

    if (w.config.stroke.show && !this.pointsChart) {
      let lineFill = null
      if (type === 'line') {
        // fillable lines only for lineChart
        lineFill = fill.fillPath({
          seriesNumber: realIndex,
          i
        })
      } else {
        lineFill = w.globals.stroke.colors[realIndex]
      }

      for (let p = 0; p < paths.linePaths.length; p++) {
        const linePathCommonOpts = {
          ...defaultRenderedPathOptions,
          pathFrom: paths.pathFromLine,
          pathTo: paths.linePaths[p],
          stroke: lineFill,
          strokeWidth: this.strokeWidth,
          strokeLineCap: w.config.stroke.lineCap,
          fill: 'none'
        }
        let renderedPath = graphics.renderPaths(linePathCommonOpts)
        this.elSeries.add(renderedPath)

        if (forecast.count > 0) {
          let renderedForecastPath = graphics.renderPaths(linePathCommonOpts)

          renderedForecastPath.node.setAttribute(
            'stroke-dasharray',
            forecast.dashArray
          )

          if (forecast.strokeWidth) {
            renderedForecastPath.node.setAttribute(
              'stroke-width',
              forecast.strokeWidth
            )
          }

          this.elSeries.add(renderedForecastPath)
          renderedForecastPath.attr(
            'clip-path',
            `url(#forecastMask${w.globals.cuid})`
          )
          renderedPath.attr(
            'clip-path',
            `url(#nonForecastMask${w.globals.cuid})`
          )
        }
      }
    }
  }

  _iterateOverDataPoints({
    series,
    realIndex,
    i,
    x,
    y,
    pX,
    pY,
    pathsFrom,
    linePaths,
    areaPaths,
    seriesIndex,
    lineYPosition,
    xArrj,
    yArrj
  }) {
    const w = this.w
    let graphics = new Graphics(this.ctx)
    let yRatio = this.yRatio
    let { prevY, linePath, areaPath, pathFromLine, pathFromArea } = pathsFrom

    const minY = Utils.isNumber(w.globals.minYArr[realIndex])
      ? w.globals.minYArr[realIndex]
      : w.globals.minY

    const iterations =
      w.globals.dataPoints > 1 ? w.globals.dataPoints - 1 : w.globals.dataPoints

    for (let j = 0; j < iterations; j++) {
      const isNull =
        typeof series[i][j + 1] === 'undefined' || series[i][j + 1] === null

      if (w.globals.isXNumeric) {
        let sX = w.globals.seriesX[realIndex][j + 1]
        if (typeof w.globals.seriesX[realIndex][j + 1] === 'undefined') {
          /* fix #374 */
          sX = w.globals.seriesX[realIndex][iterations - 1]
        }
        x = (sX - w.globals.minX) / this.xRatio
      } else {
        x = x + this.xDivision
      }

      if (w.config.chart.stacked) {
        if (
          i > 0 &&
          w.globals.collapsedSeries.length < w.config.series.length - 1
        ) {
          // a collapsed series in a stacked bar chart may provide wrong result for the next series, hence find the prevIndex of prev series which is not collapsed - fixes apexcharts.js#1372
          const prevIndex = (pi) => {
            let pii = pi
            for (let cpi = 0; cpi < w.globals.series.length; cpi++) {
              if (w.globals.collapsedSeriesIndices.indexOf(pi) > -1) {
                pii--
                break
              }
            }

            return pii >= 0 ? pii : 0
          }
          lineYPosition = this.prevSeriesY[prevIndex(i - 1)][j + 1]
        } else {
          // the first series will not have prevY values
          lineYPosition = this.zeroY
        }
      } else {
        lineYPosition = this.zeroY
      }

      if (isNull) {
        y =
          lineYPosition -
          minY / yRatio[this.yaxisIndex] +
          (this.isReversed ? minY / yRatio[this.yaxisIndex] : 0) * 2
      } else {
        y =
          lineYPosition -
          series[i][j + 1] / yRatio[this.yaxisIndex] +
          (this.isReversed ? series[i][j + 1] / yRatio[this.yaxisIndex] : 0) * 2
      }

      // push current X
      xArrj.push(x)

      // push current Y that will be used as next series's bottom position
      yArrj.push(y)

      let pointsPos = this.lineHelpers.calculatePoints({
        series,
        x,
        y,
        realIndex,
        i,
        j,
        prevY
      })

      let calculatedPaths = this._createPaths({
        series,
        i,
        realIndex,
        j,
        x,
        y,
        pX,
        pY,
        linePath,
        areaPath,
        linePaths,
        areaPaths,
        seriesIndex
      })

      areaPaths = calculatedPaths.areaPaths
      linePaths = calculatedPaths.linePaths
      pX = calculatedPaths.pX
      pY = calculatedPaths.pY
      areaPath = calculatedPaths.areaPath
      linePath = calculatedPaths.linePath

      if (this.appendPathFrom) {
        pathFromLine = pathFromLine + graphics.line(x, this.zeroY)
        pathFromArea = pathFromArea + graphics.line(x, this.zeroY)
      }

      this.handleNullDataPoints(series, pointsPos, i, j, realIndex)

      this._handleMarkersAndLabels({
        pointsPos,
        series,
        x,
        y,
        prevY,
        i,
        j,
        realIndex
      })
    }

    return {
      yArrj,
      xArrj,
      pathFromArea,
      areaPaths,
      pathFromLine,
      linePaths
    }
  }

  _handleMarkersAndLabels({ pointsPos, series, x, y, prevY, i, j, realIndex }) {
    const w = this.w
    let dataLabels = new DataLabels(this.ctx)

    if (!this.pointsChart) {
      if (w.globals.series[i].length > 1) {
        this.elPointsMain.node.classList.add('apexcharts-element-hidden')
      }

      let elPointsWrap = this.markers.plotChartMarkers(
        pointsPos,
        realIndex,
        j + 1
      )
      if (elPointsWrap !== null) {
        this.elPointsMain.add(elPointsWrap)
      }
    } else {
      // scatter / bubble chart points creation
      this.scatter.draw(this.elSeries, j, {
        realIndex,
        pointsPos,
        zRatio: this.zRatio,
        elParent: this.elPointsMain
      })
    }

    let drawnLabels = dataLabels.drawDataLabel(
      pointsPos,
      realIndex,
      j + 1,
      null
    )
    if (drawnLabels !== null) {
      this.elDataLabelsWrap.add(drawnLabels)
    }
  }

  _createPaths({
    series,
    i,
    realIndex,
    j,
    x,
    y,
    pX,
    pY,
    linePath,
    areaPath,
    linePaths,
    areaPaths,
    seriesIndex
  }) {
    let w = this.w
    let graphics = new Graphics(this.ctx)

    let curve = w.config.stroke.curve
    const areaBottomY = this.areaBottomY

    if (Array.isArray(w.config.stroke.curve)) {
      if (Array.isArray(seriesIndex)) {
        curve = w.config.stroke.curve[seriesIndex[i]]
      } else {
        curve = w.config.stroke.curve[i]
      }
    }

    // logic of smooth curve derived from chartist
    // CREDITS: https://gionkunz.github.io/chartist-js/
    if (curve === 'smooth') {
      let length = (x - pX) * 0.35
      if (w.globals.hasNullValues) {
        if (series[i][j] !== null) {
          if (series[i][j + 1] !== null) {
            linePath =
              graphics.move(pX, pY) +
              graphics.curve(pX + length, pY, x - length, y, x + 1, y)
            areaPath =
              graphics.move(pX + 1, pY) +
              graphics.curve(pX + length, pY, x - length, y, x + 1, y) +
              graphics.line(x, areaBottomY) +
              graphics.line(pX, areaBottomY) +
              'z'
          } else {
            linePath = graphics.move(pX, pY)
            areaPath = graphics.move(pX, pY) + 'z'
          }
        }

        linePaths.push(linePath)
        areaPaths.push(areaPath)
      } else {
        linePath =
          linePath + graphics.curve(pX + length, pY, x - length, y, x, y)
        areaPath =
          areaPath + graphics.curve(pX + length, pY, x - length, y, x, y)
      }

      pX = x
      pY = y

      if (j === series[i].length - 2) {
        // last loop, close path
        areaPath =
          areaPath +
          graphics.curve(pX, pY, x, y, x, areaBottomY) +
          graphics.move(x, y) +
          'z'
        if (!w.globals.hasNullValues) {
          linePaths.push(linePath)
          areaPaths.push(areaPath)
        }
      }
    } else {
      if (series[i][j + 1] === null) {
        linePath = linePath + graphics.move(x, y)

        const numericOrCatX = w.globals.isXNumeric
          ? (w.globals.seriesX[realIndex][j] - w.globals.minX) / this.xRatio
          : x - this.xDivision
        areaPath =
          areaPath +
          graphics.line(numericOrCatX, areaBottomY) +
          graphics.move(x, y) +
          'z'
      }
      if (series[i][j] === null) {
        linePath = linePath + graphics.move(x, y)
        areaPath = areaPath + graphics.move(x, areaBottomY)
      }

      if (curve === 'stepline') {
        linePath =
          linePath + graphics.line(x, null, 'H') + graphics.line(null, y, 'V')
        areaPath =
          areaPath + graphics.line(x, null, 'H') + graphics.line(null, y, 'V')
      } else if (curve === 'straight') {
        linePath = linePath + graphics.line(x, y)
        areaPath = areaPath + graphics.line(x, y)
      }

      if (j === series[i].length - 2) {
        // last loop, close path
        areaPath =
          areaPath + graphics.line(x, areaBottomY) + graphics.move(x, y) + 'z'
        linePaths.push(linePath)
        areaPaths.push(areaPath)
      }
    }

    return {
      linePaths,
      areaPaths,
      pX,
      pY,
      linePath,
      areaPath
    }
  }

  handleNullDataPoints(series, pointsPos, i, j, realIndex) {
    const w = this.w
    if (
      (series[i][j] === null && w.config.markers.showNullDataPoints) ||
      series[i].length === 1
    ) {
      // fixes apexcharts.js#1282, #1252
      let elPointsWrap = this.markers.plotChartMarkers(
        pointsPos,
        realIndex,
        j + 1,
        this.strokeWidth - w.config.markers.strokeWidth / 2,
        true
      )
      if (elPointsWrap !== null) {
        this.elPointsMain.add(elPointsWrap)
      }
    }
  }
}

export default Line
