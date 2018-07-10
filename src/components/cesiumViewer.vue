<template>
    <div id="cesiumContainer">
      <!--<tool-bar></tool-bar>-->
      <Warn></Warn>
      <panorama-view></panorama-view>
      <CesiumToolBarExtend/>
      <LocationBox  :location-info="location"></LocationBox>
      <SoundWarning></SoundWarning>
      <DeviceDataWidget :url="iframeUrl" :region-name="iframeTitle" :show="dataShow" :click-show="clickDataShow"></DeviceDataWidget>
      <!--<Logo></Logo>-->
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
import Icon from '../../node_modules/iview/src/components/icon/icon.vue'
import viewerCesiumNavigationMixin from '../widget/navi/viewerCesiumNavigationMixin'
import $ from '../../static/js/jquery-vendor'
// import CreatePolygon from '../utils/CreatePolygon'
import DrConf from '../utils/DrConf'
import Warn from './Warn'
import Logo from './Logo'
import iutil from '../utils/iviewUtils'
import log from '../utils/Log'
import DeviceDataWidget from './DeviceDataWidget'
/* eslint-disable no-unused-vars */

export default {
  components: {
    DeviceDataWidget,
    Logo,
    Warn,
    Icon,
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
        navigationHelpButton: true,
        animation: false,
        homeButton: true,
        infoBox: false,
        baseLayerPicker: false,
        sceneModePicker: false
        // ,
        // imageryProvider: Cesium.createTileMapServiceImageryProvider({
        //   url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        // })
        // ,
        // skyBox: new Cesium.SkyBox({
        //   sources: {
        //     positiveX: 'static/negx.jpg',
        //     negativeX: 'static/posx.jpg',
        //     positiveY: 'static/negy.jpg',
        //     negativeY: 'static/posy.jpg',
        //     positiveZ: 'static/negz.jpg',
        //     negativeZ: 'static/posz.jpg'
        //   }
        // })
      },
      viewer: undefined,
      entities: undefined,
      location: undefined,
      tileset: undefined,
      hotPointDataSource: undefined,
      buildDataSource: undefined,
      regionDataSource: undefined,
      regionIndex: 0,
      highlighted: {
        feature: undefined,
        originalColor: Cesium.Color.RED.withAlpha(DrConf.buildAlpha)
      },
      dataShow: false,
      clickDataShow: false,
      iframeUrl: '',
      iframeTitle: '',
      defaultResetView: Cesium.Rectangle.fromDegrees(118.8345, 38.143973, 118.83815627, 38.14106426)
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
    if (this.autoInspectionTimer) {
      clearTimeout(this.autoInspectionTimer)
    }
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
    viewerCesiumNavigationMixin(this.viewer, {
      defaultResetView: vm.defaultResetView
    })
    // this.viewer.scene.debugShowFramesPerSecond = true
    // this.viewer.scene.debugShowContentBoundingVolume = true
    this.handleSpinCustom()
    this.removeDefaultEvent()
    this.load3dTiles()
    this.loadGeojson()
    this.loadBuildingGeojson()
    this.showHight()
    this.showdeviceData()
    this.entityPick()
    this.getWarningAddress()
    // this.limitCameraHeight(50)
    this.limitCameraHeight2()
    // this.viewer.clock.onTick.addEventListener(function () {
    //   console.log([vm.viewer.camera.up.x,vm.viewer.camera.up.y,vm.viewer.camera.up.z])
    // })
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
    // var layers = vm.viewer.imageryLayers
    // var shliyt_dom = layers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
    //   url: 'http://192.168.2.114:8084/360hot/tms',
    //   credit: '胜利油田'
    // }))
  },
  computed: {
    geojsonService () {
      return this.$store.getters.getGeoJsonServiceUrl
    },
    getBuildGeojsonService () {
      return this.$store.getters.getBuildGeoJsonServiceUrl
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
    },
    hotPointStatus () {
      return this.$store.getters.getHotPointStatus
    },
    groupStatus () {
      return this.$store.getters.getGroupMarkStatus
    },
    buildStatus () {
      return this.$store.getters.getBuildMarkStatus
    },
    autoInspectionTimer () {
      return this.$store.getters.getAutoInspectionTimer
    },
    // 自动巡检按钮设置是否开启
    autoInspection () {
      return this.$store.getters.getAutoInspectionStatus
    },
    // 自动巡检按钮功能是否具备开启条件，不具备则按钮被禁用
    autoInspectionLoadstatus () {
      return this.$store.getters.getAutoInspectionLoadstatus
    },
    autoInspectionInterval () {
      return this.$store.getters.getAutoInspectionInterval
    },
    areaInspectionService () {
      return this.$store.getters.getAreaInspectionUrl
    },
    cameraFollow () {
      return this.$store.getters.getCameraFollowStatus
    },
    logInsertService () {
      return this.$store.getters.getLogInsertUrl
    }
  },
  watch: {
    // settings 设置监听
    hotPointStatus (val, oldVal) {
      this.hotPointDataSource.show = val
    },
    groupStatus (val, oldVal) {
      this.regionDataSource.show = val
      // 关闭分区 同事关闭 自动巡检
      if (val === false) {
        this.$store.commit('autoInspection', false)
      }
    },
    buildStatus (val, oldVal) {
      this.buildDataSource.show = val
      // if (val === false) {
      //   this.$store.commit('autoInspection', false)
      // }
    },
    // 开启关闭自动巡检监控
    autoInspection (val, oldVal) {
      // console.info(`autoInspection  oldvalue ${oldVal} , val ${val}`)
      this.enableAutoInspection(val)
      if (!this.groupStatus) {
        if (val) {
          setTimeout(() => {
            this.$store.commit('autoInspection', false)
          }, 1000)
          this.$Message.info(iutil.info('开启自动巡检需要开启分区标注'))
        }
      }
    },
    // autoInspectionTimer (val, oldval) {
    //   clearTimeout(oldval)
    // },
    autoInspectionLoadstatus (val, oldval) {
      // console.info(`QQQ${val}`)
      // 资源正常加载完毕
      if (val) {
        // 默认自动巡检按钮是否启用
        if (this.autoInspection) {
          if (this.autoInspectionTimer) {
            clearTimeout(this.autoInspectionTimer)
          }
          setTimeout(() => {
            if (this.autoInspection) {
              this.enableAutoInspection(val)
            }
          }, 5000)
        }
      }
    },
    cameraFollow (val, oldval) {
      var vm = this
      if (val === false) {
        vm.viewReset()
      }
    }
  },
  methods: {
    limitCameraHeight: function (height) {
      var vm = this
      var camera = vm.viewer.camera
      var postRenderEventListener = vm.viewer.scene.postRender.addEventListener(() => {
        if (camera._positionCartographic.height <= height) {
          console.info(`height: ${camera._positionCartographic.height}`)
          console.info(`camera`)
          var ellipsoid = vm.viewer.scene.globe.ellipsoid
          var cartesianPosition = ellipsoid.cartesianToCartographic(camera.position)
          var Cartesian3 = ellipsoid.cartographicToCartesian(new Cesium.Cartographic(cartesianPosition.longitude, cartesianPosition.latitude, height))
          vm.viewer.camera.setView({
            destination: Cartesian3,
            orientation: {
              heading: camera.heading,
              pitch: camera.pitch,
              roll: camera.roll
            }
          })
        }
      })
      return postRenderEventListener
    },
    limitCameraHeight2: function () {
      var vm = this
      vm.viewer.scene.screenSpaceCameraController.minimumZoomDistance=100
      vm.viewer.clock.onTick.addEventListener(function () {
        setMinCamera()
      })
      var setMinCamera = function () {
        if (vm.viewer.camera.pitch > 0) {
          vm.viewer.scene.screenSpaceCameraController.enableTilt = false
        }
      }
      var startMousePosition
      var mousePosition
      var handler = new Cesium.ScreenSpaceEventHandler(vm.viewer.scene.canvas)
      handler.setInputAction(function (movement) {
        mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position)
        handler.setInputAction(function (movement) {
          mousePosition = movement.endPosition
          var y = mousePosition.y - startMousePosition.y
          if (y > 0) {
            vm.viewer.scene.screenSpaceCameraController.enableTilt = true
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN)

      handler.setInputAction(function (movement) {
        handler.setInputAction(function (movement) {

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      }, Cesium.ScreenSpaceEventType.MIDDLE_UP)
    },
    viewReset () {
      var vm = this
      vm.viewer.camera.flyTo({
        destination: vm.defaultResetView,
        orientation: {
          heading: Cesium.Math.toRadians(5.729578)
        }
      })
    },
    // 显示 loading 加载 3s后消失
    handleSpinCustom () {
      this.$Spin.show({
        render: (h) => {
          return h('div', [
            h('icon', {
              'class': 'demo-spin-icon-load',
              props: {
                type: 'load-c',
                size: 18
              }
            }),
            h('div', 'Loading')
          ])
        }
      })
      setTimeout(() => {
        this.$Spin.hide()
      }, 3000)
    },
    enableAutoInspection: function (isEnabled) {
      var vm = this
      // console.info(`哈哈哈哈：${isEnabled}`)
      if (isEnabled) {
        vm.startAntoInspection()
        vm.hideClickData()
        vm.hideDeviceData()
        vm.showDeviceData()
      } else {
        vm.stopAutoInspection()
        vm.hideDeviceData()
      }
    },
    startAntoInspection: function () {
      var vm = this
      // console.info(vm.autoInspectionLoadstatus)
      if (vm.autoInspectionLoadstatus) {
        if (vm.regionDataSource !== undefined) {
          var regionLength = vm.regionDataSource.entities.values.length - 1
          vm.entityHighlightedReset()
          // 更新巡检区域Index
          if (vm.regionIndex >= 0 && vm.regionIndex < regionLength) {
            vm.regionIndex += 1
            // console.info(vm.regionIndex)
          } else {
            vm.regionIndex = 0
            // console.info(vm.regionIndex)
          }
          //

          // console.info(`||||${vm.regionIndex}`)
          var entity = vm.regionDataSource.entities.values[vm.regionIndex]
          // todo 打包时候放开
          // vm.iframeUrl = `${vm.areaInspectionService}?areaId=${entity.properties.areaId.getValue(vm.viewer.clock.currentTime)}`
          vm.iframeUrl = `${vm.areaInspectionService}?areaId=${vm.regionIndex}`
          vm.iframeTitle = entity.name
          vm.entityHighlighted(entity)
          if (vm.cameraFollow) {
            vm.viewer.flyTo(entity)
          }
          // 日志上报
          log.report(vm.logInsertService, {
            userCode: vm.userinfo.userCode,
            devCode: '',
            operation: '自动巡检',
            operationContent: entity.name,
            remarks: ''
          })
          // 控制自动巡检
          vm.$store.commit('updateAutoInspectionTimer', setTimeout(() => {
            if (vm.autoInspection && vm.groupStatus) {
              vm.startAntoInspection()
            } else {
              this.$store.commit('autoInspection', false)
            }
          }, vm.autoInspectionInterval))
        }
      }
    },
    stopAutoInspection: function () {
      var vm = this
      if (this.autoInspectionTimer) {
        vm.entityHighlightedReset()
        clearTimeout(this.autoInspectionTimer)
      }
    },
    showDeviceData: function () {
      this.dataShow = true
    },
    hideDeviceData: function () {
      // console.info('hideDeviceData')
      this.dataShow = false
    },
    showClickData: function () {
      this.clickDataShow = true
    },
    hideClickData: function () {
      this.clickDataShow = false
    },
    updateIframeSrc: function (url) {
      var vm = this
      vm.iframeUrl = url
    },
    // 加载geojson数据
    loadGeojson: function () {
      var vm = this
      var serviceUrl = vm.geojsonService
      var datasource1 = new Cesium.GeoJsonDataSource()
      var features = datasource1.load(serviceUrl)
      features.then(function (datasource) {
        vm.viewer.dataSources.add(datasource)
        vm.hotPointDataSource = datasource
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
        // 报告hotpoint 加载完毕
        vm.$store.commit('updateHotPointComplete', true)
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
        vm.$Message.error(iutil.err(`请求 GeoJson服务失败: ${err}`))
        console.error(`请求 GeoJson服务失败: ${err}`)
      })
    },
    loadBuildingGeojson: function () {
      var vm = this
      var buildServiceUrl = vm.getBuildGeojsonService + '?objType=0'

      var datasource1 = new Cesium.CustomDataSource('buildPolygon')
      vm.$http.get(buildServiceUrl).then(function (res) {
        // console.info(res.data)
        if (res.data) {
          vm.viewer.dataSources.add(datasource1)
          vm.buildDataSource = datasource1;
          [].forEach.call(res.data, function (polygon) {
            vm.createPolygon(polygon, DrConf.buildAlpha)
          })
          if (res.data.length > 0) {
            // 报告 buildData加载完成
            vm.$store.commit('updateBuildingDataComplete', true)
          }
        }
      }).catch(error => {
        vm.$Message.error(iutil.err(`请求 建筑数据服务失败: ${error}`))
        console.error(error)
      })
      var regionServiceUrl = vm.getBuildGeojsonService + '?objType=2'
      var datasource2 = new Cesium.CustomDataSource('regionPolygon')
      vm.$http.get(regionServiceUrl).then(function (res) {
        // console.info(res.data)
        if (res.data) {
          vm.viewer.dataSources.add(datasource2)
          vm.regionDataSource = datasource2;
          [].forEach.call(res.data, function (polygon) {
            vm.createPolygon(polygon, DrConf.buildAlpha)
          })
          if (res.data.length > 0) {
            // 报告 RegionData加载完成
            vm.$store.commit('updateRegionDataComplete', true)
          }
        }
      }).catch(error => {
        vm.$Message.error(iutil.err(`请求 区域数据服务失败: ${error}`))
        console.error(error)
      })
    },
    // loadbuildPrimitives: function () {
    //   var vm = this
    //   var serviceUrl = vm.getBuildGeojsonService
    //   var datasource1 = new Cesium.GroundPrimitive()
    //   vm.$http.get(serviceUrl).then(function (res) {
    //     // console.info(res.data)
    //     if (res.data) {
    //       vm.viewer.scene.primitives.add(datasource1);
    //       // vm.buildDataSource = datasource1;
    //       [].forEach.call(res.data, function (polygon) {
    //         vm.createPolygon(polygon)
    //       })
    //     }
    //   })
    // },
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
        // 设置 HeadingPitchRange  为上帝视角
        var boundingSphere = tileset.boundingSphere

        // vm.viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(heading, -1.7, tileset.boundingSphere.radius * 1.7))
        // 调整角度
        var heading = Cesium.Math.toRadians(5.729578)
        var patch = Cesium.Math.toRadians(-89.8)
        // console.info(patch)
        vm.viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(heading, patch, boundingSphere.radius * 1.7))
        // vm.viewReset()
        // vm.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
      }).otherwise(function (err) {
        vm.$Message.error(iutil.err(`请求 模型服务失败: ${err}`))
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
      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
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
      // HTML overlay for showing feature name on mouseover
      var nameOverlay = document.createElement('div')
      vm.viewer.container.appendChild(nameOverlay)
      nameOverlay.className = 'backdrop'
      nameOverlay.style.display = 'none'
      nameOverlay.style.position = 'absolute'
      nameOverlay.style.bottom = '0'
      nameOverlay.style.left = '0'
      nameOverlay.style['pointer-events'] = 'none'
      nameOverlay.style.padding = '4px'
      nameOverlay.style.backgroundColor = 'green'
      nameOverlay.style.color = 'white'
      // 选中的实体
      var selected = {
        feature: undefined,
        originalColor: new Cesium.Color()
      }
      // 高亮的实体
      // var highlighted = {
      //   feature: undefined,
      //   originalColor: Cesium.Color.RED.withAlpha(DrConf.buildAlpha)
      // }
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
            // console.info('12')
            // 鼠标悬浮在 全景点上
            if (pickEntity instanceof Cesium.Entity && pickEntity.billboard) {
              if (pinkid !== undefined) {
                var lastspan = document.getElementById(pinkid)
                lastspan.style.display = 'none'
              }
              pinkid = pickEntity.id
              var span = document.getElementById(pickEntity.id)
              span.style.display = 'block'
              // console.info('悬浮')
            } else if (pickEntity instanceof Cesium.Entity && pickEntity.polygon) {
              // 鼠标悬浮在建筑或区域标注上
              // console.info('13')

              vm.entityHighlightedReset()
              if (!Cesium.defined(pickEntity)) {
                nameOverlay.style.display = 'none'
                return
              }

              // A feature was picked, so show it's overlay content
              nameOverlay.style.display = 'block'
              nameOverlay.style.bottom = vm.viewer.canvas.clientHeight - movement.endPosition.y + 'px'
              nameOverlay.style.left = movement.endPosition.x + 'px'
              var name = pickEntity.name
              if (!Cesium.defined(name)) {
                name = pickEntity.id
              }
              nameOverlay.textContent = name
              if (pickEntity !== selected.feature) {
                vm.entityHighlighted(pickEntity)
              }
            } else {
              // console.info('14')
              if (pinkid !== undefined) {
                var span1 = document.getElementById(pinkid)
                span1.style.display = 'none'
                nameOverlay.style.display = 'none'
              }
            }
          } else {
            vm.location = ''
            nameOverlay.style.display = 'none'
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    },
    showdeviceData: function () {
      var vm = this
      var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
      handler.setInputAction(function (leftclick) {
        var scene = vm.viewer.scene
        if (scene.mode !== Cesium.SceneMode.MORPHING) {
          var pickedObject = scene.pick(leftclick.position)
          if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
            var cartesian = vm.viewer.scene.pickPosition(leftclick.position)
            if (Cesium.defined(cartesian)) {
              var pickEntity = Cesium.defaultValue(pickedObject.id, pickedObject.primitive.id)
              if (pickEntity instanceof Cesium.Entity && pickEntity.polygon) {
                // 停止自动巡检
                // console.info(vm.$store.getters.getAutoInspectionStatus)
                vm.$store.commit('autoInspection', false)
                // console.info(vm.$store.getters.getAutoInspectionStatus)
                //
                vm.entityHighlightedReset()
                vm.entityHighlighted(pickEntity)
                // vm.iframeUrl = `${vm.areaInspectionService}?areaId=${entity.properties.areaId.getValue(vm.viewer.clock.currentTime)}`

                // vm.hideDeviceData()
                vm.showClickData()
                // 建筑
                // todo 打包时候放开
                // if (pickEntity.properties.type.getValue(vm.viewer.clock.currentTime) === 0) {
                //   vm.iframeUrl = `${vm.areaInspectionService}?areaId=${pickEntity.properties.areaId.getValue(vm.viewer.clock.currentTime)}&potId=${pickEntity.properties.potId.getValue(vm.viewer.clock.currentTime)}`
                // } else {
                //   vm.iframeUrl = `${vm.areaInspectionService}?areaId=${pickEntity.properties.areaId.getValue(vm.viewer.clock.currentTime)}`
                // }
                if (pickEntity.properties.type.getValue(vm.viewer.clock.currentTime) === 0) {
                  vm.iframeUrl = `${vm.areaInspectionService}?areaId=${Math.random()}&potId=${Math.random()}`
                } else {
                  vm.iframeUrl = `${vm.areaInspectionService}?areaId=${Math.random()}`
                }
                // 日志上报
                log.report(vm.logInsertService, {
                  userCode: vm.userinfo.userCode,
                  devCode: '',
                  operation: '手动巡检',
                  operationContent: pickEntity.name,
                  remarks: ''
                })
                // vm.iframeUrl = `${vm.areaInspectionService}?areaId=${Math.random()}`
                vm.iframeTitle = pickEntity.name
              }
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    entityHighlightedReset: function () {
      var vm = this
      if (Cesium.defined(vm.highlighted.feature)) {
        // 还原上次被高亮的区域
        vm.highlighted.feature.polygon.material.color = vm.highlighted.originalColor
        vm.highlighted.feature = undefined
      }
    },
    entityHighlighted: function (entity) {
      var vm = this
      vm.highlighted.feature = entity
      Cesium.Color.clone(entity.polygon.material.color.getValue(vm.viewer.clock.currentTime), vm.highlighted.originalColor)
      entity.polygon.material.color.setValue(Cesium.Color.YELLOW.withAlpha(DrConf.entityAlpha))
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
    },
    createPolygon: function (json, alpha) {
      var vm = this
      var polyJsonStr
      var entityName
      var entityId
      var polyPtArr = []
      var polyPtCartArr = []
      var polyCartPt
      var polygontmp
      var wyoming
      // console.log('json=', json)
      if ((json === null)) {
        return
      }
      polyJsonStr = json.polyJson
      entityName = json.name
      entityId = json.guid
      // console.log('polyJsonStr=', polyJsonStr)
      polyPtArr = JSON.parse(polyJsonStr)
      // console.log('polyPtArr=', polyPtArr)
      for (var i = 0; i < polyPtArr.length; i++) {
        polyCartPt = Cesium.Cartesian3.fromElements(polyPtArr[i].x, polyPtArr[i].y, polyPtArr[i].z)
        polyPtCartArr.push(polyCartPt)
      }
      // console.log('polyPtCartArr=', polyPtCartArr)
      if (json.objType === 2) {
        wyoming = vm.regionDataSource.entities.add({
          name: entityName,
          id: entityId,
          polygon: {
            hierarchy: polyPtCartArr,
            material: Cesium.Color.RED.withAlpha(alpha) // 材质
            // outline: DrConf.entityOutline, // 是否显示轮廓
            // outlineColor: DrConf.entityOutlineColor, // 轮廓的颜色
            // classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
          },
          properties: {
            type: json.objType
            // todo 打包时候放开
            // ,
            // areaId: json.areaId
          }
        })
      } else {
        wyoming = vm.buildDataSource.entities.add({
          name: entityName,
          id: entityId,
          polygon: {
            hierarchy: polyPtCartArr,
            material: Cesium.Color.RED.withAlpha(alpha) // 材质
            // outline: DrConf.entityOutline, // 是否显示轮廓
            // outlineColor: DrConf.entityOutlineColor, // 轮廓的颜色
            // classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
          },
          properties: {
            type: json.objType
            // todo 打包时候放开
            // ,
            // areaId: json.areaId,
            // potId: json.potId
          }
        })
      }
      // var buildingHighlight = vm.viewer.scene.primitives.add(new Cesium.ClassificationPrimitive({
      //   geometryInstances: new Cesium.GeometryInstance({
      //     geometry: new Cesium.PolygonGeometry({
      //       polygonHierarchy: new Cesium.PolygonHierarchy(polyPtCartArr),
      //       extrudedHeight: 300
      //     }),
      //     // modelMatrix: modelMatrix,
      //     attributes: {
      //       color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5)),
      //       show: new Cesium.ShowGeometryInstanceAttribute(true)
      //     },
      //     id: 'volume'
      //   }),
      //   classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
      // }))
      var height = Number(json.offsetHeight)
      var exheight = Number(json.extrudeHeight)
      var objtypetmp = Number(json.objType)

      if (json.objType === 2) {
        // 离地高度
        wyoming.polygon.height = height
        // 两个高度差组成了它的体积
        wyoming.polygon.extrudedHeight = exheight
      }
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
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
