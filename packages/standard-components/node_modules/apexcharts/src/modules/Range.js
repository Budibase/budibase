import Utils from '../utils/Utils'
import DateTime from '../utils/DateTime'
import Scales from './Scales'

/**
 * Range is used to generates values between min and max.
 *
 * @module Range
 **/

class Range {
  constructor(ctx) {
    this.ctx = ctx
    this.w = ctx.w

    this.scales = new Scales(ctx)
  }

  init() {
    this.setYRange()
    this.setXRange()
    this.setZRange()
  }

  getMinYMaxY(
    startingIndex,
    lowestY = Number.MAX_VALUE,
    highestY = -Number.MAX_VALUE,
    len = null
  ) {
    const cnf = this.w.config
    const gl = this.w.globals
    let maxY = -Number.MAX_VALUE
    let minY = Number.MIN_VALUE

    if (len === null) {
      len = startingIndex + 1
    }
    const series = gl.series
    let seriesMin = series
    let seriesMax = series

    if (cnf.chart.type === 'candlestick') {
      seriesMin = gl.seriesCandleL
      seriesMax = gl.seriesCandleH
    } else if (cnf.chart.type === 'boxPlot') {
      seriesMin = gl.seriesCandleO
      seriesMax = gl.seriesCandleC
    } else if (gl.isRangeData) {
      seriesMin = gl.seriesRangeStart
      seriesMax = gl.seriesRangeEnd
    }

    for (let i = startingIndex; i < len; i++) {
      gl.dataPoints = Math.max(gl.dataPoints, series[i].length)

      for (let j = 0; j < gl.series[i].length; j++) {
        let val = series[i][j]
        if (val !== null && Utils.isNumber(val)) {
          if (typeof seriesMax[i][j] !== 'undefined') {
            maxY = Math.max(maxY, seriesMax[i][j])
          }
          if (typeof seriesMin[i][j] !== 'undefined') {
            lowestY = Math.min(lowestY, seriesMin[i][j])
            highestY = Math.max(highestY, seriesMin[i][j])
          }

          if (
            this.w.config.chart.type === 'candlestick' ||
            this.w.config.chart.type === 'boxPlot'
          ) {
            if (typeof gl.seriesCandleC[i][j] !== 'undefined') {
              maxY = Math.max(maxY, gl.seriesCandleO[i][j])
              maxY = Math.max(maxY, gl.seriesCandleH[i][j])
              maxY = Math.max(maxY, gl.seriesCandleL[i][j])
              maxY = Math.max(maxY, gl.seriesCandleC[i][j])
              if (this.w.config.chart.type === 'boxPlot') {
                maxY = Math.max(maxY, gl.seriesCandleM[i][j])
              }
            }

            // there is a combo chart and the specified series in not either candlestick or boxplot, find the max there
            if (
              cnf.series[i].type &&
              (cnf.series[i].type !== 'candlestick' ||
                cnf.series[i].type !== 'boxPlot')
            ) {
              maxY = Math.max(maxY, gl.series[i][j])
              lowestY = Math.min(lowestY, gl.series[i][j])
            }

            highestY = maxY
          }

          if (
            gl.seriesGoals[i] &&
            gl.seriesGoals[i][j] &&
            Array.isArray(gl.seriesGoals[i][j])
          ) {
            gl.seriesGoals[i][j].forEach((g) => {
              if (minY !== Number.MIN_VALUE) {
                minY = Math.min(minY, g.value)
                lowestY = minY
              }
              maxY = Math.max(maxY, g.value)
              highestY = maxY
            })
          }

          if (Utils.isFloat(val)) {
            val = Utils.noExponents(val)
            gl.yValueDecimal = Math.max(
              gl.yValueDecimal,
              val.toString().split('.')[1].length
            )
          }
          if (minY > seriesMin[i][j] && seriesMin[i][j] < 0) {
            minY = seriesMin[i][j]
          }
        } else {
          gl.hasNullValues = true
        }
      }
    }

    if (
      cnf.chart.type === 'rangeBar' &&
      gl.seriesRangeStart.length &&
      gl.isBarHorizontal &&
      cnf.xaxis.type === 'datetime'
    ) {
      minY = lowestY
    }

    if (cnf.chart.type === 'bar') {
      if (minY < 0 && maxY < 0) {
        // all negative values in a bar chart, hence make the max to 0
        maxY = 0
      }
      if (minY === Number.MIN_VALUE) {
        minY = 0
      }
    }

    return {
      minY,
      maxY,
      lowestY,
      highestY
    }
  }

  setYRange() {
    let gl = this.w.globals
    let cnf = this.w.config
    gl.maxY = -Number.MAX_VALUE
    gl.minY = Number.MIN_VALUE

    let lowestYInAllSeries = Number.MAX_VALUE

    if (gl.isMultipleYAxis) {
      // we need to get minY and maxY for multiple y axis
      for (let i = 0; i < gl.series.length; i++) {
        const minYMaxYArr = this.getMinYMaxY(i, lowestYInAllSeries, null, i + 1)
        gl.minYArr.push(minYMaxYArr.minY)
        gl.maxYArr.push(minYMaxYArr.maxY)
        lowestYInAllSeries = minYMaxYArr.lowestY
      }
    }

    // and then, get the minY and maxY from all series
    const minYMaxY = this.getMinYMaxY(
      0,
      lowestYInAllSeries,
      null,
      gl.series.length
    )
    gl.minY = minYMaxY.minY
    gl.maxY = minYMaxY.maxY
    lowestYInAllSeries = minYMaxY.lowestY

    if (cnf.chart.stacked) {
      this._setStackedMinMax()
    }

    // if the numbers are too big, reduce the range
    // for eg, if number is between 100000-110000, putting 0 as the lowest value is not so good idea. So change the gl.minY for line/area/candlesticks/boxPlot
    if (
      cnf.chart.type === 'line' ||
      cnf.chart.type === 'area' ||
      cnf.chart.type === 'candlestick' ||
      cnf.chart.type === 'boxPlot' ||
      (cnf.chart.type === 'rangeBar' && !gl.isBarHorizontal)
    ) {
      if (
        gl.minY === Number.MIN_VALUE &&
        lowestYInAllSeries !== -Number.MAX_VALUE &&
        lowestYInAllSeries !== gl.maxY // single value possibility
      ) {
        let diff = gl.maxY - lowestYInAllSeries
        if (
          (lowestYInAllSeries >= 0 && lowestYInAllSeries <= 10) ||
          cnf.yaxis[0].min !== undefined ||
          cnf.yaxis[0].max !== undefined
        ) {
          // if minY is already 0/low value, we don't want to go negatives here - so this check is essential.
          diff = 0
        }

        gl.minY = lowestYInAllSeries - (diff * 5) / 100

        /* fix https://github.com/apexcharts/apexcharts.js/issues/614 */
        /* fix https://github.com/apexcharts/apexcharts.js/issues/968 */
        if (lowestYInAllSeries > 0 && gl.minY < 0) {
          gl.minY = 0
        }

        /* fix https://github.com/apexcharts/apexcharts.js/issues/426 */
        gl.maxY = gl.maxY + (diff * 5) / 100
      }
    }

    cnf.yaxis.forEach((yaxe, index) => {
      // override all min/max values by user defined values (y axis)
      if (yaxe.max !== undefined) {
        if (typeof yaxe.max === 'number') {
          gl.maxYArr[index] = yaxe.max
        } else if (typeof yaxe.max === 'function') {
          // fixes apexcharts.js/issues/2098
          gl.maxYArr[index] = yaxe.max(
            gl.isMultipleYAxis ? gl.maxYArr[index] : gl.maxY
          )
        }

        // gl.maxY is for single y-axis chart, it will be ignored in multi-yaxis
        gl.maxY = gl.maxYArr[index]
      }
      if (yaxe.min !== undefined) {
        if (typeof yaxe.min === 'number') {
          gl.minYArr[index] = yaxe.min
        } else if (typeof yaxe.min === 'function') {
          // fixes apexcharts.js/issues/2098
          gl.minYArr[index] = yaxe.min(
            gl.isMultipleYAxis
              ? gl.minYArr[index] === Number.MIN_VALUE
                ? 0
                : gl.minYArr[index]
              : gl.minY
          )
        }
        // gl.minY is for single y-axis chart, it will be ignored in multi-yaxis
        gl.minY = gl.minYArr[index]
      }
    })

    // for horizontal bar charts, we need to check xaxis min/max as user may have specified there
    if (gl.isBarHorizontal) {
      const minmax = ['min', 'max']
      minmax.forEach((m) => {
        if (cnf.xaxis[m] !== undefined && typeof cnf.xaxis[m] === 'number') {
          m === 'min' ? (gl.minY = cnf.xaxis[m]) : (gl.maxY = cnf.xaxis[m])
        }
      })
    }

    // for multi y-axis we need different scales for each
    if (gl.isMultipleYAxis) {
      this.scales.setMultipleYScales()
      gl.minY = lowestYInAllSeries
      gl.yAxisScale.forEach((scale, i) => {
        gl.minYArr[i] = scale.niceMin
        gl.maxYArr[i] = scale.niceMax
      })
    } else {
      this.scales.setYScaleForIndex(0, gl.minY, gl.maxY)
      gl.minY = gl.yAxisScale[0].niceMin
      gl.maxY = gl.yAxisScale[0].niceMax
      gl.minYArr[0] = gl.yAxisScale[0].niceMin
      gl.maxYArr[0] = gl.yAxisScale[0].niceMax
    }

    return {
      minY: gl.minY,
      maxY: gl.maxY,
      minYArr: gl.minYArr,
      maxYArr: gl.maxYArr,
      yAxisScale: gl.yAxisScale
    }
  }

  setXRange() {
    let gl = this.w.globals
    let cnf = this.w.config

    const isXNumeric =
      cnf.xaxis.type === 'numeric' ||
      cnf.xaxis.type === 'datetime' ||
      (cnf.xaxis.type === 'category' && !gl.noLabelsProvided) ||
      gl.noLabelsProvided ||
      gl.isXNumeric

    const getInitialMinXMaxX = () => {
      for (let i = 0; i < gl.series.length; i++) {
        if (gl.labels[i]) {
          for (let j = 0; j < gl.labels[i].length; j++) {
            if (gl.labels[i][j] !== null && Utils.isNumber(gl.labels[i][j])) {
              gl.maxX = Math.max(gl.maxX, gl.labels[i][j])
              gl.initialMaxX = Math.max(gl.maxX, gl.labels[i][j])
              gl.minX = Math.min(gl.minX, gl.labels[i][j])
              gl.initialMinX = Math.min(gl.minX, gl.labels[i][j])
            }
          }
        }
      }
    }
    // minX maxX starts here
    if (gl.isXNumeric) {
      getInitialMinXMaxX()
    }

    if (gl.noLabelsProvided) {
      if (cnf.xaxis.categories.length === 0) {
        gl.maxX = gl.labels[gl.labels.length - 1]
        gl.initialMaxX = gl.labels[gl.labels.length - 1]
        gl.minX = 1
        gl.initialMinX = 1
      }
    }

    if (gl.isXNumeric || gl.noLabelsProvided || gl.dataFormatXNumeric) {
      let ticks

      if (cnf.xaxis.tickAmount === undefined) {
        ticks = Math.round(gl.svgWidth / 150)

        // no labels provided and total number of dataPoints is less than 30
        if (cnf.xaxis.type === 'numeric' && gl.dataPoints < 30) {
          ticks = gl.dataPoints - 1
        }

        // this check is for when ticks exceeds total datapoints and that would result in duplicate labels
        if (ticks > gl.dataPoints && gl.dataPoints !== 0) {
          ticks = gl.dataPoints - 1
        }
      } else if (cnf.xaxis.tickAmount === 'dataPoints') {
        if (gl.series.length > 1) {
          ticks = gl.series[gl.maxValsInArrayIndex].length - 1
        }
        if (gl.isXNumeric) {
          ticks = gl.maxX - gl.minX - 1
        }
      } else {
        ticks = cnf.xaxis.tickAmount
      }
      gl.xTickAmount = ticks

      // override all min/max values by user defined values (x axis)
      if (cnf.xaxis.max !== undefined && typeof cnf.xaxis.max === 'number') {
        gl.maxX = cnf.xaxis.max
      }
      if (cnf.xaxis.min !== undefined && typeof cnf.xaxis.min === 'number') {
        gl.minX = cnf.xaxis.min
      }

      // if range is provided, adjust the new minX
      if (cnf.xaxis.range !== undefined) {
        gl.minX = gl.maxX - cnf.xaxis.range
      }

      if (gl.minX !== Number.MAX_VALUE && gl.maxX !== -Number.MAX_VALUE) {
        if (cnf.xaxis.convertedCatToNumeric && !gl.dataFormatXNumeric) {
          let catScale = []
          for (let i = gl.minX - 1; i < gl.maxX; i++) {
            catScale.push(i + 1)
          }
          gl.xAxisScale = {
            result: catScale,
            niceMin: catScale[0],
            niceMax: catScale[catScale.length - 1]
          }
        } else {
          gl.xAxisScale = this.scales.setXScale(gl.minX, gl.maxX)
        }
      } else {
        gl.xAxisScale = this.scales.linearScale(1, ticks, ticks)
        if (gl.noLabelsProvided && gl.labels.length > 0) {
          gl.xAxisScale = this.scales.linearScale(
            1,
            gl.labels.length,
            ticks - 1
          )

          // this is the only place seriesX is again mutated
          gl.seriesX = gl.labels.slice()
        }
      }
      // we will still store these labels as the count for this will be different (to draw grid and labels placement)
      if (isXNumeric) {
        gl.labels = gl.xAxisScale.result.slice()
      }
    }

    if (gl.isBarHorizontal && gl.labels.length) {
      gl.xTickAmount = gl.labels.length
    }

    // single dataPoint
    this._handleSingleDataPoint()

    // minimum x difference to calculate bar width in numeric bars
    this._getMinXDiff()

    return {
      minX: gl.minX,
      maxX: gl.maxX
    }
  }

  setZRange() {
    // minZ, maxZ starts here
    let gl = this.w.globals

    if (!gl.isDataXYZ) return
    for (let i = 0; i < gl.series.length; i++) {
      if (typeof gl.seriesZ[i] !== 'undefined') {
        for (let j = 0; j < gl.seriesZ[i].length; j++) {
          if (gl.seriesZ[i][j] !== null && Utils.isNumber(gl.seriesZ[i][j])) {
            gl.maxZ = Math.max(gl.maxZ, gl.seriesZ[i][j])
            gl.minZ = Math.min(gl.minZ, gl.seriesZ[i][j])
          }
        }
      }
    }
  }

  _handleSingleDataPoint() {
    const gl = this.w.globals
    const cnf = this.w.config

    if (gl.minX === gl.maxX) {
      let datetimeObj = new DateTime(this.ctx)

      if (cnf.xaxis.type === 'datetime') {
        const newMinX = datetimeObj.getDate(gl.minX)
        newMinX.setUTCDate(newMinX.getDate() - 2)
        gl.minX = new Date(newMinX).getTime()

        const newMaxX = datetimeObj.getDate(gl.maxX)
        newMaxX.setUTCDate(newMaxX.getDate() + 2)
        gl.maxX = new Date(newMaxX).getTime()
      } else if (
        cnf.xaxis.type === 'numeric' ||
        (cnf.xaxis.type === 'category' && !gl.noLabelsProvided)
      ) {
        gl.minX = gl.minX - 2
        gl.initialMinX = gl.minX
        gl.maxX = gl.maxX + 2
        gl.initialMaxX = gl.maxX
      }
    }
  }

  _getMinXDiff() {
    const gl = this.w.globals

    if (gl.isXNumeric) {
      // get the least x diff if numeric x axis is present
      gl.seriesX.forEach((sX, i) => {
        if (sX.length === 1) {
          // a small hack to prevent overlapping multiple bars when there is just 1 datapoint in bar series.
          // fix #811
          sX.push(
            gl.seriesX[gl.maxValsInArrayIndex][
              gl.seriesX[gl.maxValsInArrayIndex].length - 1
            ]
          )
        }

        // fix #983 (clone the array to avoid side effects)
        const seriesX = sX.slice()
        seriesX.sort((a, b) => a - b)

        seriesX.forEach((s, j) => {
          if (j > 0) {
            let xDiff = s - seriesX[j - 1]
            if (xDiff > 0) {
              gl.minXDiff = Math.min(xDiff, gl.minXDiff)
            }
          }
        })
        if (gl.dataPoints === 1 && gl.minXDiff === Number.MAX_VALUE) {
          // fixes apexcharts.js #1221
          gl.minXDiff = 0.5
        }
      })
    }
  }

  _setStackedMinMax() {
    const gl = this.w.globals
    // for stacked charts, we calculate each series's parallel values. i.e, series[0][j] + series[1][j] .... [series[i.length][j]] and get the max out of it
    let stackedPoss = []
    let stackedNegs = []

    if (gl.series.length) {
      for (let j = 0; j < gl.series[gl.maxValsInArrayIndex].length; j++) {
        let poss = 0
        let negs = 0
        for (let i = 0; i < gl.series.length; i++) {
          if (gl.series[i][j] !== null && Utils.isNumber(gl.series[i][j])) {
            // 0.0001 fixes #185 when values are very small
            gl.series[i][j] > 0
              ? (poss = poss + parseFloat(gl.series[i][j]) + 0.0001)
              : (negs = negs + parseFloat(gl.series[i][j]))
          }

          if (i === gl.series.length - 1) {
            // push all the totals to the array for future use
            stackedPoss.push(poss)
            stackedNegs.push(negs)
          }
        }
      }
    }

    // get the max/min out of the added parallel values
    for (let z = 0; z < stackedPoss.length; z++) {
      gl.maxY = Math.max(gl.maxY, stackedPoss[z])
      gl.minY = Math.min(gl.minY, stackedNegs[z])
    }
  }
}

export default Range
