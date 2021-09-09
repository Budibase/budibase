import Graphics from '../Graphics'
import Utils from '../../utils/Utils'
import AxesUtils from './AxesUtils'

/**
 * ApexCharts YAxis Class for drawing Y-Axis.
 *
 * @module YAxis
 **/

export default class YAxis {
  constructor(ctx) {
    this.ctx = ctx
    this.w = ctx.w
    const w = this.w

    this.xaxisFontSize = w.config.xaxis.labels.style.fontSize
    this.axisFontFamily = w.config.xaxis.labels.style.fontFamily

    this.xaxisForeColors = w.config.xaxis.labels.style.colors
    this.isCategoryBarHorizontal =
      w.config.chart.type === 'bar' && w.config.plotOptions.bar.horizontal

    this.xAxisoffX = 0
    if (w.config.xaxis.position === 'bottom') {
      this.xAxisoffX = w.globals.gridHeight
    }
    this.drawnLabels = []
    this.axesUtils = new AxesUtils(ctx)
  }

  drawYaxis(realIndex) {
    let w = this.w
    let graphics = new Graphics(this.ctx)

    const yaxisStyle = w.config.yaxis[realIndex].labels.style
    let yaxisFontSize = yaxisStyle.fontSize
    let yaxisFontFamily = yaxisStyle.fontFamily
    let yaxisFontWeight = yaxisStyle.fontWeight

    let elYaxis = graphics.group({
      class: 'apexcharts-yaxis',
      rel: realIndex,
      transform: 'translate(' + w.globals.translateYAxisX[realIndex] + ', 0)'
    })

    if (this.axesUtils.isYAxisHidden(realIndex)) {
      return elYaxis
    }

    let elYaxisTexts = graphics.group({
      class: 'apexcharts-yaxis-texts-g'
    })

    elYaxis.add(elYaxisTexts)

    let tickAmount = w.globals.yAxisScale[realIndex].result.length - 1

    // labelsDivider is simply svg height/number of ticks
    let labelsDivider = w.globals.gridHeight / tickAmount

    // initial label position = 0;
    let l = w.globals.translateY
    let lbFormatter = w.globals.yLabelFormatters[realIndex]

    let labels = w.globals.yAxisScale[realIndex].result.slice()

    labels = this.axesUtils.checkForReversedLabels(realIndex, labels)

    let firstLabel = ''
    if (w.config.yaxis[realIndex].labels.show) {
      for (let i = tickAmount; i >= 0; i--) {
        let val = labels[i]

        val = lbFormatter(val, i, w)

        let xPad = w.config.yaxis[realIndex].labels.padding
        if (w.config.yaxis[realIndex].opposite && w.config.yaxis.length !== 0) {
          xPad = xPad * -1
        }

        const yColors = this.axesUtils.getYAxisForeColor(
          yaxisStyle.colors,
          realIndex
        )
        const getForeColor = () => {
          return Array.isArray(yColors) ? yColors[i] : yColors
        }

        let label = graphics.drawText({
          x: xPad,
          y: l + tickAmount / 10 + w.config.yaxis[realIndex].labels.offsetY + 1,
          text: val,
          textAnchor: w.config.yaxis[realIndex].opposite ? 'start' : 'end',
          fontSize: yaxisFontSize,
          fontFamily: yaxisFontFamily,
          fontWeight: yaxisFontWeight,
          foreColor: getForeColor(),
          isPlainText: false,
          cssClass: 'apexcharts-yaxis-label ' + yaxisStyle.cssClass
        })
        if (i === tickAmount) {
          firstLabel = label
        }
        elYaxisTexts.add(label)

        let elTooltipTitle = document.createElementNS(w.globals.SVGNS, 'title')
        elTooltipTitle.textContent = Array.isArray(val) ? val.join(' ') : val
        label.node.appendChild(elTooltipTitle)

        if (w.config.yaxis[realIndex].labels.rotate !== 0) {
          let firstabelRotatingCenter = graphics.rotateAroundCenter(
            firstLabel.node
          )
          let labelRotatingCenter = graphics.rotateAroundCenter(label.node)
          label.node.setAttribute(
            'transform',
            `rotate(${w.config.yaxis[realIndex].labels.rotate} ${firstabelRotatingCenter.x} ${labelRotatingCenter.y})`
          )
        }
        l = l + labelsDivider
      }
    }

    if (w.config.yaxis[realIndex].title.text !== undefined) {
      let elYaxisTitle = graphics.group({
        class: 'apexcharts-yaxis-title'
      })

      let x = 0
      if (w.config.yaxis[realIndex].opposite) {
        x = w.globals.translateYAxisX[realIndex]
      }
      let elYAxisTitleText = graphics.drawText({
        x,
        y:
          w.globals.gridHeight / 2 +
          w.globals.translateY +
          w.config.yaxis[realIndex].title.offsetY,
        text: w.config.yaxis[realIndex].title.text,
        textAnchor: 'end',
        foreColor: w.config.yaxis[realIndex].title.style.color,
        fontSize: w.config.yaxis[realIndex].title.style.fontSize,
        fontWeight: w.config.yaxis[realIndex].title.style.fontWeight,
        fontFamily: w.config.yaxis[realIndex].title.style.fontFamily,
        cssClass:
          'apexcharts-yaxis-title-text ' +
          w.config.yaxis[realIndex].title.style.cssClass
      })

      elYaxisTitle.add(elYAxisTitleText)

      elYaxis.add(elYaxisTitle)
    }

    let axisBorder = w.config.yaxis[realIndex].axisBorder

    let x = 31 + axisBorder.offsetX
    if (w.config.yaxis[realIndex].opposite) {
      x = -31 - axisBorder.offsetX
    }

    if (axisBorder.show) {
      let elVerticalLine = graphics.drawLine(
        x,
        w.globals.translateY + axisBorder.offsetY - 2,
        x,
        w.globals.gridHeight + w.globals.translateY + axisBorder.offsetY + 2,
        axisBorder.color,
        0,
        axisBorder.width
      )

      elYaxis.add(elVerticalLine)
    }
    if (w.config.yaxis[realIndex].axisTicks.show) {
      this.axesUtils.drawYAxisTicks(
        x,
        tickAmount,
        axisBorder,
        w.config.yaxis[realIndex].axisTicks,
        realIndex,
        labelsDivider,
        elYaxis
      )
    }

    return elYaxis
  }

  // This actually becomes horizontal axis (for bar charts)
  drawYaxisInversed(realIndex) {
    let w = this.w
    let graphics = new Graphics(this.ctx)

    let elXaxis = graphics.group({
      class: 'apexcharts-xaxis apexcharts-yaxis-inversed'
    })

    let elXaxisTexts = graphics.group({
      class: 'apexcharts-xaxis-texts-g',
      transform: `translate(${w.globals.translateXAxisX}, ${w.globals.translateXAxisY})`
    })

    elXaxis.add(elXaxisTexts)

    let tickAmount = w.globals.yAxisScale[realIndex].result.length - 1

    // labelsDivider is simply svg width/number of ticks
    let labelsDivider = w.globals.gridWidth / tickAmount + 0.1

    // initial label position;
    let l = labelsDivider + w.config.xaxis.labels.offsetX

    let lbFormatter = w.globals.xLabelFormatter

    let labels = w.globals.yAxisScale[realIndex].result.slice()

    let timescaleLabels = w.globals.timescaleLabels
    if (timescaleLabels.length > 0) {
      this.xaxisLabels = timescaleLabels.slice()
      labels = timescaleLabels.slice()
      tickAmount = labels.length
    }

    labels = this.axesUtils.checkForReversedLabels(realIndex, labels)

    const tl = timescaleLabels.length

    if (w.config.xaxis.labels.show) {
      for (let i = tl ? 0 : tickAmount; tl ? i < tl : i >= 0; tl ? i++ : i--) {
        let val = labels[i]
        val = lbFormatter(val, i, w)

        let x =
          w.globals.gridWidth +
          w.globals.padHorizontal -
          (l - labelsDivider + w.config.xaxis.labels.offsetX)

        if (timescaleLabels.length) {
          let label = this.axesUtils.getLabel(
            labels,
            timescaleLabels,
            x,
            i,
            this.drawnLabels,
            this.xaxisFontSize
          )
          x = label.x
          val = label.text
          this.drawnLabels.push(label.text)

          if (i === 0 && w.globals.skipFirstTimelinelabel) {
            val = ''
          }
          if (i === labels.length - 1 && w.globals.skipLastTimelinelabel) {
            val = ''
          }
        }
        let elTick = graphics.drawText({
          x,
          y:
            this.xAxisoffX +
            w.config.xaxis.labels.offsetY +
            30 -
            (w.config.xaxis.position === 'top'
              ? w.globals.xAxisHeight + w.config.xaxis.axisTicks.height - 2
              : 0),
          text: val,
          textAnchor: 'middle',
          foreColor: Array.isArray(this.xaxisForeColors)
            ? this.xaxisForeColors[realIndex]
            : this.xaxisForeColors,
          fontSize: this.xaxisFontSize,
          fontFamily: this.xaxisFontFamily,
          fontWeight: w.config.xaxis.labels.style.fontWeight,
          isPlainText: false,
          cssClass:
            'apexcharts-xaxis-label ' + w.config.xaxis.labels.style.cssClass
        })

        elXaxisTexts.add(elTick)

        elTick.tspan(val)

        let elTooltipTitle = document.createElementNS(w.globals.SVGNS, 'title')
        elTooltipTitle.textContent = val
        elTick.node.appendChild(elTooltipTitle)

        l = l + labelsDivider
      }
    }

    this.inversedYAxisTitleText(elXaxis)
    this.inversedYAxisBorder(elXaxis)

    return elXaxis
  }

  inversedYAxisBorder(parent) {
    const w = this.w
    const graphics = new Graphics(this.ctx)

    let axisBorder = w.config.xaxis.axisBorder
    if (axisBorder.show) {
      let lineCorrection = 0
      if (w.config.chart.type === 'bar' && w.globals.isXNumeric) {
        lineCorrection = lineCorrection - 15
      }
      let elHorzLine = graphics.drawLine(
        w.globals.padHorizontal + lineCorrection + axisBorder.offsetX,
        this.xAxisoffX,
        w.globals.gridWidth,
        this.xAxisoffX,
        axisBorder.color,
        0,
        axisBorder.height
      )

      parent.add(elHorzLine)
    }
  }

  inversedYAxisTitleText(parent) {
    const w = this.w
    const graphics = new Graphics(this.ctx)
    if (w.config.xaxis.title.text !== undefined) {
      let elYaxisTitle = graphics.group({
        class: 'apexcharts-xaxis-title apexcharts-yaxis-title-inversed'
      })

      let elYAxisTitleText = graphics.drawText({
        x: w.globals.gridWidth / 2 + w.config.xaxis.title.offsetX,
        y:
          this.xAxisoffX +
          parseFloat(this.xaxisFontSize) +
          parseFloat(w.config.xaxis.title.style.fontSize) +
          w.config.xaxis.title.offsetY +
          20,
        text: w.config.xaxis.title.text,
        textAnchor: 'middle',
        fontSize: w.config.xaxis.title.style.fontSize,
        fontFamily: w.config.xaxis.title.style.fontFamily,
        fontWeight: w.config.xaxis.title.style.fontWeight,
        foreColor: w.config.xaxis.title.style.color,
        cssClass:
          'apexcharts-xaxis-title-text ' + w.config.xaxis.title.style.cssClass
      })

      elYaxisTitle.add(elYAxisTitleText)

      parent.add(elYaxisTitle)
    }
  }

  yAxisTitleRotate(realIndex, yAxisOpposite) {
    let w = this.w

    let graphics = new Graphics(this.ctx)

    let yAxisLabelsCoord = {
      width: 0,
      height: 0
    }
    let yAxisTitleCoord = {
      width: 0,
      height: 0
    }

    let elYAxisLabelsWrap = w.globals.dom.baseEl.querySelector(
      ` .apexcharts-yaxis[rel='${realIndex}'] .apexcharts-yaxis-texts-g`
    )

    if (elYAxisLabelsWrap !== null) {
      yAxisLabelsCoord = elYAxisLabelsWrap.getBoundingClientRect()
    }

    let yAxisTitle = w.globals.dom.baseEl.querySelector(
      `.apexcharts-yaxis[rel='${realIndex}'] .apexcharts-yaxis-title text`
    )

    if (yAxisTitle !== null) {
      yAxisTitleCoord = yAxisTitle.getBoundingClientRect()
    }

    if (yAxisTitle !== null) {
      let x = this.xPaddingForYAxisTitle(
        realIndex,
        yAxisLabelsCoord,
        yAxisTitleCoord,
        yAxisOpposite
      )

      yAxisTitle.setAttribute('x', x.xPos - (yAxisOpposite ? 10 : 0))
    }

    if (yAxisTitle !== null) {
      let titleRotatingCenter = graphics.rotateAroundCenter(yAxisTitle)
      yAxisTitle.setAttribute(
        'transform',
        `rotate(${
          yAxisOpposite
            ? w.config.yaxis[realIndex].title.rotate * -1
            : w.config.yaxis[realIndex].title.rotate
        } ${titleRotatingCenter.x} ${titleRotatingCenter.y})`
      )
    }
  }

  xPaddingForYAxisTitle(
    realIndex,
    yAxisLabelsCoord,
    yAxisTitleCoord,
    yAxisOpposite
  ) {
    let w = this.w
    let oppositeAxisCount = 0

    let x = 0
    let padd = 10

    if (w.config.yaxis[realIndex].title.text === undefined || realIndex < 0) {
      return {
        xPos: x,
        padd: 0
      }
    }

    if (yAxisOpposite) {
      x =
        yAxisLabelsCoord.width +
        w.config.yaxis[realIndex].title.offsetX +
        yAxisTitleCoord.width / 2 +
        padd / 2

      oppositeAxisCount += 1

      if (oppositeAxisCount === 0) {
        x = x - padd / 2
      }
    } else {
      x =
        yAxisLabelsCoord.width * -1 +
        w.config.yaxis[realIndex].title.offsetX +
        padd / 2 +
        yAxisTitleCoord.width / 2

      if (w.globals.isBarHorizontal) {
        padd = 25
        x =
          yAxisLabelsCoord.width * -1 -
          w.config.yaxis[realIndex].title.offsetX -
          padd
      }
    }

    return {
      xPos: x,
      padd
    }
  }

  // sets the x position of the y-axis by counting the labels width, title width and any offset
  setYAxisXPosition(yaxisLabelCoords, yTitleCoords) {
    let w = this.w

    let xLeft = 0
    let xRight = 0
    let leftOffsetX = 18
    let rightOffsetX = 1

    if (w.config.yaxis.length > 1) {
      this.multipleYs = true
    }

    w.config.yaxis.map((yaxe, index) => {
      let shouldNotDrawAxis =
        w.globals.ignoreYAxisIndexes.indexOf(index) > -1 ||
        !yaxe.show ||
        yaxe.floating ||
        yaxisLabelCoords[index].width === 0

      let axisWidth = yaxisLabelCoords[index].width + yTitleCoords[index].width

      if (!yaxe.opposite) {
        xLeft = w.globals.translateX - leftOffsetX

        if (!shouldNotDrawAxis) {
          leftOffsetX = leftOffsetX + axisWidth + 20
        }

        w.globals.translateYAxisX[index] = xLeft + yaxe.labels.offsetX
      } else {
        if (w.globals.isBarHorizontal) {
          xRight = w.globals.gridWidth + w.globals.translateX - 1

          w.globals.translateYAxisX[index] = xRight - yaxe.labels.offsetX
        } else {
          xRight = w.globals.gridWidth + w.globals.translateX + rightOffsetX

          if (!shouldNotDrawAxis) {
            rightOffsetX = rightOffsetX + axisWidth + 20
          }

          w.globals.translateYAxisX[index] = xRight - yaxe.labels.offsetX + 20
        }
      }
    })
  }

  setYAxisTextAlignments() {
    const w = this.w

    let yaxis = w.globals.dom.baseEl.getElementsByClassName(`apexcharts-yaxis`)
    yaxis = Utils.listToArray(yaxis)
    yaxis.forEach((y, index) => {
      const yaxe = w.config.yaxis[index]
      // proceed only if user has specified alignment
      if (yaxe && yaxe.labels.align !== undefined) {
        const yAxisInner = w.globals.dom.baseEl.querySelector(
          `.apexcharts-yaxis[rel='${index}'] .apexcharts-yaxis-texts-g`
        )
        let yAxisTexts = w.globals.dom.baseEl.querySelectorAll(
          `.apexcharts-yaxis[rel='${index}'] .apexcharts-yaxis-label`
        )

        yAxisTexts = Utils.listToArray(yAxisTexts)

        const rect = yAxisInner.getBoundingClientRect()

        if (yaxe.labels.align === 'left') {
          yAxisTexts.forEach((label, lI) => {
            label.setAttribute('text-anchor', 'start')
          })
          if (!yaxe.opposite) {
            yAxisInner.setAttribute('transform', `translate(-${rect.width}, 0)`)
          }
        } else if (yaxe.labels.align === 'center') {
          yAxisTexts.forEach((label, lI) => {
            label.setAttribute('text-anchor', 'middle')
          })
          yAxisInner.setAttribute(
            'transform',
            `translate(${(rect.width / 2) * (!yaxe.opposite ? -1 : 1)}, 0)`
          )
        } else if (yaxe.labels.align === 'right') {
          yAxisTexts.forEach((label, lI) => {
            label.setAttribute('text-anchor', 'end')
          })
          if (yaxe.opposite) {
            yAxisInner.setAttribute('transform', `translate(${rect.width}, 0)`)
          }
        }
      }
    })
  }
}
