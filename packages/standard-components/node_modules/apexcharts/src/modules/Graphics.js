import Animations from './Animations'
import Filters from './Filters'
import Utils from '../utils/Utils'

/**
 * ApexCharts Graphics Class for all drawing operations.
 *
 * @module Graphics
 **/

class Graphics {
  constructor(ctx) {
    this.ctx = ctx
    this.w = ctx.w
  }

  drawLine(
    x1,
    y1,
    x2,
    y2,
    lineColor = '#a8a8a8',
    dashArray = 0,
    strokeWidth = null
  ) {
    let w = this.w
    let line = w.globals.dom.Paper.line().attr({
      x1,
      y1,
      x2,
      y2,
      stroke: lineColor,
      'stroke-dasharray': dashArray,
      'stroke-width': strokeWidth
    })

    return line
  }

  drawRect(
    x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0,
    radius = 0,
    color = '#fefefe',
    opacity = 1,
    strokeWidth = null,
    strokeColor = null,
    strokeDashArray = 0
  ) {
    let w = this.w
    let rect = w.globals.dom.Paper.rect()

    rect.attr({
      x: x1,
      y: y1,
      width: x2 > 0 ? x2 : 0,
      height: y2 > 0 ? y2 : 0,
      rx: radius,
      ry: radius,
      opacity,
      'stroke-width': strokeWidth !== null ? strokeWidth : 0,
      stroke: strokeColor !== null ? strokeColor : 'none',
      'stroke-dasharray': strokeDashArray
    })

    // fix apexcharts.js#1410
    rect.node.setAttribute('fill', color)

    return rect
  }

  drawPolygon(
    polygonString,
    stroke = '#e1e1e1',
    strokeWidth = 1,
    fill = 'none'
  ) {
    const w = this.w
    const polygon = w.globals.dom.Paper.polygon(polygonString).attr({
      fill,
      stroke,
      'stroke-width': strokeWidth
    })

    return polygon
  }

  drawCircle(radius, attrs = null) {
    const w = this.w

    if (radius < 0) radius = 0
    const c = w.globals.dom.Paper.circle(radius * 2)
    if (attrs !== null) {
      c.attr(attrs)
    }
    return c
  }

  drawPath({
    d = '',
    stroke = '#a8a8a8',
    strokeWidth = 1,
    fill,
    fillOpacity = 1,
    strokeOpacity = 1,
    classes,
    strokeLinecap = null,
    strokeDashArray = 0
  }) {
    let w = this.w

    if (strokeLinecap === null) {
      strokeLinecap = w.config.stroke.lineCap
    }

    if (d.indexOf('undefined') > -1 || d.indexOf('NaN') > -1) {
      d = `M 0 ${w.globals.gridHeight}`
    }
    let p = w.globals.dom.Paper.path(d).attr({
      fill,
      'fill-opacity': fillOpacity,
      stroke,
      'stroke-opacity': strokeOpacity,
      'stroke-linecap': strokeLinecap,
      'stroke-width': strokeWidth,
      'stroke-dasharray': strokeDashArray,
      class: classes
    })

    return p
  }

  group(attrs = null) {
    const w = this.w
    const g = w.globals.dom.Paper.group()

    if (attrs !== null) {
      g.attr(attrs)
    }
    return g
  }

  move(x, y) {
    let move = ['M', x, y].join(' ')
    return move
  }

  line(x, y, hORv = null) {
    let line = null
    if (hORv === null) {
      line = ['L', x, y].join(' ')
    } else if (hORv === 'H') {
      line = ['H', x].join(' ')
    } else if (hORv === 'V') {
      line = ['V', y].join(' ')
    }
    return line
  }

  curve(x1, y1, x2, y2, x, y) {
    let curve = ['C', x1, y1, x2, y2, x, y].join(' ')
    return curve
  }

  quadraticCurve(x1, y1, x, y) {
    let curve = ['Q', x1, y1, x, y].join(' ')
    return curve
  }

  arc(rx, ry, axisRotation, largeArcFlag, sweepFlag, x, y, relative = false) {
    let coord = 'A'
    if (relative) coord = 'a'

    let arc = [coord, rx, ry, axisRotation, largeArcFlag, sweepFlag, x, y].join(
      ' '
    )
    return arc
  }

  /**
   * @memberof Graphics
   * @param {object}
   *  i = series's index
   *  realIndex = realIndex is series's actual index when it was drawn time. After several redraws, the iterating "i" may change in loops, but realIndex doesn't
   *  pathFrom = existing pathFrom to animateTo
   *  pathTo = new Path to which d attr will be animated from pathFrom to pathTo
   *  stroke = line Color
   *  strokeWidth = width of path Line
   *  fill = it can be gradient, single color, pattern or image
   *  animationDelay = how much to delay when starting animation (in milliseconds)
   *  dataChangeSpeed = for dynamic animations, when data changes
   *  className = class attribute to add
   * @return {object} svg.js path object
   **/
  renderPaths({
    j,
    realIndex,
    pathFrom,
    pathTo,
    stroke,
    strokeWidth,
    strokeLinecap,
    fill,
    animationDelay,
    initialSpeed,
    dataChangeSpeed,
    className,
    shouldClipToGrid = true,
    bindEventsOnPaths = true,
    drawShadow = true
  }) {
    let w = this.w
    const filters = new Filters(this.ctx)
    const anim = new Animations(this.ctx)

    let initialAnim = this.w.config.chart.animations.enabled
    let dynamicAnim =
      initialAnim && this.w.config.chart.animations.dynamicAnimation.enabled

    let d
    let shouldAnimate = !!(
      (initialAnim && !w.globals.resized) ||
      (dynamicAnim && w.globals.dataChanged && w.globals.shouldAnimate)
    )

    if (shouldAnimate) {
      d = pathFrom
    } else {
      d = pathTo
      w.globals.animationEnded = true
    }

    let strokeDashArrayOpt = w.config.stroke.dashArray
    let strokeDashArray = 0
    if (Array.isArray(strokeDashArrayOpt)) {
      strokeDashArray = strokeDashArrayOpt[realIndex]
    } else {
      strokeDashArray = w.config.stroke.dashArray
    }

    let el = this.drawPath({
      d,
      stroke,
      strokeWidth,
      fill,
      fillOpacity: 1,
      classes: className,
      strokeLinecap,
      strokeDashArray
    })

    el.attr('index', realIndex)

    if (shouldClipToGrid) {
      el.attr({
        'clip-path': `url(#gridRectMask${w.globals.cuid})`
      })
    }

    // const defaultFilter = el.filterer

    if (w.config.states.normal.filter.type !== 'none') {
      filters.getDefaultFilter(el, realIndex)
    } else {
      if (w.config.chart.dropShadow.enabled && drawShadow) {
        if (
          !w.config.chart.dropShadow.enabledOnSeries ||
          (w.config.chart.dropShadow.enabledOnSeries &&
            w.config.chart.dropShadow.enabledOnSeries.indexOf(realIndex) !== -1)
        ) {
          const shadow = w.config.chart.dropShadow
          filters.dropShadow(el, shadow, realIndex)
        }
      }
    }

    if (bindEventsOnPaths) {
      el.node.addEventListener('mouseenter', this.pathMouseEnter.bind(this, el))
      el.node.addEventListener('mouseleave', this.pathMouseLeave.bind(this, el))
      el.node.addEventListener('mousedown', this.pathMouseDown.bind(this, el))
    }

    el.attr({
      pathTo,
      pathFrom
    })

    const defaultAnimateOpts = {
      el,
      j,
      realIndex,
      pathFrom,
      pathTo,
      fill,
      strokeWidth,
      delay: animationDelay
    }

    if (initialAnim && !w.globals.resized && !w.globals.dataChanged) {
      anim.animatePathsGradually({
        ...defaultAnimateOpts,
        speed: initialSpeed
      })
    } else {
      if (w.globals.resized || !w.globals.dataChanged) {
        anim.showDelayedElements()
      }
    }

    if (w.globals.dataChanged && dynamicAnim && shouldAnimate) {
      anim.animatePathsGradually({
        ...defaultAnimateOpts,
        speed: dataChangeSpeed
      })
    }

    return el
  }

  drawPattern(
    style,
    width,
    height,
    stroke = '#a8a8a8',
    strokeWidth = 0,
    opacity = 1
  ) {
    let w = this.w

    let p = w.globals.dom.Paper.pattern(width, height, (add) => {
      if (style === 'horizontalLines') {
        add
          .line(0, 0, height, 0)
          .stroke({ color: stroke, width: strokeWidth + 1 })
      } else if (style === 'verticalLines') {
        add
          .line(0, 0, 0, width)
          .stroke({ color: stroke, width: strokeWidth + 1 })
      } else if (style === 'slantedLines') {
        add
          .line(0, 0, width, height)
          .stroke({ color: stroke, width: strokeWidth })
      } else if (style === 'squares') {
        add
          .rect(width, height)
          .fill('none')
          .stroke({ color: stroke, width: strokeWidth })
      } else if (style === 'circles') {
        add
          .circle(width)
          .fill('none')
          .stroke({ color: stroke, width: strokeWidth })
      }
    })

    return p
  }

  drawGradient(
    style,
    gfrom,
    gto,
    opacityFrom,
    opacityTo,
    size = null,
    stops = null,
    colorStops = null,
    i = 0
  ) {
    let w = this.w
    let g

    if (gfrom.length < 9 && gfrom.indexOf('#') === 0) {
      // if the hex contains alpha and is of 9 digit, skip the opacity
      gfrom = Utils.hexToRgba(gfrom, opacityFrom)
    }
    if (gto.length < 9 && gto.indexOf('#') === 0) {
      gto = Utils.hexToRgba(gto, opacityTo)
    }

    let stop1 = 0
    let stop2 = 1
    let stop3 = 1
    let stop4 = null

    if (stops !== null) {
      stop1 = typeof stops[0] !== 'undefined' ? stops[0] / 100 : 0
      stop2 = typeof stops[1] !== 'undefined' ? stops[1] / 100 : 1
      stop3 = typeof stops[2] !== 'undefined' ? stops[2] / 100 : 1
      stop4 = typeof stops[3] !== 'undefined' ? stops[3] / 100 : null
    }

    let radial = !!(
      w.config.chart.type === 'donut' ||
      w.config.chart.type === 'pie' ||
      w.config.chart.type === 'polarArea' ||
      w.config.chart.type === 'bubble'
    )

    if (colorStops === null || colorStops.length === 0) {
      g = w.globals.dom.Paper.gradient(radial ? 'radial' : 'linear', (stop) => {
        stop.at(stop1, gfrom, opacityFrom)
        stop.at(stop2, gto, opacityTo)
        stop.at(stop3, gto, opacityTo)
        if (stop4 !== null) {
          stop.at(stop4, gfrom, opacityFrom)
        }
      })
    } else {
      g = w.globals.dom.Paper.gradient(radial ? 'radial' : 'linear', (stop) => {
        let gradientStops = Array.isArray(colorStops[i])
          ? colorStops[i]
          : colorStops
        gradientStops.forEach((s) => {
          stop.at(s.offset / 100, s.color, s.opacity)
        })
      })
    }

    if (!radial) {
      if (style === 'vertical') {
        g.from(0, 0).to(0, 1)
      } else if (style === 'diagonal') {
        g.from(0, 0).to(1, 1)
      } else if (style === 'horizontal') {
        g.from(0, 1).to(1, 1)
      } else if (style === 'diagonal2') {
        g.from(1, 0).to(0, 1)
      }
    } else {
      let offx = w.globals.gridWidth / 2
      let offy = w.globals.gridHeight / 2

      if (w.config.chart.type !== 'bubble') {
        g.attr({
          gradientUnits: 'userSpaceOnUse',
          cx: offx,
          cy: offy,
          r: size
        })
      } else {
        g.attr({
          cx: 0.5,
          cy: 0.5,
          r: 0.8,
          fx: 0.2,
          fy: 0.2
        })
      }
    }

    return g
  }

  drawText({
    x,
    y,
    text,
    textAnchor,
    fontSize,
    fontFamily,
    fontWeight,
    foreColor,
    opacity,
    cssClass = '',
    isPlainText = true
  }) {
    let w = this.w

    if (typeof text === 'undefined') text = ''

    if (!textAnchor) {
      textAnchor = 'start'
    }

    if (!foreColor || !foreColor.length) {
      foreColor = w.config.chart.foreColor
    }
    fontFamily = fontFamily || w.config.chart.fontFamily
    fontWeight = fontWeight || 'regular'

    let elText
    if (Array.isArray(text)) {
      elText = w.globals.dom.Paper.text((add) => {
        for (let i = 0; i < text.length; i++) {
          i === 0 ? add.tspan(text[i]) : add.tspan(text[i]).newLine()
        }
      })
    } else {
      elText = isPlainText
        ? w.globals.dom.Paper.plain(text)
        : w.globals.dom.Paper.text((add) => add.tspan(text))
    }

    elText.attr({
      x,
      y,
      'text-anchor': textAnchor,
      'dominant-baseline': 'auto',
      'font-size': fontSize,
      'font-family': fontFamily,
      'font-weight': fontWeight,
      fill: foreColor,
      class: 'apexcharts-text ' + cssClass
    })

    elText.node.style.fontFamily = fontFamily
    elText.node.style.opacity = opacity

    return elText
  }

  drawMarker(x, y, opts) {
    x = x || 0
    let size = opts.pSize || 0

    let elPoint = null

    if (opts.shape === 'square' || opts.shape === 'rect') {
      let radius = opts.pRadius === undefined ? size / 2 : opts.pRadius

      if (y === null || !size) {
        size = 0
        radius = 0
      }

      let nSize = size * 1.2 + radius

      let p = this.drawRect(nSize, nSize, nSize, nSize, radius)

      p.attr({
        x: x - nSize / 2,
        y: y - nSize / 2,
        cx: x,
        cy: y,
        class: opts.class ? opts.class : '',
        fill: opts.pointFillColor,
        'fill-opacity': opts.pointFillOpacity ? opts.pointFillOpacity : 1,
        stroke: opts.pointStrokeColor,
        'stroke-width': opts.pointStrokeWidth ? opts.pointStrokeWidth : 0,
        'stroke-opacity': opts.pointStrokeOpacity ? opts.pointStrokeOpacity : 1
      })

      elPoint = p
    } else if (opts.shape === 'circle' || !opts.shape) {
      if (!Utils.isNumber(y)) {
        size = 0
        y = 0
      }

      // let nSize = size - opts.pRadius / 2 < 0 ? 0 : size - opts.pRadius / 2

      elPoint = this.drawCircle(size, {
        cx: x,
        cy: y,
        class: opts.class ? opts.class : '',
        stroke: opts.pointStrokeColor,
        fill: opts.pointFillColor,
        'fill-opacity': opts.pointFillOpacity ? opts.pointFillOpacity : 1,
        'stroke-width': opts.pointStrokeWidth ? opts.pointStrokeWidth : 0,
        'stroke-opacity': opts.pointStrokeOpacity ? opts.pointStrokeOpacity : 1
      })
    }

    return elPoint
  }

  pathMouseEnter(path, e) {
    let w = this.w
    const filters = new Filters(this.ctx)

    const i = parseInt(path.node.getAttribute('index'), 10)
    const j = parseInt(path.node.getAttribute('j'), 10)

    if (typeof w.config.chart.events.dataPointMouseEnter === 'function') {
      w.config.chart.events.dataPointMouseEnter(e, this.ctx, {
        seriesIndex: i,
        dataPointIndex: j,
        w
      })
    }
    this.ctx.events.fireEvent('dataPointMouseEnter', [
      e,
      this.ctx,
      { seriesIndex: i, dataPointIndex: j, w }
    ])

    if (w.config.states.active.filter.type !== 'none') {
      if (path.node.getAttribute('selected') === 'true') {
        return
      }
    }

    if (w.config.states.hover.filter.type !== 'none') {
      if (
        w.config.states.active.filter.type !== 'none' &&
        !w.globals.isTouchDevice
      ) {
        let hoverFilter = w.config.states.hover.filter
        filters.applyFilter(path, i, hoverFilter.type, hoverFilter.value)
      }
    }
  }

  pathMouseLeave(path, e) {
    let w = this.w
    const filters = new Filters(this.ctx)

    const i = parseInt(path.node.getAttribute('index'), 10)
    const j = parseInt(path.node.getAttribute('j'), 10)

    if (typeof w.config.chart.events.dataPointMouseLeave === 'function') {
      w.config.chart.events.dataPointMouseLeave(e, this.ctx, {
        seriesIndex: i,
        dataPointIndex: j,
        w
      })
    }
    this.ctx.events.fireEvent('dataPointMouseLeave', [
      e,
      this.ctx,
      { seriesIndex: i, dataPointIndex: j, w }
    ])

    if (w.config.states.active.filter.type !== 'none') {
      if (path.node.getAttribute('selected') === 'true') {
        return
      }
    }

    if (w.config.states.hover.filter.type !== 'none') {
      filters.getDefaultFilter(path, i)
    }
  }

  pathMouseDown(path, e) {
    let w = this.w
    const filters = new Filters(this.ctx)

    const i = parseInt(path.node.getAttribute('index'), 10)
    const j = parseInt(path.node.getAttribute('j'), 10)

    let selected = 'false'
    if (path.node.getAttribute('selected') === 'true') {
      path.node.setAttribute('selected', 'false')

      if (w.globals.selectedDataPoints[i].indexOf(j) > -1) {
        let index = w.globals.selectedDataPoints[i].indexOf(j)
        w.globals.selectedDataPoints[i].splice(index, 1)
      }
    } else {
      if (
        !w.config.states.active.allowMultipleDataPointsSelection &&
        w.globals.selectedDataPoints.length > 0
      ) {
        w.globals.selectedDataPoints = []
        const elPaths = w.globals.dom.Paper.select('.apexcharts-series path')
          .members
        const elCircles = w.globals.dom.Paper.select(
          '.apexcharts-series circle, .apexcharts-series rect'
        ).members

        const deSelect = (els) => {
          Array.prototype.forEach.call(els, (el) => {
            el.node.setAttribute('selected', 'false')
            filters.getDefaultFilter(el, i)
          })
        }
        deSelect(elPaths)
        deSelect(elCircles)
      }

      path.node.setAttribute('selected', 'true')
      selected = 'true'

      if (typeof w.globals.selectedDataPoints[i] === 'undefined') {
        w.globals.selectedDataPoints[i] = []
      }
      w.globals.selectedDataPoints[i].push(j)
    }

    if (selected === 'true') {
      let activeFilter = w.config.states.active.filter
      if (activeFilter !== 'none') {
        filters.applyFilter(path, i, activeFilter.type, activeFilter.value)
      }
    } else {
      if (w.config.states.active.filter.type !== 'none') {
        filters.getDefaultFilter(path, i)
      }
    }

    if (typeof w.config.chart.events.dataPointSelection === 'function') {
      w.config.chart.events.dataPointSelection(e, this.ctx, {
        selectedDataPoints: w.globals.selectedDataPoints,
        seriesIndex: i,
        dataPointIndex: j,
        w
      })
    }

    if (e) {
      this.ctx.events.fireEvent('dataPointSelection', [
        e,
        this.ctx,
        {
          selectedDataPoints: w.globals.selectedDataPoints,
          seriesIndex: i,
          dataPointIndex: j,
          w
        }
      ])
    }
  }

  rotateAroundCenter(el) {
    let coord = el.getBBox()
    let x = coord.x + coord.width / 2
    let y = coord.y + coord.height / 2

    return {
      x,
      y
    }
  }

  static setAttrs(el, attrs) {
    for (let key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        el.setAttribute(key, attrs[key])
      }
    }
  }

  getTextRects(text, fontSize, fontFamily, transform, useBBox = true) {
    let w = this.w
    let virtualText = this.drawText({
      x: -200,
      y: -200,
      text,
      textAnchor: 'start',
      fontSize,
      fontFamily,
      foreColor: '#fff',
      opacity: 0
    })

    if (transform) {
      virtualText.attr('transform', transform)
    }
    w.globals.dom.Paper.add(virtualText)

    let rect = virtualText.bbox()
    if (!useBBox) {
      rect = virtualText.node.getBoundingClientRect()
    }

    virtualText.remove()

    return {
      width: rect.width,
      height: rect.height
    }
  }

  /**
   * append ... to long text
   * http://stackoverflow.com/questions/9241315/trimming-text-to-a-given-pixel-width-in-svg
   * @memberof Graphics
   **/
  placeTextWithEllipsis(textObj, textString, width) {
    if (typeof textObj.getComputedTextLength !== 'function') return
    textObj.textContent = textString
    if (textString.length > 0) {
      // ellipsis is needed
      if (textObj.getComputedTextLength() >= width / 1.1) {
        for (let x = textString.length - 3; x > 0; x -= 3) {
          if (textObj.getSubStringLength(0, x) <= width / 1.1) {
            textObj.textContent = textString.substring(0, x) + '...'
            return
          }
        }
        textObj.textContent = '.' // can't place at all
      }
    }
  }
}

export default Graphics
