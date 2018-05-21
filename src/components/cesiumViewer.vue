<template>
    <div id="cesiumContainer">
      <!--<tool-bar></tool-bar>-->
      <panorama-view></panorama-view>
      <CesiumToolBarExtend/>
      <!--<LocationBox  :location-info="location"></LocationBox>-->
    </div>

</template>
<script type="text/javascript">
import Vue from 'vue'
import ToolBar from './ToolBar.vue'
import PanoramaView from './PanoramaView.vue'
import CesiumToolBarExtend from './CesiumToolBarExtend'
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import FileSaver from 'file-saver'
import api from '../../static/js/api'
import LocationBox from './LocationBox'
import io from 'socket.io-client'
// import '../../static/js/viewerCesiumNavigationMixin'
/* eslint-disable no-unused-vars */
export default {
  components: {
    LocationBox,
    CesiumToolBarExtend,
    PanoramaView,
    ToolBar},
  name: 'cesiumViewer',
  data () {
    return {
      config: {
        geocoder: false,
        timeline: false,
        navigationHelpButton: false,
        animation: false,
        homeButton: false,
        // infoBox: false,
        baseLayerPicker: false,
        sceneModePicker: false
      },
      viewer: undefined,
      entities: undefined,
      location: undefined
    }
  },
  created () {
    console.info('panorama created')
    console.info(api)
    // 初始化api配置
    this.$store.commit('updateApi', api)
    // console.info(this.$store.getters.state.api)
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
    Cesium.BingMapsApi.defaultKey = ''
    this.viewer = new Cesium.Viewer('cesiumContainer', this.config)
    // Cesium.viewerCesiumNavigationMixin(this.viewer, {})
    // this.viewer.scene.debugShowFramesPerSecond = true
    this.removeDefaultEvent()
    this.load3dTiles()
    this.loadGeojson()
    this.showHight()
    this.entityPick()
    this.getWarningAddress()
    // this.warningMonitoring()
  },
  computed: {
    geojsonService () {
      return this.$store.getters.getGeoJsonServiceUrl
    },
    modelTileService () {
      return this.$store.getters.getModelTilesUrl
    },
    localtionReportService () {
      return this.$store.getters.getlocaltionReportUrl
    },
    warningQueryService () {
      return this.$store.getters.getWarningQueryUrl
    },
    // 获得的用户信息
    userinfo () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    // 加载geojson数据
    loadGeojson: function () {
      var vm = this
      var serviceUrl = vm.geojsonService
      var datasource1 = new Cesium.GeoJsonDataSource()
      var features = datasource1.load(serviceUrl)
      features.then(function (datasource) {
        vm.viewer.dataSources.add(datasource)
        vm.viewer.zoomTo(datasource)
        vm.entities = datasource.entities.values
        for (var i = 0; i < vm.entities.length; i++) {
          var entity = vm.entities[i]
          entity.billboard = undefined
          // var text = entity.properties.NAME.getValue(vm.viewer.clock.currentTime)
          // entity.label = {
          //   text: text,
          //   show: true
          // }
          // entity.label.show = true
          entity.point = new Cesium.PointGraphics({
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            color: Cesium.Color.RED,
            pixelSize: 10
          })
        }
      }).otherwise(function (err) {
        vm.$Message.error(`请求 GeoJson服务失败: ${err}`)
        console.error(`请求 GeoJson服务失败: ${err}`)
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
        url: vm.modelTileService,
        maximumScreenSpaceError: isMobile.any() ? 8 : 1,
        maximumNumberOfLoadedTiles: isMobile.any() ? 10 : 1000
      })
      tileset.readyPromise.then(function (tileset) {
        vm.viewer.scene.primitives.add(tileset)
        vm.viewer.zoomTo(tileset)
      }).otherwise(function (err) {
        vm.$Message.error(`请求 模型服务失败: ${err}`)
        console.error(`请求 模型服务失败: ${err}`)
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
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5)
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5)
        var heightString = cartographic.height.toFixed(5)
        array.push({'name': entity.properties.NAME.getValue(vm.viewer.clock.currentTime), 'height': heightString})
      }
      var blob = new Blob([JSON.stringify(array)], {type: 'application/json'})
      FileSaver.saveAs(blob, 'point.json')
    },
    // 鼠标悬浮显示模型高度
    showHight: function () {
      var vm = this
      // Mouse over the globe to see the cartographic position
      var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
      handler.setInputAction(function (movement) {
        var scene = vm.viewer.scene
        if (scene.mode !== Cesium.SceneMode.MORPHING) {
          var pickedObject = scene.pick(movement.endPosition)
          if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
            var cartesian = vm.viewer.scene.pickPosition(movement.endPosition)
            if (Cesium.defined(cartesian)) {
              var cartographic = Cesium.Cartographic.fromCartesian(cartesian)
              var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5)
              var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5)
              var heightString = cartographic.height.toFixed(2)
              vm.location = `经度：${longitudeString} 纬度：${latitudeString} 高度：${heightString}m`
            }
          } else {
            vm.location = ''
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    },
    getWarningAddress: function () {
      var vm = this
      vm.$http.get(vm.warningQueryService).then(function (res) {
        if (res.data.result === '0') {
          vm.$store.commit('updateWarningServer', res.data.resultMess)
          vm.warningMonitoring()
        }
      })
    },
    // 报警监控
    warningMonitoring: function () {
      var vm = this
      var socket = io.connect(vm.$store.getters.getWarningUrl)
      socket.on('connect', function () {
        console.info(socket.id)
        socket.emit('sendMessage', 'helloworld')
      })
      socket.on('receiveMessage', function (data) {
        console.info(data)
      })
    }

  }
}
</script>
<style>

</style>
