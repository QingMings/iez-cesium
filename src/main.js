/* eslint-disable no-unused-vars */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Cesium from 'cesium/Cesium'
import widgets from 'cesium/Widgets/widgets.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  mounted () {
    // var viewer = new Cesium.CesiumWidget('cesiumContainer')
    var config = {
      geocoder: false,
      timeline: false,
      navigationHelpButton: false,
      animation: false
    }
    var viewer = new Cesium.Viewer('cesiumContainer', config)
    viewer.scene.debugShowFramesPerSecond = true
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
  }
})
