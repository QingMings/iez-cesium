import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    author: 'Wise Wrong',
    url: 'http://192.168.2.114:8084/360hot/senceServlet',
    panoramaParams: {
      Name: '',
      sence_id: '',
      senceitems_id: '',
      group_id: ''
    }, // 服务地址
    modelTilesUrl: 'http://192.168.2.114:8084/360hot/data/Scene/Cesium_3D.json',
    // 用户信息缓存
    user: {
      userCode: 'test',
      userName: 'test',
      roleName: 'test',
      userPic: 'test'
    },
    api: {
      userInfo: 'http://'
    }
  },
  mutations: {
    //  post参数
    updatePanoramaParams (state, params) {
      state.panoramaParams = params
    },
    // 设置3dTiles地址
    updateModelTilesUrl (state, url) {
      state.modelTilesUrl = url
    },
    // 更新用户信息
    updateUser  (state, userInfo) {
      state.user = userInfo
    }
  },
  getters: {
    // 获取服务地址
    getPanoramaUrl: (state) => {
      return `${state.url}dnid=${state.panoramaParams.sence_id}&NAME=${state.panoramaParams.Name}&senceitems_id=${state.panoramaParams.senceitems_id}&group_id=${state.panoramaParams.group_id}`
    },
    getPanoramaPostUrl: (state) => {
      return `${state.url}`
    },
    // post 参数
    getPanoramaPostParams: (state) => {
      return {
        Name: state.panoramaParams.Name,
        dnid: state.panoramaParams.sence_id,
        senceitems_id: state.panoramaParams.senceitems_id,
        group_id: state.panoramaParams.group_id,
        userCode: state.user.userCode,
        userName: state.user.userName,
        roleName: state.user.roleName,
        userPic: state.user.userPic
      }
    },
    // 获取3dTiles服务地址
    getModelUrl: (state) => {
      return state.modelTilesUrl
    }
  }
})

export default store
