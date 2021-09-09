import Animations from '../modules/Animations'
import Fill from '../modules/Fill'
import Filters from '../modules/Filters'
import Graphics from '../modules/Graphics'
import Markers from '../modules/Markers'

/**
 * ApexCharts Scatter Class.
 * This Class also handles bubbles chart as currently there is no major difference in drawing them,
 * @module Scatter
 **/
export default class Scatter {
  constructor(ctx) {
    this.ctx = ctx
    this.w = ctx.w

    this.initialAnim = this.w.config.chart.animations.enabled
    this.dynamicAnim =
      this.initialAnim &&
      this.w.config.chart.animations.dynamicAnimation.enabled
  }

  draw(elSeries, j, opts) {
    let w = this.w

    let graphics = new Graphics(this.ctx)

    let realIndex = opts.realIndex
    let pointsPos = opts.pointsPos
    let zRatio = opts.zRatio
    let elPointsMain = opts.elParent

    let elPointsWrap = graphics.group({
      class: `apexcharts-series-markers apexcharts-series-${w.config.chart.type}`
    })

    elPointsWrap.attr('clip-path', `url(#gridRectMarkerMask${w.globals.cuid})`)

    if (Array.isArray(pointsPos.x)) {
      for (let q = 0; q < pointsPos.x.length; q++) {
        let dataPointIndex = j + 1
        let shouldDraw = true

        // a small hack as we have 2 points for the first val to connect it
        if (j === 0 && q === 0) dataPointIndex = 0
        if (j === 0 && q === 1) dataPointIndex = 1

        let radius = 0
        let finishRadius = w.globals.markers.size[realIndex]

        if (zRatio !== Infinity) {
          // means we have a bubble
          finishRadius = w.globals.seriesZ[realIndex][dataPointIndex] / zRatio

          const bubble = w.config.plotOptions.bubble
          if (bubble.minBubbleRadius && finishRadius < bubble.minBubbleRadius) {
            finishRadius = bubble.minBubbleRadius
          }

          if (bubble.maxBubbleRadius && finishRadius > bubble.maxBubbleRadius) {
            finishRadius = bubble.maxBubbleRadius
          }
        }

        if (!w.config.chart.animations.enabled) {
          radius = finishRadius
        }

        let x = pointsPos.x[q]
        let y = pointsPos.y[q]

        radius = radius || 0

        if (
          y === null ||
          typeof w.globals.series[realIndex][dataPointIndex] === 'undefined'
        ) {
          shouldDraw = false
        }

        if (shouldDraw) {
          const point = this.drawPoint(
            x,
            y,
            radius,
            finishRadius,
            realIndex,
            dataPointIndex,
            j
          )
          elPointsWrap.add(point)
        }

        elPointsMain.add(elPointsWrap)
      }
    }
  }

  drawPoint(x, y, radius, finishRadius, realIndex, dataPointIndex, j) {
    const w = this.w

    let i = realIndex
    let anim = new Animations(this.ctx)
    let filters = new Filters(this.ctx)
    let fill = new Fill(this.ctx)
    let markers = new Markers(this.ctx)
    const graphics = new Graphics(this.ctx)

    const markerConfig = markers.getMarkerConfig('apexcharts-marker', i)

    let pathFillCircle = fill.fillPath({
      seriesNumber: realIndex,
      dataPointIndex,
      patternUnits: 'objectBoundingBox',
      value: w.globals.series[realIndex][j]
    })

    let el
    if (markerConfig.shape === 'circle') {
      el = graphics.drawCircle(radius)
    } else if (
      markerConfig.shape === 'square' ||
      markerConfig.shape === 'rect'
    ) {
      el = graphics.drawRect(
        0,
        0,
        markerConfig.width - markerConfig.pointStrokeWidth / 2,
        markerConfig.height - markerConfig.pointStrokeWidth / 2,
        markerConfig.pRadius
      )
    }

    if (w.config.series[i].data[dataPointIndex]) {
      if (w.config.series[i].data[dataPointIndex].fillColor) {
        pathFillCircle = w.config.series[i].data[dataPointIndex].fillColor
      }
    }

    el.attr({
      x: x - markerConfig.width / 2 - markerConfig.pointStrokeWidth / 2,
      y: y - markerConfig.height / 2 - markerConfig.pointStrokeWidth / 2,
      cx: x,
      cy: y,
      fill: pathFillCircle,
      'fill-opacity': markerConfig.pointFillOpacity,
      stroke: markerConfig.pointStrokeColor,
      r: finishRadius,
      'stroke-width': markerConfig.pointStrokeWidth,
      'stroke-dasharray': markerConfig.pointStrokeDashArray,
      'stroke-opacity': markerConfig.pointStrokeOpacity
    })

    if (w.config.chart.dropShadow.enabled) {
      const dropShadow = w.config.chart.dropShadow
      filters.dropShadow(el, dropShadow, realIndex)
    }

    if (this.initialAnim && !w.globals.dataChanged && !w.globals.resized) {
      let speed = w.config.chart.animations.speed

      anim.animateMarker(
        el,
        0,
        markerConfig.shape === 'circle'
          ? finishRadius
          : { width: markerConfig.width, height: markerConfig.height },
        speed,
        w.globals.easing,
        () => {
          window.setTimeout(() => {
            anim.animationCompleted(el)
          }, 100)
        }
      )
    } else {
      w.globals.animationEnded = true
    }

    if (w.globals.dataChanged && markerConfig.shape === 'circle') {
      if (this.dynamicAnim) {
        let speed = w.config.chart.animations.dynamicAnimation.speed
        let prevX, prevY, prevR

        let prevPathJ = null

        prevPathJ =
          w.globals.previousPaths[realIndex] &&
          w.globals.previousPaths[realIndex][j]

        if (typeof prevPathJ !== 'undefined' && prevPathJ !== null) {
          // series containing less elements will ignore these values and revert to 0
          prevX = prevPathJ.x
          prevY = prevPathJ.y
          prevR =
            typeof prevPathJ.r !== 'undefined' ? prevPathJ.r : finishRadius
        }

        for (let cs = 0; cs < w.globals.collapsedSeries.length; cs++) {
          if (w.globals.collapsedSeries[cs].index === realIndex) {
            speed = 1
            finishRadius = 0
          }
        }

        if (x === 0 && y === 0) finishRadius = 0

        anim.animateCircle(
          el,
          {
            cx: prevX,
            cy: prevY,
            r: prevR
          },
          {
            cx: x,
            cy: y,
            r: finishRadius
          },
          speed,
          w.globals.easing
        )
      } else {
        el.attr({
          r: finishRadius
        })
      }
    }

    el.attr({
      rel: dataPointIndex,
      j: dataPointIndex,
      index: realIndex,
      'default-marker-size': finishRadius
    })

    filters.setSelectionFilter(el, realIndex, dataPointIndex)
    markers.addEvents(el)

    el.node.classList.add('apexcharts-marker')

    return el
  }

  centerTextInBubble(y) {
    let w = this.w
    y = y + parseInt(w.config.dataLabels.style.fontSize, 10) / 4

    return {
      y
    }
  }
}
