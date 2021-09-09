import Bar from '../charts/Bar'
import BarStacked from '../charts/BarStacked'
import BoxCandleStick from '../charts/BoxCandleStick'
import CoreUtils from './CoreUtils'
import Crosshairs from './Crosshairs'
import HeatMap from '../charts/HeatMap'
import Globals from '../modules/settings/Globals'
import Pie from '../charts/Pie'
import Radar from '../charts/Radar'
import Radial from '../charts/Radial'
import RangeBar from '../charts/RangeBar'
import Legend from './legend/Legend'
import Line from '../charts/Line'
import Treemap from '../charts/Treemap'
import Graphics from './Graphics'
import Range from './Range'
import Utils from '../utils/Utils'
import Scales from './Scales'
import TimeScale from './TimeScale'

/**
 * ApexCharts Core Class responsible for major calculations and creating elements.
 *
 * @module Core
 **/

export default class Core {
  constructor(el, ctx) {
    this.ctx = ctx
    this.w = ctx.w
    this.el = el
  }

  // get data and store into appropriate vars

  setupElements() {
    let gl = this.w.globals
    let cnf = this.w.config

    // const graphics = new Graphics(this.ctx)

    let ct = cnf.chart.type
    let axisChartsArrTypes = [
      'line',
      'area',
      'bar',
      'rangeBar',
      'candlestick',
      'boxPlot',
      'scatter',
      'bubble',
      'radar',
      'heatmap',
      'treemap'
    ]

    let xyChartsArrTypes = [
      'line',
      'area',
      'bar',
      'rangeBar',
      'candlestick',
      'boxPlot',
      'scatter',
      'bubble'
    ]

    gl.axisCharts = axisChartsArrTypes.indexOf(ct) > -1

    gl.xyCharts = xyChartsArrTypes.indexOf(ct) > -1

    gl.isBarHorizontal =
      (cnf.chart.type === 'bar' || cnf.chart.type === 'rangeBar') &&
      cnf.plotOptions.bar.horizontal

    gl.chartClass = '.apexcharts' + gl.chartID

    gl.dom.baseEl = this.el

    gl.dom.elWrap = document.createElement('div')
    Graphics.setAttrs(gl.dom.elWrap, {
      id: gl.chartClass.substring(1),
      class: 'apexcharts-canvas ' + gl.chartClass.substring(1)
    })
    this.el.appendChild(gl.dom.elWrap)

    gl.dom.Paper = new window.SVG.Doc(gl.dom.elWrap)
    gl.dom.Paper.attr({
      class: 'apexcharts-svg',
      'xmlns:data': 'ApexChartsNS',
      transform: `translate(${cnf.chart.offsetX}, ${cnf.chart.offsetY})`
    })

    gl.dom.Paper.node.style.background = cnf.chart.background

    this.setSVGDimensions()

    gl.dom.elGraphical = gl.dom.Paper.group().attr({
      class: 'apexcharts-inner apexcharts-graphical'
    })

    gl.dom.elAnnotations = gl.dom.Paper.group().attr({
      class: 'apexcharts-annotations'
    })

    gl.dom.elDefs = gl.dom.Paper.defs()

    gl.dom.elLegendWrap = document.createElement('div')
    gl.dom.elLegendWrap.classList.add('apexcharts-legend')
    gl.dom.elWrap.appendChild(gl.dom.elLegendWrap)
    gl.dom.Paper.add(gl.dom.elGraphical)
    gl.dom.elGraphical.add(gl.dom.elDefs)
  }

  plotChartType(ser, xyRatios) {
    const w = this.w
    const cnf = w.config
    const gl = w.globals

    let lineSeries = {
      series: [],
      i: []
    }
    let areaSeries = {
      series: [],
      i: []
    }
    let scatterSeries = {
      series: [],
      i: []
    }

    let bubbleSeries = {
      series: [],
      i: []
    }

    let columnSeries = {
      series: [],
      i: []
    }

    let candlestickSeries = {
      series: [],
      i: []
    }

    let boxplotSeries = {
      series: [],
      i: []
    }

    gl.series.map((series, st) => {
      let comboCount = 0
      // if user has specified a particular type for particular series
      if (typeof ser[st].type !== 'undefined') {
        if (ser[st].type === 'column' || ser[st].type === 'bar') {
          if (gl.series.length > 1 && cnf.plotOptions.bar.horizontal) {
            // horizontal bars not supported in mixed charts, hence show a warning
            console.warn(
              'Horizontal bars are not supported in a mixed/combo chart. Please turn off `plotOptions.bar.horizontal`'
            )
          }
          columnSeries.series.push(series)
          columnSeries.i.push(st)
          comboCount++
          w.globals.columnSeries = columnSeries.series
        } else if (ser[st].type === 'area') {
          areaSeries.series.push(series)
          areaSeries.i.push(st)
          comboCount++
        } else if (ser[st].type === 'line') {
          lineSeries.series.push(series)
          lineSeries.i.push(st)
          comboCount++
        } else if (ser[st].type === 'scatter') {
          scatterSeries.series.push(series)
          scatterSeries.i.push(st)
        } else if (ser[st].type === 'bubble') {
          bubbleSeries.series.push(series)
          bubbleSeries.i.push(st)
          comboCount++
        } else if (ser[st].type === 'candlestick') {
          candlestickSeries.series.push(series)
          candlestickSeries.i.push(st)
          comboCount++
        } else if (ser[st].type === 'boxPlot') {
          boxplotSeries.series.push(series)
          boxplotSeries.i.push(st)
          comboCount++
        } else {
          // user has specified type, but it is not valid (other than line/area/column)
          console.warn(
            'You have specified an unrecognized chart type. Available types for this property are line/area/column/bar/scatter/bubble'
          )
        }
        if (comboCount > 1) {
          gl.comboCharts = true
        }
      } else {
        lineSeries.series.push(series)
        lineSeries.i.push(st)
      }
    })

    let line = new Line(this.ctx, xyRatios)
    let boxCandlestick = new BoxCandleStick(this.ctx, xyRatios)
    this.ctx.pie = new Pie(this.ctx)
    let radialBar = new Radial(this.ctx)
    this.ctx.rangeBar = new RangeBar(this.ctx, xyRatios)
    let radar = new Radar(this.ctx)
    let elGraph = []

    if (gl.comboCharts) {
      if (areaSeries.series.length > 0) {
        elGraph.push(line.draw(areaSeries.series, 'area', areaSeries.i))
      }
      if (columnSeries.series.length > 0) {
        if (w.config.chart.stacked) {
          let barStacked = new BarStacked(this.ctx, xyRatios)
          elGraph.push(barStacked.draw(columnSeries.series, columnSeries.i))
        } else {
          this.ctx.bar = new Bar(this.ctx, xyRatios)
          elGraph.push(this.ctx.bar.draw(columnSeries.series, columnSeries.i))
        }
      }
      if (lineSeries.series.length > 0) {
        elGraph.push(line.draw(lineSeries.series, 'line', lineSeries.i))
      }
      if (candlestickSeries.series.length > 0) {
        elGraph.push(
          boxCandlestick.draw(candlestickSeries.series, candlestickSeries.i)
        )
      }
      if (boxplotSeries.series.length > 0) {
        elGraph.push(boxCandlestick.draw(boxplotSeries.series, boxplotSeries.i))
      }
      if (scatterSeries.series.length > 0) {
        const scatterLine = new Line(this.ctx, xyRatios, true)
        elGraph.push(
          scatterLine.draw(scatterSeries.series, 'scatter', scatterSeries.i)
        )
      }
      if (bubbleSeries.series.length > 0) {
        const bubbleLine = new Line(this.ctx, xyRatios, true)
        elGraph.push(
          bubbleLine.draw(bubbleSeries.series, 'bubble', bubbleSeries.i)
        )
      }
    } else {
      switch (cnf.chart.type) {
        case 'line':
          elGraph = line.draw(gl.series, 'line')
          break
        case 'area':
          elGraph = line.draw(gl.series, 'area')
          break
        case 'bar':
          if (cnf.chart.stacked) {
            let barStacked = new BarStacked(this.ctx, xyRatios)
            elGraph = barStacked.draw(gl.series)
          } else {
            this.ctx.bar = new Bar(this.ctx, xyRatios)
            elGraph = this.ctx.bar.draw(gl.series)
          }
          break
        case 'candlestick':
          let candleStick = new BoxCandleStick(this.ctx, xyRatios)
          elGraph = candleStick.draw(gl.series)
          break
        case 'boxPlot':
          let boxPlot = new BoxCandleStick(this.ctx, xyRatios)
          elGraph = boxPlot.draw(gl.series)
          break
        case 'rangeBar':
          elGraph = this.ctx.rangeBar.draw(gl.series)
          break
        case 'heatmap':
          let heatmap = new HeatMap(this.ctx, xyRatios)
          elGraph = heatmap.draw(gl.series)
          break
        case 'treemap':
          let treemap = new Treemap(this.ctx, xyRatios)
          elGraph = treemap.draw(gl.series)
          break
        case 'pie':
        case 'donut':
        case 'polarArea':
          elGraph = this.ctx.pie.draw(gl.series)
          break
        case 'radialBar':
          elGraph = radialBar.draw(gl.series)
          break
        case 'radar':
          elGraph = radar.draw(gl.series)
          break
        default:
          elGraph = line.draw(gl.series)
      }
    }

    return elGraph
  }

  setSVGDimensions() {
    let gl = this.w.globals
    let cnf = this.w.config

    gl.svgWidth = cnf.chart.width
    gl.svgHeight = cnf.chart.height

    let elDim = Utils.getDimensions(this.el)

    let widthUnit = cnf.chart.width
      .toString()
      .split(/[0-9]+/g)
      .pop()

    if (widthUnit === '%') {
      if (Utils.isNumber(elDim[0])) {
        if (elDim[0].width === 0) {
          elDim = Utils.getDimensions(this.el.parentNode)
        }

        gl.svgWidth = (elDim[0] * parseInt(cnf.chart.width, 10)) / 100
      }
    } else if (widthUnit === 'px' || widthUnit === '') {
      gl.svgWidth = parseInt(cnf.chart.width, 10)
    }

    let heightUnit = cnf.chart.height
      .toString()
      .split(/[0-9]+/g)
      .pop()
    if (gl.svgHeight !== 'auto' && gl.svgHeight !== '') {
      if (heightUnit === '%') {
        let elParentDim = Utils.getDimensions(this.el.parentNode)
        gl.svgHeight = (elParentDim[1] * parseInt(cnf.chart.height, 10)) / 100
      } else {
        gl.svgHeight = parseInt(cnf.chart.height, 10)
      }
    } else {
      if (gl.axisCharts) {
        gl.svgHeight = gl.svgWidth / 1.61
      } else {
        gl.svgHeight = gl.svgWidth / 1.2
      }
    }

    if (gl.svgWidth < 0) gl.svgWidth = 0
    if (gl.svgHeight < 0) gl.svgHeight = 0

    Graphics.setAttrs(gl.dom.Paper.node, {
      width: gl.svgWidth,
      height: gl.svgHeight
    })

    if (heightUnit !== '%') {
      // fixes https://github.com/apexcharts/apexcharts.js/issues/2059
      let offsetY = cnf.chart.sparkline.enabled
        ? 0
        : gl.axisCharts
        ? cnf.chart.parentHeightOffset
        : 0

      gl.dom.Paper.node.parentNode.parentNode.style.minHeight =
        gl.svgHeight + offsetY + 'px'
    }

    gl.dom.elWrap.style.width = gl.svgWidth + 'px'
    gl.dom.elWrap.style.height = gl.svgHeight + 'px'
  }

  shiftGraphPosition() {
    let gl = this.w.globals

    let tY = gl.translateY
    let tX = gl.translateX

    let scalingAttrs = {
      transform: 'translate(' + tX + ', ' + tY + ')'
    }
    Graphics.setAttrs(gl.dom.elGraphical.node, scalingAttrs)
  }

  // To prevent extra spacings in the bottom of the chart, we need to recalculate the height for pie/donut/radialbar charts
  resizeNonAxisCharts() {
    const w = this.w

    const gl = w.globals

    let legendHeight = 0
    let offY = w.config.chart.sparkline.enabled ? 1 : 15
    offY = offY + w.config.grid.padding.bottom

    if (
      (w.config.legend.position === 'top' ||
        w.config.legend.position === 'bottom') &&
      w.config.legend.show &&
      !w.config.legend.floating
    ) {
      legendHeight =
        new Legend(this.ctx).legendHelpers.getLegendBBox().clwh + 10
    }

    let el = w.globals.dom.baseEl.querySelector(
      '.apexcharts-radialbar, .apexcharts-pie'
    )

    let chartInnerDimensions = w.globals.radialSize * 2.05

    if (el && !w.config.chart.sparkline.enabled) {
      let elRadialRect = Utils.getBoundingClientRect(el)
      chartInnerDimensions = elRadialRect.bottom

      let maxHeight = elRadialRect.bottom - elRadialRect.top

      chartInnerDimensions = Math.max(w.globals.radialSize * 2.05, maxHeight)
    }

    let newHeight = chartInnerDimensions + gl.translateY + legendHeight + offY

    if (gl.dom.elLegendForeign) {
      gl.dom.elLegendForeign.setAttribute('height', newHeight)
    }

    gl.dom.elWrap.style.height = newHeight + 'px'

    Graphics.setAttrs(gl.dom.Paper.node, {
      height: newHeight
    })

    gl.dom.Paper.node.parentNode.parentNode.style.minHeight = newHeight + 'px'
  }

  /*
   ** All the calculations for setting range in charts will be done here
   */
  coreCalculations() {
    const range = new Range(this.ctx)
    range.init()
  }

  resetGlobals() {
    const resetxyValues = () => {
      return this.w.config.series.map((s) => [])
    }
    const globalObj = new Globals()

    let gl = this.w.globals
    globalObj.initGlobalVars(gl)
    gl.seriesXvalues = resetxyValues()
    gl.seriesYvalues = resetxyValues()
  }

  isMultipleY() {
    // user has supplied an array in yaxis property. So, turn on multipleYAxis flag
    if (
      this.w.config.yaxis.constructor === Array &&
      this.w.config.yaxis.length > 1
    ) {
      this.w.globals.isMultipleYAxis = true
      return true
    }
  }

  xySettings() {
    let xyRatios = null
    const w = this.w

    if (w.globals.axisCharts) {
      if (w.config.xaxis.crosshairs.position === 'back') {
        const crosshairs = new Crosshairs(this.ctx)
        crosshairs.drawXCrosshairs()
      }
      if (w.config.yaxis[0].crosshairs.position === 'back') {
        const crosshairs = new Crosshairs(this.ctx)
        crosshairs.drawYCrosshairs()
      }

      if (
        w.config.xaxis.type === 'datetime' &&
        w.config.xaxis.labels.formatter === undefined
      ) {
        this.ctx.timeScale = new TimeScale(this.ctx)
        let formattedTimeScale = []
        if (
          isFinite(w.globals.minX) &&
          isFinite(w.globals.maxX) &&
          !w.globals.isBarHorizontal
        ) {
          formattedTimeScale = this.ctx.timeScale.calculateTimeScaleTicks(
            w.globals.minX,
            w.globals.maxX
          )
        } else if (w.globals.isBarHorizontal) {
          formattedTimeScale = this.ctx.timeScale.calculateTimeScaleTicks(
            w.globals.minY,
            w.globals.maxY
          )
        }
        this.ctx.timeScale.recalcDimensionsBasedOnFormat(formattedTimeScale)
      }

      const coreUtils = new CoreUtils(this.ctx)
      xyRatios = coreUtils.getCalculatedRatios()
    }
    return xyRatios
  }

  updateSourceChart(targetChart) {
    this.ctx.w.globals.selection = undefined
    this.ctx.updateHelpers._updateOptions(
      {
        chart: {
          selection: {
            xaxis: {
              min: targetChart.w.globals.minX,
              max: targetChart.w.globals.maxX
            }
          }
        }
      },
      false,
      false
    )
  }

  setupBrushHandler() {
    const w = this.w

    // only for brush charts
    if (!w.config.chart.brush.enabled) {
      return
    }

    // if user has not defined a custom function for selection - we handle the brush chart
    // otherwise we leave it to the user to define the functionality for selection
    if (typeof w.config.chart.events.selection !== 'function') {
      let targets = w.config.chart.brush.targets || [
        w.config.chart.brush.target
      ]
      // retro compatibility with single target option
      targets.forEach((target) => {
        let targetChart = ApexCharts.getChartByID(target)
        targetChart.w.globals.brushSource = this.ctx

        if (typeof targetChart.w.config.chart.events.zoomed !== 'function') {
          targetChart.w.config.chart.events.zoomed = () => {
            this.updateSourceChart(targetChart)
          }
        }
        if (typeof targetChart.w.config.chart.events.scrolled !== 'function') {
          targetChart.w.config.chart.events.scrolled = () => {
            this.updateSourceChart(targetChart)
          }
        }
      })

      w.config.chart.events.selection = (chart, e) => {
        targets.forEach((target) => {
          let targetChart = ApexCharts.getChartByID(target)
          let yaxis = Utils.clone(w.config.yaxis)

          if (
            w.config.chart.brush.autoScaleYaxis &&
            targetChart.w.globals.series.length === 1
          ) {
            const scale = new Scales(targetChart)
            yaxis = scale.autoScaleY(targetChart, yaxis, e)
          }

          const multipleYaxis = targetChart.w.config.yaxis.reduce(
            (acc, curr, index) => {
              return [
                ...acc,
                {
                  ...targetChart.w.config.yaxis[index],
                  min: yaxis[0].min,
                  max: yaxis[0].max
                }
              ]
            },
            []
          )

          targetChart.ctx.updateHelpers._updateOptions(
            {
              xaxis: {
                min: e.xaxis.min,
                max: e.xaxis.max
              },
              yaxis: multipleYaxis
            },
            false,
            false,
            false,
            false
          )
        })
      }
    }
  }
}
