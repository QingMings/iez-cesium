/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import cesiumViewer from '@/components/cesiumViewer'
import proxy from '@/components/Proxy'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'cesiumViewer',
      component: cesiumViewer
    },
    {
      path: '/proxy',
      name: 'Proxy',
      component: proxy
    }
  ]
})
