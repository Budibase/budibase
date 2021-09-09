import CoreUtils from '../CoreUtils'
import Graphics from '../Graphics'
import XAxis from './XAxis'
import AxesUtils from './AxesUtils'

/**
 * ApexCharts Grid Class for drawing Cartesian Grid.
 *
 * @module Grid
 **/

class Grid {
  constructor(ctx) {
    this.ctx = ctx
    this.w = ctx.w

    const w = this.w
    this.xaxisLabels = w.globals.labels.slice()
    this.axesUtils = new AxesUtils(ctx)

    this.isTimelineBar =
      w.config.xaxis.type === 'datetime' &&
      w.globals.seriesRangeBarTimeline.length

    if (w.globals.timescaleLabels.length > 0) {
      //  timescaleLabels labels are there
      this.xaxisLabels = w.globals.timescaleLabels.slice()
    }
  }

  // when using sparklines or when showing no grid, we need to have a grid area which is reused at many places for other calculations as well
  drawGridArea(elGrid = null) {
    let w = this.w

    let graphics = new Graphics(this.ctx)

    if (elGrid === null) {
      elGrid = graphics.group({
        class: 'apexcharts-grid'
      })
    }

    let elVerticalLine = graphics.drawLine(
      w.globals.padHorizontal,
      1,
      w.globals.padHorizontal,
      w.globals.gridHeight,
      'transparent'
    )

    let elHorzLine = graphics.drawLine(
      w.globals.padHorizontal,
      w.globals.gridHeight,
      w.globals.gridWidth,
      w.globals.gridHeight,
      'transparent'
    )

    elGrid.add(elHorzLine)
    elGrid.add(elVerticalLine)

    return elGrid
  }

  drawGrid() {
    let gl = this.w.globals

    let elgrid = null

    if (gl.axisCharts) {
      // grid is drawn after xaxis and yaxis are drawn
      elgrid = this.renderGrid()

      this.drawGridArea(elgrid.el)
    }
    return elgrid
  }

  // This mask will clip off overflowing graphics from the drawable area
  createGridMask() {
    let w = this.w
    let gl = w.globals
    const graphics = new Graphics(this.ctx)

    let strokeSize = Array.isArray(w.config.stroke.width)
      ? 0
      : w.config.stroke.width

    if (Array.isArray(w.config.stroke.width)) {
      let strokeMaxSize = 0
      w.config.stroke.width.forEach((m) => {
        strokeMaxSize = Math.max(strokeMaxSize, m)
      })
      strokeSize = strokeMaxSize
    }

    gl.dom.elGridRectMask = document.createElementNS(gl.SVGNS, 'clipPath')
    gl.dom.elGridRectMask.setAttribute('id', `gridRectMask${gl.cuid}`)

    gl.dom.elGridRectMarkerMask = document.createElementNS(gl.SVGNS, 'clipPath')
    gl.dom.elGridRectMarkerMask.setAttribute(
      'id',
      `gridRectMarkerMask${gl.cuid}`
    )

    gl.dom.elForecastMask = document.createElementNS(gl.SVGNS, 'clipPath')
    gl.dom.elForecastMask.setAttribute('id', `forecastMask${gl.cuid}`)

    gl.dom.elNonForecastMask = document.createElementNS(gl.SVGNS, 'clipPath')
    gl.dom.elNonForecastMask.setAttribute('id', `nonForecastMask${gl.cuid}`)

    // let barHalfWidth = 0

    const type = w.config.chart.type
    const hasBar =
      type === 'bar' ||
      type === 'rangeBar' ||
      type === 'candlestick' ||
      type === 'boxPlot' ||
      w.globals.comboBarCount > 0

    let barWidthLeft = 0
    let barWidthRight = 0
    if (hasBar && w.globals.isXNumeric && !w.globals.isBarHorizontal) {
      barWidthLeft = w.config.grid.padding.left
      barWidthRight = w.config.grid.padding.right

      if (gl.barPadForNumericAxis > barWidthLeft) {
        barWidthLeft = gl.barPadForNumericAxis
        barWidthRight = gl.barPadForNumericAxis
      }
    }
    gl.dom.elGridRect = graphics.drawRect(
      -strokeSize / 2 - barWidthLeft - 2,
      -strokeSize / 2,
      gl.gridWidth + strokeSize + barWidthRight + barWidthLeft + 4,
      gl.gridHeight + strokeSize,
      0,
      '#fff'
    )

    const coreUtils = new CoreUtils(this)
    coreUtils.getLargestMarkerSize()

    let markerSize = w.globals.markers.largestSize + 1

    gl.dom.elGridRectMarker = graphics.drawRect(
      -markerSize * 2,
      -markerSize * 2,
      gl.gridWidth + markerSize * 4,
      gl.gridHeight + markerSize * 4,
      0,
      '#fff'
    )
    gl.dom.elGridRectMask.appendChild(gl.dom.elGridRect.node)
    gl.dom.elGridRectMarkerMask.appendChild(gl.dom.elGridRectMarker.node)

    let defs = gl.dom.baseEl.querySelector('defs')
    defs.appendChild(gl.dom.elGridRectMask)
    defs.appendChild(gl.dom.elForecastMask)
    defs.appendChild(gl.dom.elNonForecastMask)
    defs.appendChild(gl.dom.elGridRectMarkerMask)
  }

  _drawGridLines({ i, x1, y1, x2, y2, xCount, parent }) {
    const w = this.w

    const shouldDraw = () => {
      if (i === 0 && w.globals.skipFirstTimelinelabel) {
        return false
      }

      if (
        i === xCount - 1 &&
        w.globals.skipLastTimelinelabel &&
        !w.config.xaxis.labels.formatter
      ) {
        return false
      }
      if (w.config.chart.type === 'radar') {
        return false
      }
      return true
    }

    if (shouldDraw()) {
      if (w.config.grid.xaxis.lines.show) {
        this._drawGridLine({ x1, y1, x2, y2, parent })
      }
      let xAxis = new XAxis(this.ctx)
      xAxis.drawXaxisTicks(x1, this.elg)
    }
  }

  _drawGridLine({ x1, y1, x2, y2, parent }) {
    const w = this.w

    const isHorzLine = parent.node.classList.contains(
      'apexcharts-gridlines-horizontal'
    )

    let strokeDashArray = w.config.grid.strokeDashArray
    const offX = w.globals.barPadForNumericAxis

    const graphics = new Graphics(this)
    let line = graphics.drawLine(
      x1 - (isHorzLine ? offX : 0),
      y1,
      x2 + (isHorzLine ? offX : 0),
      y2,
      w.config.grid.borderColor,
      strokeDashArray
    )
    line.node.classList.add('apexcharts-gridline')
    parent.add(line)
  }

  _drawGridBandRect({ c, x1, y1, x2, y2, type }) {
    const w = this.w
    const graphics = new Graphics(this.ctx)
    const offX = w.globals.barPadForNumericAxis

    if (type === 'column' && w.config.xaxis.type === 'datetime') return

    const color = w.config.grid[type].colors[c]

    let rect = graphics.drawRect(
      x1 - (type === 'row' ? offX : 0),
      y1,
      x2 + (type === 'row' ? offX * 2 : 0),
      y2,
      0,
      color,
      w.config.grid[type].opacity
    )
    this.elg.add(rect)
    rect.attr('clip-path', `url(#gridRectMask${w.globals.cuid})`)
    rect.node.classList.add(`apexcharts-grid-${type}`)
  }

  _drawXYLines({ xCount, tickAmount }) {
    const w = this.w

    const datetimeLines = ({ xC, x1, y1, x2, y2 }) => {
      for (let i = 0; i < xC; i++) {
        x1 = this.xaxisLabels[i].position
        x2 = this.xaxisLabels[i].position

        this._drawGridLines({
          i,
          x1,
          y1,
          x2,
          y2,
          xCount,
          parent: this.elgridLinesV
        })
      }
    }

    const categoryLines = ({ xC, x1, y1, x2, y2 }) => {
      if (
        typeof w.config.xaxis.tickAmount !== 'undefined' &&
        w.config.xaxis.tickAmount !== 'dataPoints'
      ) {
        // user has specified tickamount in a category x-axis chart
        const visibleLabels = w.globals.dom.baseEl.querySelectorAll(
          '.apexcharts-text.apexcharts-xaxis-label tspan:not(:empty)'
        )

        visibleLabels.forEach((d, i) => {
          const textRect = d.getBBox()

          this._drawGridLines({
            i,
            x1: textRect.x + textRect.width / 2,
            y1,
            x2: textRect.x + textRect.width / 2,
            y2,
            xCount,
            parent: this.elgridLinesV
          })
        })
      } else {
        for (let i = 0; i < xC + (w.globals.isXNumeric ? 0 : 1); i++) {
          if (i === 0 && xC === 1 && w.globals.dataPoints === 1) {
            // single datapoint
            x1 = w.globals.gridWidth / 2
            x2 = x1
          }
          this._drawGridLines({
            i,
            x1,
            y1,
            x2,
            y2,
            xCount,
            parent: this.elgridLinesV
          })

          x1 = x1 + w.globals.gridWidth / (w.globals.isXNumeric ? xC - 1 : xC)
          x2 = x1
        }
      }
    }

    // draw vertical lines
    if (w.config.grid.xaxis.lines.show || w.config.xaxis.axisTicks.show) {
      let x1 = w.globals.padHorizontal
      let y1 = 0
      let x2
      let y2 = w.globals.gridHeight

      if (w.globals.timescaleLabels.length) {
        datetimeLines({ xC: xCount, x1, y1, x2, y2 })
      } else {
        if (w.globals.isXNumeric) {
          xCount = w.globals.xAxisScale.result.length
        }
        if (w.config.xaxis.convertedCatToNumeric) {
          // in case of a convertedCatToNumeric, some labels might be skipped due to hideOverLapping labels, hence use this var to get the visible ticks
          xCount = w.globals.xaxisLabelsCount
        }
        categoryLines({ xC: xCount, x1, y1, x2, y2 })
      }
    }

    // draw horizontal lines
    if (w.config.grid.yaxis.lines.show) {
      let x1 = 0
      let y1 = 0
      let y2 = 0
      let x2 = w.globals.gridWidth
      let tA = tickAmount + 1

      if (this.isTimelineBar) {
        tA = w.globals.labels.length
      }

      for (let i = 0; i < tA + (this.isTimelineBar ? 1 : 0); i++) {
        this._drawGridLine({ x1, y1, x2, y2, parent: this.elgridLinesH })

        y1 = y1 + w.globals.gridHeight / (this.isTimelineBar ? tA : tickAmount)

        y2 = y1
      }
    }
  }

  _drawInvertedXYLines({ xCount }) {
    const w = this.w

    // draw vertical lines
    if (w.config.grid.xaxis.lines.show || w.config.xaxis.axisTicks.show) {
      let x1 = w.globals.padHorizontal
      let y1 = 0
      let x2
      let y2 = w.globals.gridHeight
      for (let i = 0; i < xCount + 1; i++) {
        if (w.config.grid.xaxis.lines.show) {
          this._drawGridLine({ x1, y1, x2, y2, parent: this.elgridLinesV })
        }

        let xAxis = new XAxis(this.ctx)
        xAxis.drawXaxisTicks(x1, this.elg)
        x1 = x1 + w.globals.gridWidth / xCount + 0.3
        x2 = x1
      }
    }

    // draw horizontal lines
    if (w.config.grid.yaxis.lines.show) {
      let x1 = 0
      let y1 = 0
      let y2 = 0
      let x2 = w.globals.gridWidth

      for (let i = 0; i < w.globals.dataPoints + 1; i++) {
        this._drawGridLine({ x1, y1, x2, y2, parent: this.elgridLinesH })

        y1 = y1 + w.globals.gridHeight / w.globals.dataPoints
        y2 = y1
      }
    }
  }

  // actual grid rendering
  renderGrid() {
    let w = this.w
    let graphics = new Graphics(this.ctx)

    this.elg = graphics.group({
      class: 'apexcharts-grid'
    })
    this.elgridLinesH = graphics.group({
      class: 'apexcharts-gridlines-horizontal'
    })
    this.elgridLinesV = graphics.group({
      class: 'apexcharts-gridlines-vertical'
    })

    this.elg.add(this.elgridLinesH)
    this.elg.add(this.elgridLinesV)

    if (!w.config.grid.show) {
      this.elgridLinesV.hide()
      this.elgridLinesH.hide()
    }

    let yTickAmount = w.globals.yAxisScale.length
      ? w.globals.yAxisScale[0].result.length - 1
      : 5
    for (let i = 0; i < w.globals.series.length; i++) {
      if (typeof w.globals.yAxisScale[i] !== 'undefined') {
        yTickAmount = w.globals.yAxisScale[i].result.length - 1
      }
      if (yTickAmount > 2) break
    }

    let xCount

    if (!w.globals.isBarHorizontal || this.isTimelineBar) {
      xCount = this.xaxisLabels.length

      if (this.isTimelineBar) {
        yTickAmount = w.globals.labels.length
        if (w.config.xaxis.tickAmount && w.config.xaxis.labels.formatter) {
          xCount = w.config.xaxis.tickAmount
        }
      }
      this._drawXYLines({ xCount, tickAmount: yTickAmount })
    } else {
      xCount = yTickAmount

      // for horizontal bar chart, get the xaxis tickamount
      yTickAmount = w.globals.xTickAmount
      this._drawInvertedXYLines({ xCount, tickAmount: yTickAmount })
    }

    this.drawGridBands(xCount, yTickAmount)
    return {
      el: this.elg,
      xAxisTickWidth: w.globals.gridWidth / xCount
    }
  }

  drawGridBands(xCount, tickAmount) {
    const w = this.w

    // rows background bands
    if (
      w.config.grid.row.colors !== undefined &&
      w.config.grid.row.colors.length > 0
    ) {
      let x1 = 0
      let y1 = 0
      let y2 = w.globals.gridHeight / tickAmount
      let x2 = w.globals.gridWidth

      for (let i = 0, c = 0; i < tickAmount; i++, c++) {
        if (c >= w.config.grid.row.colors.length) {
          c = 0
        }
        this._drawGridBandRect({
          c,
          x1,
          y1,
          x2,
          y2,
          type: 'row'
        })

        y1 = y1 + w.globals.gridHeight / tickAmount
      }
    }

    // columns background bands
    if (
      w.config.grid.column.colors !== undefined &&
      w.config.grid.column.colors.length > 0
    ) {
      const xc =
        !w.globals.isBarHorizontal &&
        (w.config.xaxis.type === 'category' ||
          w.config.xaxis.convertedCatToNumeric)
          ? xCount - 1
          : xCount
      let x1 = w.globals.padHorizontal
      let y1 = 0
      let x2 = w.globals.padHorizontal + w.globals.gridWidth / xc
      let y2 = w.globals.gridHeight
      for (let i = 0, c = 0; i < xCount; i++, c++) {
        if (c >= w.config.grid.column.colors.length) {
          c = 0
        }
        this._drawGridBandRect({
          c,
          x1,
          y1,
          x2,
          y2,
          type: 'column'
        })

        x1 = x1 + w.globals.gridWidth / xc
      }
    }
  }
}

export default Grid
