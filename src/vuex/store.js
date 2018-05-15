import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    author: 'Wise Wrong',
    url: 'http://localhost:8084/360hot/senceServlet?',
    panoramaUrl: {
      Name: '',
      sence_id: '',
      senceitems_id: '',
      group_id: ''
    } // 服务地址
  },
  mutations: {
    // 更新服务地址
    updatePanoramaUrl (state, url) {
      state.panoramaUrl = url
    }
  },
  getters: {
    // 获取服务地址
    getPanoramaUrl: (state) => {
      return `${state.url}dnid=${state.panoramaUrl.sence_id}&NAME=${state.panoramaUrl.Name}&senceitems_id=${state.panoramaUrl.senceitems_id}&group_id=${state.panoramaUrl.group_id}`
    }
  }
})

export default store
