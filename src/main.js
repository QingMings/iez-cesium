/* eslint-disable no-unused-vars */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Cesium from 'cesium/Cesium'
import 'cesium/Widgets/widgets.css'
import 'iview/dist/styles/iview.css'
import '../static/js/layer/theme/default/layer.css'
import { Message, Spin, Icon } from 'iview'

import $ from '../static/js/jquery-vendor'
import Layer from '../static/js/layer/layer'
import './assets/iez-layer.css'
import 'velocity-animate/velocity.min'
import axios from 'axios'
import Vuex from 'vuex'
import store from './vuex/store'

Vue.use(Vuex)
Vue.component('Icon', Icon)
Vue.config.productionTip = false
Vue.prototype.$Message = Message
Vue.prototype.$Spin = Spin
Vue.prototype.$layer = Layer
Vue.prototype.$http = axios

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>',
  data () {
    return {
      eventBus: new Vue()
    }
  },
  created () {},
  mounted () {
    // var viewer = new Cesium.CesiumWidget('cesiumContainer')
    var config = {
      geocoder: true,
      timeline: false,
      navigationHelpButton: false,
      animation: false,
      baseLayerPicker: false,
      sceneModePicker: false

      // ,
      // imageryProvider: new Cesium.WebMapServiceImageryProvider({
      //   url: 'http://192.168.2.136:8080/geoserver/nurc/wms',
      //   layers: 'nurc:Arc_Sample'
      // })
    }
    // 使相机默认朝向中国
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(73, 4, 135, 53)
    // var viewer = new Cesium.Viewer('cesiumContainer', config)
    // 显示帧率
    // viewer.scene.debugShowFramesPerSecond = true
    // Cesium.viewerCesiumNavigationMixin(viewer, {})
    // 禁止相机转动
    // viewer.scene.screenSpaceCameraController.enableRotate = false
    // viewer.scene.globe.enableLighting = true
    // $('#cesiumContainer').css({'background': 'blue'})
    // $('#cesiumContainer').velocity({
    //   top: 23,
    //   left: 33
    // })
    // wfs
    // var serviceUrl = '../static/tewt.geojson'
    // var datasource = viewer.dataSources.add(Cesium.GeoJsonDataSource.load(serviceUrl, {
    //   stroke: Cesium.Color.BLACK,
    //   fill: Cesium.Color.RED,
    //   strokeWidth: 3,
    //   markerSymbol: '?'
    // }))`
    // viewer.flyTo(datasource)
    // 使球自转
    // var lastNow = Date.now()
    // viewer.clock.onTick.addEventListener(clock => {
    //   var now = Date.now()
    //   var splitRate = 0.5
    //   var delta = (now - lastNow) / 1000
    //   lastNow = now
    //   viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, splitRate * delta)
    // })
    // var wyoming = viewer.entities.add({
    //   name: 'Wyoming',
    //   polygon: {
    //     hierarchy: Cesium.Cartesian3.fromDegreesArray([
    //       -109.080842, 45.002073,
    //       -105.91517, 45.002073,
    //       -104.058488, 44.996596,
    //       -104.053011, 43.002989,
    //       -104.053011, 41.003906,
    //       -105.728954, 40.998429,
    //       -107.919731, 41.003906,
    //       -109.04798, 40.998429,
    //       -111.047063, 40.998429,
    //       -111.047063, 42.000709,
    //       -111.047063, 44.476286,
    //       -111.05254, 45.002073
    //     ]),
    //     height: 0,
    //     // material: Cesium.Color.RED.withAlpha(0.5),
    //     material: new Cesium.GridMaterialProperty({
    //       color: Cesium.Color.YELLOW,
    //       cellAlpha: 0.2,
    //       lineCount: new Cesium.Cartesian2(8, 8),
    //       lineThickness: new Cesium.Cartesian2(2.0, 2.0)
    //     }),
    //     outline: true,
    //     outlineColor: Cesium.Color.BLACK
    //   }
    // })
    // var line = viewer.entities.add({
    //   name: '我是一条直线',
    //   description: '<img src="//cesiumjs.org/images/2015/02-02/Flag_of_Wyoming.svg" width="50%"  style="float:left;margin: 0 1em 1em 0;" alt="直线">' +
    //   '<p>Wyoming is the 10th most extensive, but the least populous \\\n' +
    //   '  and the second least densely populated of the 50 United \\\n' +
    //   '  States. The western two thirds of the state is covered mostly \\\n' +
    //   '  with the mountain ranges and rangelands in the foothills of \\\n' +
    //   '  the eastern Rocky Mountains, while the eastern third of the \\\n' +
    //   '  state is high elevation prairie known as the High Plains. \\\n' +
    //   '  Cheyenne is the capital and the most populous city in Wyoming, \\\n' +
    //   '  with a population estimate of 62,448 in 2013.\\</p>' +
    //   '<p>这是一条直线</p>' +
    //   '<p>从-77，35到-77.1,35</p>',
    //   polyline: {
    //     positions: Cesium.Cartesian3.fromDegreesArray([-77, 35, -77.1, 35]),
    //     width: 5,
    //     // material: Cesium.Color.RED
    //     material: new Cesium.PolylineGlowMaterialProperty({
    //       glowPower: 0.2,
    //       color: Cesium.Color.RED
    //     })
    //   }
    // })
    // var billboard = viewer.entities.add({
    //   name: 'happyBirthday',
    //   billboard: {
    //     image: 'static/happyBirthday.jpg',
    //     width: 64,
    //     height: 64
    //   }
    // })
    // viewer.zoomTo(billboard)
    // 添加一个立方体
    // var redBox = viewer.entities.add({
    //   name: 'red cube',
    //   position: Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 30000.0),
    //   box: {
    //     dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
    //     material: Cesium.Color.RED.withAlpha(0.5),
    //     outline: true,
    //     outlineColor: Cesium.Color.BLACK
    //   }
    // })
    // viewer.zoomTo(redBox)
    // 动态攻击的一种实现方式
    // function addBezier(pointA, pointB, height, num) {
    //   var earth = Cesium.Ellipsoid.WGS84;
    //   var startPoint = earth.cartographicToCartesian(Cesium.Cartographic.fromDegrees(parseFloat(pointA[0]), parseFloat(pointA[1]), 0.0));
    //   var endPoint = earth.cartographicToCartesian(Cesium.Cartographic.fromDegrees(parseFloat(pointB[0]), parseFloat(pointB[1]), 0.0));
    //   var addCartesian = startPoint.clone();
    //   Cesium.Cartesian3.add(startPoint, endPoint, addCartesian);
    //   var midpointCartesian = addCartesian.clone();
    //   Cesium.Cartesian3.divideByScalar(addCartesian, 2, midpointCartesian);
    //   earth.scaleToGeodeticSurface(midpointCartesian);
    //   var midpointCartographic = earth.cartesianToCartographic(midpointCartesian);
    //   midpointCartographic.height = height;
    //   midpointCartesian = earth.cartographicToCartesian(midpointCartographic);
    //   var spline = new Cesium.CatmullRomSpline({
    //     times: [0.0, 0.5, 1.0],
    //     points: [
    //       startPoint,
    //       midpointCartesian,
    //       endPoint
    //     ],
    //   });
    //   var polylinePoints = [];
    //   for (var ii = 0; ii < num; ++ii) {
    //     polylinePoints.push(spline.evaluate(ii / num));
    //   }
    //   return polylinePoints;
    // }
    // 加载 czml
    // var czml = [
    //   {
    //     'id': 'document',
    //     'name': 'CZML Point - Time Dynamic',
    //     'version': '1.0'
    //   },
    //   {
    //     'id': 'dongchengqu',
    //     'name': '东城区AQI',
    //     'availability': '2016-01-01T00:00:00Z/2016-01-02T00:00:00Z',
    //     'polygon': {
    //       'positions': {
    //         'cartographicDegrees':
    //           [116.4436, 39.8728, 0, 116.443, 39.8719, 0, 116.4269, 39.8727, 0, 116.422, 39.8724, 0, 116.4169, 39.8715, 0, 116.4158, 39.8694, 0, 116.4152, 39.8671, 0, 116.4158, 39.8658, 0, 116.4144, 39.8637, 0, 116.4125, 39.8589, 0, 116.4042, 39.8597, 0, 116.3955, 39.8587, 0, 116.395, 39.8621, 0, 116.3943, 39.8626, 0, 116.3923, 39.8637, 0, 116.3879, 39.866, 0, 116.3853, 39.8671, 0, 116.3807, 39.8661, 0, 116.3777, 39.8667, 0, 116.3787, 39.867, 0, 116.3796, 39.868, 0, 116.3848, 39.8715, 0, 116.3985, 39.8802, 0, 116.3981, 39.891, 0, 116.3976, 39.8987, 0, 116.3961, 39.8994, 0, 116.3956, 39.908, 0, 116.3918, 39.9112, 0, 116.3921, 39.9129, 0, 116.3968, 39.9235, 0, 116.3967, 39.9283, 0, 116.3942, 39.9443, 0, 116.3877, 39.9609, 0, 116.3987, 39.9626, 0, 116.4014, 39.9624, 0, 116.4055, 39.9619, 0, 116.4077, 39.9666, 0, 116.4074, 39.9697, 0, 116.4076, 39.9714, 0, 116.4088, 39.9725, 0, 116.4122, 39.9638, 0, 116.4254, 39.9592, 0, 116.429, 39.9573, 0, 116.429, 39.9543, 0, 116.43, 39.9519, 0, 116.4299, 39.951, 0, 116.4295, 39.9502, 0, 116.434, 39.9499, 0, 116.4348, 39.949, 0, 116.4368, 39.9497, 0, 116.4354, 39.9521, 0, 116.4393, 39.9512, 0, 116.4422, 39.9491, 0, 116.4407, 39.9471, 0, 116.4393, 39.9471, 0, 116.4394, 39.9461, 0, 116.4411, 39.9451, 0, 116.442, 39.9451, 0, 116.4426, 39.9457, 0, 116.4447, 39.9462, 0, 116.4469, 39.9457, 0, 116.4472, 39.9449, 0, 116.4464, 39.9427, 0, 116.4449, 39.9418, 0, 116.4445, 39.9392, 0, 116.4437, 39.9367, 0, 116.439, 39.9286, 0, 116.4375, 39.9286, 0, 116.4347, 39.9212, 0, 116.4351, 39.9134, 0, 116.4358, 39.9068, 0, 116.4365, 39.902, 0, 116.438, 39.9026, 0, 116.4416, 39.903, 0, 116.4461, 39.9032, 0, 116.448, 39.9012, 0, 116.4468, 39.8981, 0, 116.4509, 39.8929, 0, 116.4504, 39.8902, 0, 116.4474, 39.8912, 0, 116.4441, 39.89, 0, 116.4456, 39.8789, 0, 116.4443, 39.8758, 0]
    //       },
    //       'material': {
    //         'solidColor': {
    //           'color': {
    //             'epoch': '2016-01-01T00:00:00Z',
    //             'rgba': [
    //               0, 255, 255, 0, 255,
    //               36000, 255, 126, 0, 255,
    //               72000, 255, 0, 0, 255,
    //               86400, 153, 0, 76, 255
    //             ]
    //
    //           }}
    //       },
    //       'perPositionHeight': false,
    //
    //       'extrudedHeight': {
    //         'epoch': '2016-01-01T00:00:00Z',
    //         'number': [
    //           0, 1000,
    //           10800, 1255,
    //           21600, 1430,
    //           43200, 1580,
    //           86400, 2350]
    //       }
    //     }
    //   }
    // ]
    //
    // var dataSource = Cesium.CzmlDataSource.load(czml)
    // viewer.dataSources.add(dataSource)
    // viewer.flyTo(dataSource)
    // 自定义一个czml 第一个包写明文档，
    // var czml = [
    //   {
    //     'id': 'document',
    //     'name': 'CZML Point - Time Dynamic',
    //     'version': '1.0'
    //   },
    //   {
    //     'id': 'test',
    //     'position': {'cartographicDegrees': [116.23, 35.54, 0.0]},
    //     'point': {'color': {'rgba': [0, 0, 255, 255]}}
    //   }]
    //
    // var dataSource = Cesium.CzmlDataSource.load(czml)
    // viewer.dataSources.add(dataSource)
    // viewer.flyTo(dataSource)

    // var tileset = new Cesium.Cesium3DTileset({
    //   url: './static/data/gz.json'
    // })
    // tileset.readyPromise.then(function (tileset) {
    //   viewer.scene.primitives.add(tileset)
    //   viewer.zoomTo(tileset)
    // })
  }
})
