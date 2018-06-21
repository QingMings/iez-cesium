<template>
    <div id="cesiumContainer">
      <!--<tool-bar></tool-bar>-->
      <panorama-view></panorama-view>
      <CesiumToolBarExtend/>
      <!--<LocationBox  :location-info="location"></LocationBox>-->
      <SoundWarning></SoundWarning>
    </div>

</template>
<script type="text/javascript">
import ToolBar from './ToolBar.vue'
import PanoramaView from './PanoramaView.vue'
import CesiumToolBarExtend from './CesiumToolBarExtend'
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import FileSaver from 'file-saver'
import LocationBox from './LocationBox'
import io from 'socket.io-client'
import LocalGeocoder from '../utils/LocalGeocoder'
import SoundWarning from './SoundWarning'
import viewerCesiumNavigationMixin from '../widget/navi/viewerCesiumNavigationMixin'
/* eslint-disable no-unused-vars */
export default {
  components: {
    SoundWarning,
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
        infoBox: false,
        baseLayerPicker: false,
        sceneModePicker: false
      },
      viewer: undefined,
      entities: undefined,
      location: undefined,
      tileset: undefined
    }
  },
  created () {
    // 初始化api配置
    this.$store.commit('updateApi', api)
    // console.info(this.$store.getters.state.api)
    // 监听showPanorama 方法 此方法由 ToolBar.vue 中的按钮触发,此事件在热部署中会多次执行，解决方案往下看
    // https://www.cnblogs.com/xiaochongchong/p/8127148.html
    this.$root.eventBus.$on('getHeight', this.getheight)
    this.$root.eventBus.$on('adddTest', this.addtest)
    this.$root.eventBus.$on('removeTest', this.removetest)
  },
  beforeDestroy () {
    // 防止多次触发
    this.$root.eventBus.$off('getHeight', this.getheight)
    this.$root.eventBus.$off('adddTest', this.addtest)
    this.$root.eventBus.$off('removeTest', this.removetest)
  },
  mounted () {
    // 使相机默认朝向中国
    var vm = this
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(73, 4, 135, 53)
    Cesium.BingMapsApi.defaultKey = ''
    this.viewer = new Cesium.Viewer('cesiumContainer', this.config)
    // viewerCesiumNavigationMixin(this.viewer, {
    //   defaultResetView: Cesium.Rectangle.fromDegrees(118.8345, 38.143973, 118.83815627, 38.14106426)
    // })
    // this.viewer.scene.debugShowFramesPerSecond = true
    // this.viewer.scene.debugShowContentBoundingVolume = true
    this.removeDefaultEvent()
    this.load3dTiles()
    this.loadGeojson()
    this.showHight()
    this.entityPick()
    this.getWarningAddress()
    // var camera = vm.viewer.scene.camera
    // setTimeout(function () {
    //   camera.flyTo({
    //     destination: Cesium.Cartesian3.fromDegrees(118.83646524, 38.14250495, 463.34038727246224),
    //     duration: 10,
    //     pitch: Cesium.Math.toRadians(-50.0),
    //     complete: function () {
    //       setTimeout(function () {
    //         camera.flyTo({
    //           destination: Cesium.Cartesian3.fromDegrees(118.83891297, 38.14412996, 186.50838555841779),
    //           duration: 2,
    //           orientation: {
    //             heading: Cesium.Math.toRadians(230.0),
    //             pitch: Cesium.Math.toRadians(-35.0),
    //             roll: 0.0
    //           },
    //
    //           easingFunction: Cesium.EasingFunction.LINEAR_NONE
    //         })
    //       }, 1000)
    //     }
    //   })
    // }, 5000)
    // Cesium.when(document.createElement('canvas')).then(function (res) {
    //   console.info(res)
    // })
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
    sceneInfoService () {
      return this.$store.getters.getSceneInfoUrl
    },
    warningQueryService () {
      return this.$store.getters.getWarningQueryUrl
    },
    historyWarningQueryService () {
      return this.$store.getters.gethistoryWarningsUrl
    },
    // 获得的用户信息
    userinfo () {
      return this.$store.getters.getUser
    },
    warnings () {
      return this.$store.getters.getWarnings
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
        // vm.viewer.zoomTo(datasource)
        vm.entities = datasource.entities.values
        // vm.config.geocoder.updateArr(vm)
        for (var i = 0; i < vm.entities.length; i++) {
          var entity = vm.entities[i]
          var color = entity.properties.color.getValue(vm.viewer.clock.currentTime)
          entity.billboard = {
            image: 'static/webcam.png', // default: undefined
            show: true,
            color: Cesium.Color.fromCssColorString(color),
            scale: 1.0,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
          // entity.point = new Cesium.PointGraphics({
          //   disableDepthTestDistance: Number.POSITIVE_INFINITY,
          //   color: Cesium.Color.RED,
          //   pixelSize: 10
          // })
        }
      }).then(function () {
        // 添加html元素
        for (let i = 0; i < vm.entities.length; i++) {
          var entity = vm.entities[i]
          var span = document.createElement('span')
          span.id = entity.id
          span.textContent = entity.id
          span.style.position = 'absolute'
          span.className += ' ' + 'iez-point'
          document.body.appendChild(span)
        }
        vm.viewer.scene.preRender.addEventListener(function () {
          for (let i = 0; i < vm.entities.length; i++) {
            var entity = vm.entities[i]
            var position = entity.position.getValue(vm.viewer.clock.currentTime)
            var canvasPosition = vm.viewer.scene.cartesianToCanvasCoordinates(position)
            var span = document.getElementById(entity.id)
            if (Cesium.defined(canvasPosition)) {
              span.style.top = canvasPosition.y - 45 + 'px'
              span.style.left = canvasPosition.x - 10 + 'px'
            }
          }
        })
        vm.getHistoryWarning()
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
      vm.tileset = new Cesium.Cesium3DTileset({
        url: vm.modelTileService,
        maximumScreenSpaceError: isMobile.any() ? 8 : 1,
        maximumNumberOfLoadedTiles: isMobile.any() ? 10 : 500
      })
      // tileset.debugShowContentBoundingVolume=true
      vm.tileset.readyPromise.then(function (tileset) {
        vm.viewer.scene.primitives.add(tileset)
        vm.viewer.zoomTo(tileset)
      }).otherwise(function (err) {
        vm.$Message.error(`请求 模型服务失败: ${err}`)
        console.error(`请求 模型服务失败: ${err}`)
      })
      // // A b3dm tileset used to classify the photogrammetry tileset
      // var classificationTileset = new Cesium.Cesium3DTileset({
      //   url: 'static/tileset.json'
      //   ,
      //   classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
      // })
      // classificationTileset.style = new Cesium.Cesium3DTileStyle({
      //   color: 'rgba(255, 0, 0, 0.5)'
      // })
      // classificationTileset.readyPromise.then(function (tileset) {
      //   // tileset.show=true
      //   vm.viewer.scene.primitives.add(tileset)
      //   vm.viewer.zoomTo(tileset)
      // }).otherwise(function (err) {
      //   vm.$Message.error(`请求 模型服务失败: ${err}`)
      //   console.error(`请求 模型服务失败: ${err}`)
      // })
      // The same b3dm tileset used for classification, but rendered normally for comparison.
      // var nonClassificationTileset = new Cesium.Cesium3DTileset({
      //   url: 'static/tileset.json',
      //   show: true
      //   // ,
      //   //    classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
      // })
      // nonClassificationTileset.style = new Cesium.Cesium3DTileStyle({
      //   color: 'rgba(255, 0, 0, 0.5)'
      // })
      // vm.viewer.scene.primitives.add(nonClassificationTileset)
      // vm.viewer.zoomTo(nonClassificationTileset)
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
      var pinkid
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
              var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(8)
              var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(8)
              var heightString = cartographic.height.toFixed(2)
              vm.location = `经度：${longitudeString} 纬度：${latitudeString} 高度：${heightString}m`
            }

            var pickEntity = Cesium.defaultValue(pickedObject.id, pickedObject.primitive.id)
            if (pickEntity instanceof Cesium.Entity) {
              if (pinkid !== undefined) {
                var lastspan = document.getElementById(pinkid)
                lastspan.style.display = 'none'
              }
              pinkid = pickEntity.id
              var span = document.getElementById(pickEntity.id)
              span.style.display = 'block'
            } else {
              if (pinkid !== undefined) {
                var span1 = document.getElementById(pinkid)
                span1.style.display = 'none'
              }
            }
          } else {
            vm.location = ''
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    },
    // 页面初始化 获取历史报警信息
    getHistoryWarning: function () {
      var vm = this
      vm.$http.get(vm.historyWarningQueryService).then(function (res) {
        if (res.data.result === 0) {
          var historyWarnings = res.data.resultMess
          if (historyWarnings.length > 0) {
            vm.$root.eventBus.$emit('play')
          }
          for (var i = 0; i < historyWarnings.length; i++) {
            var hiswarn = historyWarnings[i]
            if (!vm.checkDup(hiswarn)) { // 根据devCode 去重
              vm.$store.commit('addWarning', hiswarn)
              vm.entityColorChange(hiswarn, true)
            }
          }
        }
      })
    },
    // warning 变色
    entityColorChange: function (warning, isWarning) {
      var vm = this
      vm.$http.get(vm.sceneInfoService, {params: {baojingID: warning.devCode}}).then(function (res) {
        if (res.data.result === '0') {
          var name = res.data.resultMess.name
          for (var i = 0; i < vm.entities.length; i++) {
            var entity = vm.entities[i]
            if (entity.name === name) {
              entity.billboard.color.setValue(isWarning ? Cesium.Color.RED : Cesium.Color.LIME)
              entity.billboard.scale.setValue(isWarning ? 1.5 : 1.0)
              break
            }
          }
        }
      })
    },
    // 报警重复检测
    checkDup: function (obj) {
      var vm = this
      var array = vm.warnings
      var value = obj.devCode
      for (var i = 0; i < array.length; i++) {
        if (obj) {
          if (array[i]) {
            var value1 = array[i].devCode
            if (value === value1) {
              return true
            }
          }
        }
      }
      return false
    },
    // 获取报警地址
    getWarningAddress: function () {
      var vm = this
      vm.$http.get(vm.warningQueryService).then(function (res) {
        if (res.data.result === 0) {
          vm.$store.commit('updateWarningServer', res.data.resultMess)
          vm.warningMonitoring()
        }
      })
    },
    // 报警监控
    warningMonitoring: function () {
      var vm = this
      var warning = io.connect(vm.$store.getters.getWarningUrl)
      warning.on('connect', function () {
        console.info(warning.id)
        // socket.emit('sendMessage', 'helloworld')
      })
      // 报警
      warning.on('date', function (data) {
        if (!vm.checkDup(data)) {
          vm.$store.commit('addWarning', data)
          vm.entityColorChange(data, true)
          this.$root.eventBus.$emit('message', {action: 'addWarning', target: data})
          this.$root.eventBus.$emit('play')
        }
      })
      var cancelWarning = io.connect(vm.$store.getters.getCancelWarning)
      warning.on('connect', function () {
        console.info(warning.id)
        // socket.emit('sendMessage', 'helloworld')
      })
      // 消除报警
      cancelWarning.on('date', function (data) {
        vm.$store.commit('removeWarning', data)
        vm.entityColorChange(data, false)
        this.$root.eventBus.$emit('message', {action: 'rmWarning', target: data})
      })
    },
    addtest: function (data) {
      var vm = this
      if (!vm.checkDup(data)) {
        vm.$store.commit('addWarning', data)
        vm.entityColorChange(data, true)
        this.$root.eventBus.$emit('message', {action: 'addWarning', target: data})
      }
    },
    removetest: function (data) {
      var vm = this
      vm.$store.commit('removeWarning', data)
      vm.entityColorChange(data, false)
      this.$root.eventBus.$emit('message', {action: 'rmWarning', target: data})
    }
  }
}
</script>
<style lang="less">
  @import '../widget/navi/styles/cesium-navigation';
</style>
<style>
  .iez-point{
  border-radius: 3px;
  position: absolute;
  font-size: 13px;
  display: none;
  background: black;
  opacity: 0.7;
  padding: 7px;
  outline: 3px #b6c0c3 solid;
  color: white;
  z-index: 99;
  }
</style>
