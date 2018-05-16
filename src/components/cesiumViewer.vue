<template>
    <div id="cesiumContainer">
      <tool-bar></tool-bar>
      <panorama-view></panorama-view>
      <CesiumToolBarExtend/>
    </div>

</template>
<script type="text/javascript">
import ToolBar from './ToolBar.vue'
import PanoramaView from './PanoramaView.vue'
import CesiumToolBarExtend from './CesiumToolBarExtend'
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import FileSaver from 'file-saver'
import api from '../../static/js/api'
/* eslint-disable no-unused-vars */
export default {
  components: {
    CesiumToolBarExtend,
    PanoramaView,
    ToolBar},
  name: 'cesiumViewer',
  data () {
    return {
      config: {
        geocoder: true,
        timeline: false,
        navigationHelpButton: false,
        animation: false,
        // infoBox: false,
        baseLayerPicker: false,
        sceneModePicker: false
      },
      viewer: undefined,
      entities: undefined
    }
  },
  created () {
    // console.info('panorama created')
    // 监听showPanorama 方法 此方法由 ToolBar.vue 中的按钮触发,此事件在热部署中会多次执行，解决方案往下看
    // https://www.cnblogs.com/xiaochongchong/p/8127148.html
    this.$root.eventBus.$on('getHeight', this.getheight)
  },
  beforeDestroy () {
    // 防止多次触发
    this.$root.eventBus.$off('getHeight', this.getheight)
  },
  mounted () {
    // 使相机默认朝向中国
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(73, 4, 135, 53)
    this.viewer = new Cesium.Viewer('cesiumContainer', this.config)
    this.viewer.scene.debugShowFramesPerSecond = true
    this.removeDefaultEvent()
    this.load3dTiles()
    this.loadGeojson()
    this.showHight()
    this.entityPick()
    for (var key in api) {
      console.info(`key: ${key},value ${api[key]}`)
    }
  },
  methods: {
    // 加载geojson数据
    loadGeojson: function () {
      var vm = this
      var serviceUrl = 'http://192.168.2.114:8084/360hot/GetPointsInfoServlet?sceneitems_id=58'
      var datasource1 = new Cesium.GeoJsonDataSource()
      var features = datasource1.load(serviceUrl)
      features.then(function (datasource) {
        vm.viewer.dataSources.add(datasource)
        vm.viewer.zoomTo(datasource)
        vm.entities = datasource.entities.values
        for (var i = 0; i < vm.entities.length; i++) {
          var entity = vm.entities[i]
          entity.billboard = undefined
          entity.point = new Cesium.PointGraphics({
            // disableDepthTestDistance: Number.POSITIVE_INFINITY,
            color: Cesium.Color.RED,
            pixelSize: 10
          })
        }
      })
    },
    // 加载 3dTiles
    load3dTiles: function () {
      var vm = this
      var isMobile = {
        Android: function () {
          return navigator.userAgent.match(/Android/i)
        },
        BlackBerry: function () {
          return navigator.userAgent.match(/BlackBerry/i)
        },
        iOS: function () {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i)
        },
        Opera: function () {
          return navigator.userAgent.match(/Opera Mini/i)
        },
        Windows: function () {
          return navigator.userAgent.match(/IEMobile/i)
        },
        any: function () {
          return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
        }
      }
      var tileset = new Cesium.Cesium3DTileset({
        url: 'http://192.168.2.114:8084/360hot/data/Scene/Cesium_3D.json',
        maximumScreenSpaceError: isMobile.any() ? 8 : 1,
        maximumNumberOfLoadedTiles: isMobile.any() ? 10 : 1000
      })
      tileset.readyPromise.then(function (tileset) {
        vm.viewer.scene.primitives.add(tileset)
        vm.viewer.zoomTo(tileset)
      })
    },
    // 实体点击事件 打开全景
    entityPick: function (target) {
      var vm = this
      var clickHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
      clickHandler.setInputAction(function (click) {
        var picked = vm.viewer.scene.pick(click.position) // 拾取实体
        if (Cesium.defined(picked)) {
          var pickEntity = Cesium.defaultValue(picked.id, picked.primitive.id)
          if (pickEntity instanceof Cesium.Entity) {
            vm.viewer.zoomTo(pickEntity).then(function () {
              var props = pickEntity.properties
              var currentTime = vm.viewer.clock.currentTime
              var params = {
                'Name': props.NAME.getValue(currentTime),
                'sence_id': props.sence_id.getValue(currentTime),
                'senceitems_id': props.senceitems_id.getValue(currentTime),
                'group_id': props.group_id.getValue(currentTime)
              }
              vm.$root.eventBus.$emit('showPanorama', params) // 先缩放后打开全景
            })
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    },
    // 移除默认双击事件
    removeDefaultEvent: function (target) {
      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    },
    getheight: function (target) {
      var vm = this
      var scene = vm.viewer.scene
      var array = []
      for (var entity of vm.entities) {
        var entityPosition = entity.position.getValue(vm.viewer.clock.currentTime) // cartesian3
        var canvasCoordinates = scene.cartesianToCanvasCoordinates(entityPosition) // cartesian2
        var cartesian = vm.viewer.scene.pickPosition(canvasCoordinates)
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian)
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2)
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2)
        var heightString = cartographic.height.toFixed(2)
        array.push({'name': entity.properties.NAME.getValue(vm.viewer.clock.currentTime), 'height': heightString})
      }
      var blob = new Blob([JSON.stringify(array)], {type: 'application/json'})
      FileSaver.saveAs(blob, 'point.json')
    },
    // 鼠标悬浮显示模型高度
    showHight: function () {
      var vm = this
      var labelEntity = this.viewer.entities.add({
        label: {
          show: false,
          showBackground: true,
          font: '14px monospace',
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(15, 0)
        }
      })

      // Mouse over the globe to see the cartographic position
      var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
      handler.setInputAction(function (movement) {
        var foundPosition = false

        var scene = vm.viewer.scene
        if (scene.mode !== Cesium.SceneMode.MORPHING) {
          var pickedObject = scene.pick(movement.endPosition)
          if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
            var cartesian = vm.viewer.scene.pickPosition(movement.endPosition)
            if (Cesium.defined(cartesian)) {
              var cartographic = Cesium.Cartographic.fromCartesian(cartesian)
              var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2)
              var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2)
              var heightString = cartographic.height.toFixed(2)

              labelEntity.position = cartesian
              labelEntity.label.show = true
              labelEntity.label.text =
                'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
                '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0' +
                '\nAlt: ' + ('   ' + heightString).slice(-7) + 'm'

              labelEntity.label.eyeOffset = new Cesium.Cartesian3(0.0, 0.0, -cartographic.height * (scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0))

              foundPosition = true
            }
          }
        }

        if (!foundPosition) {
          labelEntity.label.show = false
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

  }
}
</script>
<style>

</style>
