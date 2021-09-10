/**
 * cesium 可视化部分的中文汉化，包含内容如下：
 * 1、汉化方式非从源码层面进行，而是外挂了一个插件执行，使用方便，但是汉化程度不深，只汉化了cesium可见的控件部分
 * 2、汉化内容包括：
 *  1）、右上角所有工具，包括影像选择的显示标题，鼠标滑过title，帮助面板描述等
 *  2）、左下角动画面板
 *  3）、状态栏时间刻度线、全屏按钮
 *  4）、cesium 描述字符
 * 3、中文通过百度、谷歌翻译实现
 * 4、针对cesium 1.58版本汉化
 */
export const i18n = (function () {
  /**
   * 调用汉化方法
   * @param {*} viewer
   */
  function load(el, lang) {
    if (lang === "zh-hans") {
      //工具条汉化
      loadToolbar(el)
      //全屏汉化
      loadFullExtent(el)
      //加载动画控件
      loadFlyController(el)
    }
  }

  function getChineseMaps() {
    return {
      "Enter an address or landmark...": "请输入搜索地址...",
      "View Home": "初始视图",
      "Columbus View": "二维水平视图",
      "2D": "二维垂直视图",
      "3D": "三维视图",
      "Navigation Instructions": "帮助",
      //图层
      Imagery: "影像",
      "Cesium ion": "推荐",
      Other: "其他",
      Terrain: "三维地形",
      "Bing Maps Aerial": "必应航空地图",
      "Bing Maps Aerial with Labels": "必应航空地图（带标注）",
      "Bing Maps Roads": "必应道路地图",
      "Sentinel-2": "哨兵卫星影像-2",
      "Blue Marble": "蓝色弹珠",
      "Earth at night": "地球之夜",
      "Natural Earth&nbsp;II": "自然地球II",
      "Mapbox Satellite": "Mapbox 卫星影像",
      "Mapbox Streets": "Mapbox 道路",
      "Mapbox Streets Classic": "Mapbox 道路（分类）",
      "ESRI World Imagery": "ESRI 影像",
      "ESRI World Street Map": "ESRI 道路",
      "ESRI National Geographic": "ESRI 自然地理",
      "Open­Street­Map": "Open­Street­Map矢量",
      "Stamen Watercolor": "雄蕊彩色",
      "Stamen Toner": "雄蕊黑白",
      "WGS84 Ellipsoid": "WGS84 椭球",
      "Cesium World Terrain": "Cesium 世界地形图",
      "Bing Maps aerial imagery, provided by Cesium ion":
        "必应航空地图，Cesium提供",
      "Bing Maps aerial imagery with labels, provided by Cesium ion":
        "必应航空地图（带标注），Cesium提供",
      "Bing Maps standard road maps, provided by Cesium ion":
        "必应道路地图，Cesium推荐",
      "Sentinel-2 cloudless by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016 and 2017).":
        "哨兵卫星影像-2，由EOX IT服务有限公司提供无云话服务（包括修改2016-2017年的哥白尼定点数据）",
      "Blue Marble Next Generation July, 2004 imagery from NASA.":
        "蓝色弹珠影像，美国宇航局2004年拍摄",
      "The Earth at night, also known as The Black Marble, is a 500 meter resolution global composite imagery layer released by NASA.":
        "地球之夜，也被称为黑色大理石，是美国宇航局发布的一个500米分辨率的全球复合图像层。",
      "Natural Earth II, darkened for contrast.\nhttp://www.naturalearthdata.com/":
        "自然地球II，变暗以形成对比\nhttp://www.naturalearthdata.com/",
      "Mapbox satellite imagery https://www.mapbox.com/maps/":
        "Mapbox 卫星影像 https://www.mapbox.com/maps/",
      "Mapbox streets imagery https://www.mapbox.com/maps/":
        "Mapbox 道路影像 https://www.mapbox.com/maps/",
      "Mapbox streets basic imagery https://www.mapbox.com/maps/":
        "Mapbox 道路影像（分类）https://www.mapbox.com/maps/",
      "World Imagery provides one meter or better satellite and aerial imagery in many parts of the world and lower resolution satellite imagery worldwide.  The map includes NASA Blue Marble: Next Generation 500m resolution imagery at small scales (above 1:1,000,000), i-cubed 15m eSAT imagery at medium-to-large scales (down to 1:70,000) for the world, and USGS 15m Landsat imagery for Antarctica. The map features 0.3m resolution imagery in the continental United States and 0.6m resolution imagery in parts of Western Europe from DigitalGlobe. In other parts of the world, 1 meter resolution imagery is available from GeoEye IKONOS, i-cubed Nationwide Prime, Getmapping, AeroGRID, IGN Spain, and IGP Portugal.  Additionally, imagery at different resolutions has been contributed by the GIS User Community.\nhttp://www.esri.com":
        "World Imagery在世界许多地方提供一米或更好的卫星和航空影像，并在全球范围内提供分辨率较低的卫星图像。 该地图包括美国宇航局蓝色大理石：小规模（1：1,000,000以上）的下一代500米分辨率图像，世界上大中型（低至1：70,000）的i-cubed 15米eSAT图像，以及USGS 15m Landsat 南极洲的图像。 该地图在美国大陆以0.3米分辨率图像为特色，在西欧部分地区以DigitalGlobe为0.6米分辨率图像。 在世界其他地方，可以从GeoEye IKONOS，i-cubed Nationwide Prime，Getmapping，AeroGRID，IGN Spain和IGP Portugal获得1米分辨率的图像。 此外，GIS用户社区也提供了不同分辨率的图像。\nhttp://www.esri.com",
      "This worldwide street map presents highway-level data for the world. Street-level data includes the United States; much of Canada; Japan; most countries in Europe; Australia and New Zealand; India; parts of South America including Argentina, Brazil, Chile, Colombia, and Venezuela; Ghana; and parts of southern Africa including Botswana, Lesotho, Namibia, South Africa, and Swaziland.\nhttp://www.esri.com":
        "这张全球街道地图显示了世界各地的公路级数据。 街道数据包括美国; 加拿大大部分地区 日本; 欧洲大部分国家; 澳大利亚和新西兰; 印度; 南美洲的部分地区包括阿根廷，巴西，智利，哥伦比亚和委内瑞拉; 加纳; 和南部非洲的部分地区，包括博茨瓦纳，莱索托，纳米比亚，南非和斯威士兰。\nhttp://www.esri.com",
      "This web map contains the National Geographic World Map service. This map service is designed to be used as a general reference map for informational and educational purposes as well as a basemap by GIS professionals and other users for creating web maps and web mapping applications.\nhttp://www.esri.com":
        "此Web地图包含国家地理世界地图服务。 此地图服务旨在用作信息和教育目的的一般参考地图，以及GIS专业人员和其他用户创建Web地图和Web地图应用程序的底图。\nhttp://www.esri.com",
      "OpenStreetMap (OSM) is a collaborative project to create a free editable map of the world.\nhttp://www.openstreetmap.org":
        "OpenStreetMap（OSM）是一个协作项目，用于创建可自由编辑的世界地图。\nhttp://www.openstreetmap.org",
      "Reminiscent of hand drawn maps, Stamen watercolor maps apply raster effect area washes and organic edges over a paper texture to add warm pop to any map.\nhttp://maps.stamen.com":
        "让人联想到手绘地图，雄蕊水彩地图在纸张纹理上应用栅格效果区域清洗和有机边缘，为任何地图添加温暖的流行。\nhttp://maps.stamen.com",
      "A high contrast black and white map.\nhttp://maps.stamen.com":
        "高对比度的黑白地图。\nhttp://maps.stamen.com",
      "WGS84 standard ellipsoid, also known as EPSG:4326":
        "WGS84标准椭球，又称EPSG：4326",
      "High-resolution global terrain tileset curated from several datasources and hosted by Cesium ion":
        "高分辨率全球地形图块集由几个数据源组成，由Cesium ion托管",
      //帮助
      Mouse: "鼠标",
      Touch: "手势",
      "Pan view": "平移视图",
      "Left click + drag": "左键+拖拽",
      "Zoom view": "缩放视图",
      "Right click + drag, or": "右键+拖拽，或者",
      "Mouse wheel scroll": "鼠标滚动滚动",
      "Rotate view": "旋转视图",
      "Middle click + drag, or": "中间滚动按下拖拽，或者",
      "CTRL + Left/Right click + drag": "CTRL +左/右 单击+拖拽",
      "One finger drag": "单指拽",
      "Two finger pinch": "两指捏",
      "Tilt view": "倾斜视图",
      "Two finger drag, same direction": "双指拖动，方向相同",
      "Two finger drag, opposite direction": "双指拖动，方向相反",
      //全屏
      "Full screen": "全屏",
      "Exit full screen": "退出全屏",
      //动画控件
      "Today (real-time)": "今天（实际时间）",
      "Play Reverse": "逆时针播放",
      "Play Forward": "顺时针播放",
      Pause: "暂停",
      cesium_description:
        "此应用程序使用Cesium的默认令牌访问。 在进行任何Cesium API调用之前，请使用您的帐户为Cesium.Ion.defaultAccessToken分配访问令牌。 您可以注册免费的Cesium帐户",
      "Data attribution": "数据归属",
      //月份
      Jan: "1月",
      Feb: "2月",
      Mar: "3月",
      Apr: "4月",
      May: "5月",
      Jun: "6月",
      Jul: "7月",
      Aug: "8月",
      Sep: "9月",
      Oct: "10月",
      Nov: "11月",
      Dec: "12月",
    }
  }

  /**
   * 工具条汉化
   */
  function loadToolbar(el) {
    //工具条鼠标悬浮提示汉化
    loadToolBarTitle(el)
    //图层选择汉化
    loadBaseLayerPickerOfToolbar(el)
    //帮助面板汉化
    loadToolBarHelp(el)
  }

  /**
   * 工具条鼠标悬浮提示汉化
   */
  function loadToolBarTitle(el) {
    var titles = getChineseMaps()

    //搜索
    updateAttribute(el, el, titles, "cesium-geocoder-input", "placeholder")

    //模式切换鼠标滑过提示
    updateAttributeByEvent(
      el,
      titles,
      "cesium-sceneModePicker-button3D",
      "title",
      "onmouseover"
    )
    updateAttribute(
      el,
      el,
      titles,
      "cesium-sceneModePicker-dropDown-icon",
      "title"
    )

    //初始视图
    updateAttribute(el, el, titles, "cesium-home-button", "title")

    //帮助
    updateAttribute(el, el, titles, "cesium-navigation-help-button", "title")
  }

  /**
   * 图层选择汉化
   */
  function loadBaseLayerPickerOfToolbar(el) {
    //图层选择需要汉化对象
    var layers = getChineseMaps()

    //获取容器
    var dropDownContainer = el.getElementsByClassName(
      "cesium-baseLayerPicker-dropDown"
    )
    if (dropDownContainer.length > 0) {
      dropDownContainer = dropDownContainer[0]
      //修改标题
      updateHtml(
        dropDownContainer,
        el,
        layers,
        "cesium-baseLayerPicker-sectionTitle"
      )
      //副标题
      updateHtml(
        dropDownContainer,
        el,
        layers,
        "cesium-baseLayerPicker-categoryTitle"
      )
      //具体标签
      updateHtml(
        dropDownContainer,
        el,
        layers,
        "cesium-baseLayerPicker-itemLabel"
      )
      //具体地图描述
      updateAttribute(
        dropDownContainer,
        el,
        layers,
        "cesium-baseLayerPicker-item",
        "title"
      )

      //鼠标悬浮事件监听，解决选择不同影像title 动态修改无法固定汉化问题
      var selectLayerToolbar = el.getElementsByClassName(
        "cesium-baseLayerPicker-selected"
      )
      if (selectLayerToolbar.length > 0) {
        selectLayerToolbar[0].parentElement.onmouseover = function (event) {
          var currentTitle = event.currentTarget.getAttribute("title")
          var currentTargets = currentTitle.split("\n")
          var tempTitle1 = ""
          var tempTitle2 = ""
          if (layers[currentTargets[0]]) tempTitle1 += layers[currentTargets[0]]
          else tempTitle1 += currentTargets[0]

          if (layers[currentTargets[0]]) tempTitle2 += layers[currentTargets[1]]
          else tempTitle2 += currentTargets[1]
          event.currentTarget.setAttribute(
            "title",
            tempTitle1 + "\n" + tempTitle2
          )
        }
      }
    }
  }

  /**
   * 工具条帮助面板汉化
   */
  function loadToolBarHelp(el) {
    var texts = getChineseMaps()

    //鼠标
    var mouseButton = el.getElementsByClassName("cesium-navigation-button-left")
    if (mouseButton.length > 0) {
      mouseButton = mouseButton[0]
      if (texts[mouseButton.textContent])
        mouseButton.innerHTML =
          mouseButton.children[0].outerHTML + texts[mouseButton.textContent]
    }

    var touchButton = el.getElementsByClassName(
      "cesium-navigation-button-right"
    )
    if (touchButton.length > 0) {
      touchButton = touchButton[0]
      if (texts[touchButton.textContent])
        touchButton.innerHTML =
          touchButton.children[0].outerHTML + texts[touchButton.textContent]
    }

    updateHtml(el, el, texts, "cesium-navigation-help-pan")
    updateHtml(el, el, texts, "cesium-navigation-help-details")
    updateHtml(el, el, texts, "cesium-navigation-help-zoom")
    updateHtml(el, el, texts, "cesium-navigation-help-rotate")
    updateHtml(el, el, texts, "cesium-navigation-help-tilt")
  }

  /**
   * 全屏显示汉化
   */
  function loadFullExtent(el) {
    var titles = getChineseMaps()

    updateAttributeByEvent(
      el,
      titles,
      "cesium-fullscreenButton",
      "title",
      "onmouseover"
    )
  }

  /**
   * 动画控件汉化
   */
  function loadFlyController(el) {
    var titles = getChineseMaps()
    var parentContainer = el.getElementsByClassName(
      "cesium-viewer-animationContainer"
    )
    if (parentContainer.length > 0) {
      parentContainer = parentContainer[0]
      updateHtmlByTagName(parentContainer, el, titles, "title")

      var datedes = parentContainer.getElementsByClassName(
        "cesium-animation-svgText"
      )
      for (var i = 0; i < datedes.length; i++) {
        var text = datedes[i].children[0].innerHTML
        var texts = text.split(" ")
        if (texts.length == 3) {
          datedes[i].children[0].innerHTML =
            texts[2] + "年" + titles[texts[0]] + texts[1] + "日"
        } else if (texts.length == 2) {
          datedes[i].children[0].innerHTML = texts[0] + "标准时间"
          datedes[i].addEventListener("DOMNodeInserted", function (e) {
            e = e || event
            e.target.nodeValue = e.target.nodeValue.split(" ")[0] + "标准时间"
          })
        }
      }
    }

    //修改底部描述
    var cesiumDescription = el.getElementsByClassName(
      "cesium-credit-textContainer"
    )
    if (cesiumDescription.length > 0) {
      var insertEvent = function (e) {
        e = e || event
        console.log(e)
        cesiumDescription[0].removeEventListener("DOMNodeInserted", insertEvent)

        if (
          cesiumDescription[0].children.length > 0 &&
          cesiumDescription[0].children[0].children.length > 0
        )
          cesiumDescription[0].children[0].children[0].innerHTML =
            titles["cesium_description"]
      }
      cesiumDescription[0].addEventListener("DOMNodeInserted", insertEvent)
    }

    //数据归属
    updateHtml(el, el, titles, "cesium-credit-expand-link")

    var timeLineBar = el.getElementsByClassName("cesium-timeline-bar")
    if (timeLineBar.length > 0) {
      timeLineBar = timeLineBar[0]
      timeLineBar.addEventListener("DOMNodeInserted", function (e) {
        e = e || event
        if (e.target.nodeType == 3) return
        if (e.target.getAttribute("class") == "cesium-timeline-ticLabel") {
          var texts = e.target.innerHTML.split(" ")
          if (texts.length > 3) {
            var resultText =
              texts[2] +
              "年" +
              titles[texts[0]] +
              texts[1] +
              "日 " +
              texts[3] +
              ""
            e.target.innerHTML = resultText
          }
        }
      })

      var labels = timeLineBar.getElementsByClassName(
        "cesium-timeline-ticLabel"
      )
      for (let i = 0; i < labels.length; i++) {
        let texts = labels[i].innerHTML.split(" ")
        if (texts.length > 3) {
          var resultText =
            texts[2] +
            "年" +
            titles[texts[0]] +
            texts[1] +
            "日 " +
            texts[3] +
            ""
          labels[i].innerHTML = resultText
        }
      }
    }
  }

  /**
   * 更新dom innerHtml
   * @param {*} parent 父容器对象
   * @param {*} map 汉化对象
   * @param {*} className class名称
   */
  function updateHtml(parent, el, map, className) {
    if (!parent) parent = el

    var doms = parent.getElementsByClassName(className)
    for (var i = 0; i < doms.length; i++) {
      if (map[doms[i].innerHTML]) doms[i].innerHTML = map[doms[i].innerHTML]
    }
  }

  /**
   * 更新dom innerHtml
   * @param {*} parent 父容器对象
   * @param {*} map 汉化对象
   * @param {*} tagName 标签名称
   */
  function updateHtmlByTagName(parent, el, map, tagName) {
    if (!parent) parent = el

    var doms = parent.getElementsByTagName(tagName)
    for (var i = 0; i < doms.length; i++) {
      if (map[doms[i].innerHTML]) doms[i].innerHTML = map[doms[i].innerHTML]
    }
  }

  /**
   * 更新dom innerHtml
   * @param {*} parent 父容器对象
   * @param {*} map 汉化对象
   * @param {*} className class名称
   * @param {*} attributeName 属性名称
   */
  function updateAttribute(parent, el, map, className, attributeName) {
    if (!parent) parent = el

    var doms = parent.getElementsByClassName(className)
    for (var i = 0; i < doms.length; i++) {
      if (map[doms[i].getAttribute(attributeName)])
        doms[i].setAttribute(
          attributeName,
          map[doms[i].getAttribute(attributeName)]
        )
    }
  }

  /**
   * 通过事件更新属性
   * @param {*} parent 父容器
   * @param {*} map 汉化对象
   * @param {*} className 样式名称
   * @param {*} attributeName 属性名称
   * @param {*} eventName 事件名称
   */
  function updateAttributeByEvent(
    parent,
    map,
    className,
    attributeName,
    eventName
  ) {
    var doms = parent.getElementsByClassName(className)
    if (doms.length > 0) {
      for (var i = 0; i < doms.length; i++) {
        doms[i][eventName] = function (event) {
          var attr = event.currentTarget.getAttribute(attributeName)
          if (map[attr])
            event.currentTarget.setAttribute(attributeName, map[attr])
        }
      }
    }
  }

  return {
    load: load,
  }
})()
