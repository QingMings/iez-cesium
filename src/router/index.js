/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import cesiumViewer from '@/components/cesiumViewer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'cesiumViewer',
      component: cesiumViewer
    }
  ]
})
