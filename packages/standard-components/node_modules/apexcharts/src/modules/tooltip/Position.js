import Graphics from '../Graphics'
import Series from '../Series'

/**
 * ApexCharts Tooltip.Position Class to move the tooltip based on x and y position.
 *
 * @module Tooltip.Position
 **/

export default class Position {
  constructor(tooltipContext) {
    this.ttCtx = tooltipContext
    this.ctx = tooltipContext.ctx
    this.w = tooltipContext.w
  }

  /**
   * This will move the crosshair (the vertical/horz line that moves along with mouse)
   * Along with this, this function also calls the xaxisMove function
   * @memberof Position
   * @param {int} - cx = point's x position, wherever point's x is, you need to move crosshair
   */
  moveXCrosshairs(cx, j = null) {
    const ttCtx = this.ttCtx
    let w = this.w

    const xcrosshairs = ttCtx.getElXCrosshairs()

    let x = cx - ttCtx.xcrosshairsWidth / 2

    let tickAmount = w.globals.labels.slice().length
    if (j !== null) {
      x = (w.globals.gridWidth / tickAmount) * j
    }

    if (xcrosshairs !== null) {
      xcrosshairs.setAttribute('x', x)
      xcrosshairs.setAttribute('x1', x)
      xcrosshairs.setAttribute('x2', x)
      xcrosshairs.setAttribute('y2', w.globals.gridHeight)
      xcrosshairs.classList.add('apexcharts-active')
    }

    if (x < 0) {
      x = 0
    }

    if (x > w.globals.gridWidth) {
      x = w.globals.gridWidth
    }

    if (ttCtx.blxaxisTooltip) {
      let tx = x
      if (
        w.config.xaxis.crosshairs.width === 'tickWidth' ||
        w.config.xaxis.crosshairs.width === 'barWidth'
      ) {
        tx = x + ttCtx.xcrosshairsWidth / 2
      }
      this.moveXAxisTooltip(tx)
    }
  }

  /**
   * This will move the crosshair (the vertical/horz line that moves along with mouse)
   * Along with this, this function also calls the xaxisMove function
   * @memberof Position
   * @param {int} - cx = point's x position, wherever point's x is, you need to move crosshair
   */
  moveYCrosshairs(cy) {
    const ttCtx = this.ttCtx

    if (ttCtx.ycrosshairs !== null) {
      Graphics.setAttrs(ttCtx.ycrosshairs, {
        y1: cy,
        y2: cy
      })
    }
    if (ttCtx.ycrosshairsHidden !== null) {
      Graphics.setAttrs(ttCtx.ycrosshairsHidden, {
        y1: cy,
        y2: cy
      })
    }
  }

  /**
   ** AxisTooltip is the small rectangle which appears on x axis with x value, when user moves
   * @memberof Position
   * @param {int} - cx = point's x position, wherever point's x is, you need to move
   */
  moveXAxisTooltip(cx) {
    let w = this.w
    const ttCtx = this.ttCtx

    if (ttCtx.xaxisTooltip !== null) {
      ttCtx.xaxisTooltip.classList.add('apexcharts-active')

      let cy =
        ttCtx.xaxisOffY +
        w.config.xaxis.tooltip.offsetY +
        w.globals.translateY +
        1 +
        w.config.xaxis.offsetY

      let xaxisTTText = ttCtx.xaxisTooltip.getBoundingClientRect()
      let xaxisTTTextWidth = xaxisTTText.width

      cx = cx - xaxisTTTextWidth / 2

      if (!isNaN(cx)) {
        cx = cx + w.globals.translateX

        let textRect = 0
        const graphics = new Graphics(this.ctx)
        textRect = graphics.getTextRects(ttCtx.xaxisTooltipText.innerHTML)

        ttCtx.xaxisTooltipText.style.minWidth = textRect.width + 'px'
        ttCtx.xaxisTooltip.style.left = cx + 'px'
        ttCtx.xaxisTooltip.style.top = cy + 'px'
      }
    }
  }

  moveYAxisTooltip(index) {
    const w = this.w
    const ttCtx = this.ttCtx

    if (ttCtx.yaxisTTEls === null) {
      ttCtx.yaxisTTEls = w.globals.dom.baseEl.querySelectorAll(
        '.apexcharts-yaxistooltip'
      )
    }

    const ycrosshairsHiddenRectY1 = parseInt(
      ttCtx.ycrosshairsHidden.getAttribute('y1'),
      10
    )
    let cy = w.globals.translateY + ycrosshairsHiddenRectY1

    const yAxisTTRect = ttCtx.yaxisTTEls[index].getBoundingClientRect()
    const yAxisTTHeight = yAxisTTRect.height
    let cx = w.globals.translateYAxisX[index] - 2

    if (w.config.yaxis[index].opposite) {
      cx = cx - 26
    }

    cy = cy - yAxisTTHeight / 2

    if (w.globals.ignoreYAxisIndexes.indexOf(index) === -1) {
      ttCtx.yaxisTTEls[index].classList.add('apexcharts-active')
      ttCtx.yaxisTTEls[index].style.top = cy + 'px'
      ttCtx.yaxisTTEls[index].style.left =
        cx + w.config.yaxis[index].tooltip.offsetX + 'px'
    } else {
      ttCtx.yaxisTTEls[index].classList.remove('apexcharts-active')
    }
  }

  /**
   ** moves the whole tooltip by changing x, y attrs
   * @memberof Position
   * @param {int} - cx = point's x position, wherever point's x is, you need to move tooltip
   * @param {int} - cy = point's y position, wherever point's y is, you need to move tooltip
   * @param {int} - r = point's radius
   */
  moveTooltip(cx, cy, r = null) {
    let w = this.w

    let ttCtx = this.ttCtx
    const tooltipEl = ttCtx.getElTooltip()
    let tooltipRect = ttCtx.tooltipRect

    let pointR = r !== null ? parseFloat(r) : 1

    let x = parseFloat(cx) + pointR + 5
    let y = parseFloat(cy) + pointR / 2 // - tooltipRect.ttHeight / 2

    if (x > w.globals.gridWidth / 2) {
      x = x - tooltipRect.ttWidth - pointR - 15
    }

    if (x > w.globals.gridWidth - tooltipRect.ttWidth - 10) {
      x = w.globals.gridWidth - tooltipRect.ttWidth
    }

    if (x < -20) {
      x = -20
    }

    if (w.config.tooltip.followCursor) {
      const elGrid = ttCtx.getElGrid()
      const seriesBound = elGrid.getBoundingClientRect()
      y =
        ttCtx.e.clientY +
        w.globals.translateY -
        seriesBound.top -
        tooltipRect.ttHeight / 2
    } else {
      if (w.globals.isBarHorizontal) {
        // non follow shared tooltip in a horizontal bar chart
        y = y - tooltipRect.ttHeight
      } else {
        if (tooltipRect.ttHeight / 2 + y > w.globals.gridHeight) {
          y = w.globals.gridHeight - tooltipRect.ttHeight + w.globals.translateY
        }

        if (y < 0) {
          y = 0
        }
      }
    }

    if (!isNaN(x)) {
      x = x + w.globals.translateX

      tooltipEl.style.left = x + 'px'
      tooltipEl.style.top = y + 'px'
    }
  }

  moveMarkers(i, j) {
    let w = this.w
    let ttCtx = this.ttCtx

    if (w.globals.markers.size[i] > 0) {
      let allPoints = w.globals.dom.baseEl.querySelectorAll(
        ` .apexcharts-series[data\\:realIndex='${i}'] .apexcharts-marker`
      )
      for (let p = 0; p < allPoints.length; p++) {
        if (parseInt(allPoints[p].getAttribute('rel'), 10) === j) {
          ttCtx.marker.resetPointsSize()
          ttCtx.marker.enlargeCurrentPoint(j, allPoints[p])
        }
      }
    } else {
      ttCtx.marker.resetPointsSize()
      this.moveDynamicPointOnHover(j, i)
    }
  }

  // This function is used when you need to show markers/points only on hover -
  // DIFFERENT X VALUES in multiple series
  moveDynamicPointOnHover(j, capturedSeries) {
    let w = this.w
    let ttCtx = this.ttCtx
    let cx = 0
    let cy = 0

    let pointsArr = w.globals.pointsArray

    let hoverSize = ttCtx.tooltipUtil.getHoverMarkerSize(capturedSeries)

    const serType = w.config.series[capturedSeries].type
    if (
      serType &&
      (serType === 'column' ||
        serType === 'candlestick' ||
        serType === 'boxPlot')
    ) {
      // fix error mentioned in #811
      return
    }

    cx = pointsArr[capturedSeries][j][0]
    cy = pointsArr[capturedSeries][j][1] ? pointsArr[capturedSeries][j][1] : 0

    let point = w.globals.dom.baseEl.querySelector(
      `.apexcharts-series[data\\:realIndex='${capturedSeries}'] .apexcharts-series-markers circle`
    )

    if (point && cy < w.globals.gridHeight && cy > 0) {
      point.setAttribute('r', hoverSize)

      point.setAttribute('cx', cx)
      point.setAttribute('cy', cy)
    }

    // point.style.opacity = w.config.markers.hover.opacity

    this.moveXCrosshairs(cx)

    if (!ttCtx.fixedTooltip) {
      this.moveTooltip(cx, cy, hoverSize)
    }
  }

  // This function is used when you need to show markers/points only on hover -
  // SAME X VALUES in multiple series
  moveDynamicPointsOnHover(j) {
    const ttCtx = this.ttCtx
    let w = ttCtx.w
    let cx = 0
    let cy = 0
    let activeSeries = 0

    let pointsArr = w.globals.pointsArray

    let series = new Series(this.ctx)
    activeSeries = series.getActiveConfigSeriesIndex(true)

    let hoverSize = ttCtx.tooltipUtil.getHoverMarkerSize(activeSeries)

    if (pointsArr[activeSeries]) {
      cx = pointsArr[activeSeries][j][0]
      cy = pointsArr[activeSeries][j][1]
    }

    let points = ttCtx.tooltipUtil.getAllMarkers()

    if (points !== null) {
      for (let p = 0; p < w.globals.series.length; p++) {
        let pointArr = pointsArr[p]

        if (w.globals.comboCharts) {
          // in a combo chart, if column charts are present, markers will not match with the number of series, hence this patch to push a null value in points array
          if (typeof pointArr === 'undefined') {
            // nodelist to array
            points.splice(p, 0, null)
          }
        }
        if (pointArr && pointArr.length) {
          let pcy = pointsArr[p][j][1]
          points[p].setAttribute('cx', cx)

          if (
            pcy !== null &&
            !isNaN(pcy) &&
            pcy < w.globals.gridHeight &&
            pcy > 0
          ) {
            points[p] && points[p].setAttribute('r', hoverSize)
            points[p] && points[p].setAttribute('cy', pcy)
          } else {
            points[p] && points[p].setAttribute('r', 0)
          }
        }
      }
    }

    this.moveXCrosshairs(cx)

    if (!ttCtx.fixedTooltip) {
      let tcy = cy || w.globals.gridHeight
      this.moveTooltip(cx, tcy, hoverSize)
    }
  }

  moveStickyTooltipOverBars(j) {
    const w = this.w
    const ttCtx = this.ttCtx

    let barLen = w.globals.columnSeries
      ? w.globals.columnSeries.length
      : w.globals.series.length

    let i =
      barLen >= 2 && barLen % 2 === 0
        ? Math.floor(barLen / 2)
        : Math.floor(barLen / 2) + 1

    if (w.globals.isBarHorizontal) {
      let series = new Series(this.ctx)
      i = series.getActiveConfigSeriesIndex(false, 'desc') + 1
    }
    let jBar = w.globals.dom.baseEl.querySelector(
      `.apexcharts-bar-series .apexcharts-series[rel='${i}'] path[j='${j}'], .apexcharts-candlestick-series .apexcharts-series[rel='${i}'] path[j='${j}'], .apexcharts-boxPlot-series .apexcharts-series[rel='${i}'] path[j='${j}'], .apexcharts-rangebar-series .apexcharts-series[rel='${i}'] path[j='${j}']`
    )

    let bcx = jBar ? parseFloat(jBar.getAttribute('cx')) : 0
    let bcy = jBar ? parseFloat(jBar.getAttribute('cy')) : 0
    let bw = jBar ? parseFloat(jBar.getAttribute('barWidth')) : 0
    let bh = jBar ? parseFloat(jBar.getAttribute('barHeight')) : 0

    const elGrid = ttCtx.getElGrid()
    let seriesBound = elGrid.getBoundingClientRect()

    if (w.globals.isXNumeric) {
      bcx = bcx - (barLen % 2 !== 0 ? bw / 2 : 0)

      if (
        jBar && // fixes apexcharts.js#2354
        (jBar.classList.contains('apexcharts-candlestick-area') ||
          jBar.classList.contains('apexcharts-boxPlot-area')) &&
        w.globals.comboCharts
      ) {
        bcx = bcx - bw / 2
      }
    } else {
      if (!w.globals.isBarHorizontal) {
        bcx =
          ttCtx.xAxisTicksPositions[j - 1] + ttCtx.dataPointsDividedWidth / 2
        if (isNaN(bcx)) {
          bcx = ttCtx.xAxisTicksPositions[j] - ttCtx.dataPointsDividedWidth / 2
        }
      }
    }

    if (!w.globals.isBarHorizontal) {
      bcy = ttCtx.e.clientY - seriesBound.top - ttCtx.tooltipRect.ttHeight / 2
    } else {
      bcy = bcy + bh / 3
    }

    if (!w.globals.isBarHorizontal) {
      this.moveXCrosshairs(bcx)
    }

    if (!ttCtx.fixedTooltip) {
      let tcy = bcy || w.globals.gridHeight
      this.moveTooltip(bcx, tcy)
    }
  }
}
