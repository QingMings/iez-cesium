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
    this.load3dTiles()
    this.loadGeojson()
    this.showHight()
  },
  methods: {
    loadGeojson: function () {
      var vm = this
      var serviceUrl = '../static/fenqu.geojson'
      var datasource1 = new Cesium.GeoJsonDataSource()
      var features = datasource1.load(serviceUrl)
      features.then(function (datasource) {
        vm.viewer.dataSources.add(datasource)
        vm.viewer.zoomTo(datasource)
        vm.entities = datasource.entities.values
        for (var i = 0; i < vm.entities.length; i++) {
          var entity = vm.entities[i]
          entity.billboard = undefined
          console.info(entity.position)
          entity.point = new Cesium.PointGraphics({
            color: Cesium.Color.RED,
            pixelSize: 10
          })
        }
      })
    },
    load3dTiles: function () {
      var vm = this
      var tileset = new Cesium.Cesium3DTileset({
        url: './static/data/Scene/Cesium_3D.json'
      })
      tileset.readyPromise.then(function (tileset) {
        vm.viewer.scene.primitives.add(tileset)
        vm.viewer.zoomTo(tileset)
      })
    },
    getheight: function (target) {
      var vm = this
      var scene = vm.viewer.scene
      // var pickedObject = scene.pick(vm.entities[0].position)
      // if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
      //   var cartesian = vm.viewer.scene.pickPosition(vm.entities[0].position)
      //   console.info(cartesian)
      //   if (Cesium.defined(cartesian)) {
      var cartographic = Cesium.Cartographic.fromCartesian(vm.entities[0].position)
      console.info(cartographic)
      var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2)
      var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2)
      var heightString = cartographic.height.toFixed(2)
      //
      // labelEntity.position = cartesian
      // labelEntity.label.show = true
      // labelEntity.label.text =
      //   'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
      //   '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0' +
      //   '\nAlt: ' + ('   ' + heightString).slice(-7) + 'm'
      console.info('Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
        '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0' +
        '\nAlt: ' + ('   ' + heightString).slice(-7) + 'm')

      // labelEntity.label.eyeOffset = new Cesium.Cartesian3(0.0, 0.0, -cartographic.height * (scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0))

      // foundPosition = true
      // }
      // }
    },
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
            console.info(cartesian)
            if (Cesium.defined(cartesian)) {
              var cartographic = Cesium.Cartographic.fromCartesian(cartesian)
              console.info(cartographic)
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
