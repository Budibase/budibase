export default class Helpers {
  constructor(annoCtx) {
    this.w = annoCtx.w
    this.annoCtx = annoCtx
  }

  setOrientations(anno, annoIndex = null) {
    let w = this.w

    if (anno.label.orientation === 'vertical') {
      const i = annoIndex !== null ? annoIndex : 0
      let xAnno = w.globals.dom.baseEl.querySelector(
        `.apexcharts-xaxis-annotations .apexcharts-xaxis-annotation-label[rel='${i}']`
      )

      if (xAnno !== null) {
        const xAnnoCoord = xAnno.getBoundingClientRect()
        xAnno.setAttribute(
          'x',
          parseFloat(xAnno.getAttribute('x')) - xAnnoCoord.height + 4
        )

        if (anno.label.position === 'top') {
          xAnno.setAttribute(
            'y',
            parseFloat(xAnno.getAttribute('y')) + xAnnoCoord.width
          )
        } else {
          xAnno.setAttribute(
            'y',
            parseFloat(xAnno.getAttribute('y')) - xAnnoCoord.width
          )
        }

        let annoRotatingCenter = this.annoCtx.graphics.rotateAroundCenter(xAnno)
        const x = annoRotatingCenter.x
        const y = annoRotatingCenter.y

        xAnno.setAttribute('transform', `rotate(-90 ${x} ${y})`)
      }
    }
  }

  addBackgroundToAnno(annoEl, anno) {
    const w = this.w

    if (
      !annoEl ||
      !anno.label.text ||
      (anno.label.text && !anno.label.text.trim())
    )
      return null

    const elGridRect = w.globals.dom.baseEl
      .querySelector('.apexcharts-grid')
      .getBoundingClientRect()

    const coords = annoEl.getBoundingClientRect()

    let pleft = anno.label.style.padding.left
    let pright = anno.label.style.padding.right
    let ptop = anno.label.style.padding.top
    let pbottom = anno.label.style.padding.bottom

    if (anno.label.orientation === 'vertical') {
      ptop = anno.label.style.padding.left
      pbottom = anno.label.style.padding.right
      pleft = anno.label.style.padding.top
      pright = anno.label.style.padding.bottom
    }

    const x1 = coords.left - elGridRect.left - pleft
    const y1 = coords.top - elGridRect.top - ptop
    const elRect = this.annoCtx.graphics.drawRect(
      x1 - w.globals.barPadForNumericAxis,
      y1,
      coords.width + pleft + pright,
      coords.height + ptop + pbottom,
      anno.label.borderRadius,
      anno.label.style.background,
      1,
      anno.label.borderWidth,
      anno.label.borderColor,
      0
    )

    if (anno.id) {
      elRect.node.classList.add(anno.id)
    }

    return elRect
  }

  annotationsBackground() {
    const w = this.w

    const add = (anno, i, type) => {
      let annoLabel = w.globals.dom.baseEl.querySelector(
        `.apexcharts-${type}-annotations .apexcharts-${type}-annotation-label[rel='${i}']`
      )

      if (annoLabel) {
        const parent = annoLabel.parentNode
        const elRect = this.addBackgroundToAnno(annoLabel, anno)

        if (elRect) {
          parent.insertBefore(elRect.node, annoLabel)
        }
      }
    }

    w.config.annotations.xaxis.map((anno, i) => {
      add(anno, i, 'xaxis')
    })

    w.config.annotations.yaxis.map((anno, i) => {
      add(anno, i, 'yaxis')
    })

    w.config.annotations.points.map((anno, i) => {
      add(anno, i, 'point')
    })
  }

  getStringX(x) {
    const w = this.w
    let rX = x

    if (
      w.config.xaxis.convertedCatToNumeric &&
      w.globals.categoryLabels.length
    ) {
      x = w.globals.categoryLabels.indexOf(x) + 1
    }

    let catIndex = w.globals.labels.indexOf(x)

    const xLabel = w.globals.dom.baseEl.querySelector(
      '.apexcharts-xaxis-texts-g text:nth-child(' + (catIndex + 1) + ')'
    )

    if (xLabel) {
      rX = parseFloat(xLabel.getAttribute('x'))
    }

    return rX
  }
}
