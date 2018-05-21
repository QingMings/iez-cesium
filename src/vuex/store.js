import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    author: 'Wise Wrong',
    panoramaParams: {
      Name: '',
      sence_id: '',
      senceitems_id: '',
      group_id: ''
    },
    // 用户信息缓存
    user: {
      userCode: 'test',
      userName: 'test',
      roleName: 'test',
      userPic: 'test'
    },
    api: {
      geojsonServiceUrl: '',
      //  全景服务地址
      panoramaUrl: '',
      // 3dTiles 服务地址
      modelTilesUrl: '',
      // 用户信息获取地址
      userInfo: ``,
      // 上报位置接口
      localtionReport: ``,
      // 报警地址查询服务
      warningIpQueryUrl: ``,
      // 报警IP 端口
      warningServer: {
        ip: '',
        port: ''
      },
      //  报警 websocket 地址
      warningUrl: ``
    },
    warning: []
  },
  mutations: {
    //  post参数
    updatePanoramaParams (state, params) {
      state.panoramaParams = params
    },
    // 设置3dTiles地址
    updateModelTilesUrl (state, url) {
      state.api.modelTilesUrl = url
    },
    // 更新用户信息
    updateUser  (state, userInfo) {
      state.user = userInfo
    },
    // 更新 api配置
    updateApi (state, config) {
      state.api.userInfo = config.userInfo
      state.api.localtionReport = config.localtionReport
      state.api.warningIpQueryUrl = config.warningIpQueryUrl
      state.api.panoramaUrl = config.panoramaUrl
      state.api.modelTilesUrl = config.modelTilesUrl
      state.api.geojsonServiceUrl = config.geojsonServiceUrl
    },
    // 更新 warning Server 地址
    updateWarningServer (state, serverConfig) {
      state.api.warningServer.ip = serverConfig.IP
      state.api.warningServer.port = serverConfig.PORT
    }
  },
  getters: {
    // Geojson 服务地址
    getGeoJsonServiceUrl: (state) => {
      return state.api.geojsonServiceUrl
    },
    // 获取服务地址
    getPanoramaPostUrl: (state) => {
      return state.api.panoramaUrl
    },
    // post 参数
    getPanoramaPostParams: (state) => {
      return {
        name: state.panoramaParams.Name,
        dnid: state.panoramaParams.sence_id,
        senceitemsId: state.panoramaParams.senceitems_id,
        groupId: state.panoramaParams.group_id,
        userCode: state.user.userCode,
        userName: state.user.userName,
        roleName: state.user.roleName,
        userPic: state.user.userPic
      }
    },
    // 获取3dTiles服务地址
    getModelTilesUrl: (state) => {
      return state.api.modelTilesUrl
    },
    // 获取报警 地址查询地址
    getWarningQueryUrl: (state) => {
      return state.api.warningIpQueryUrl
    },
    getUserInfoUrl: (state) => {
      return state.api.userInfo
    },
    getlocaltionReportUrl: (state) => {
      return state.api.localtionReport
    },
    // 获取报警 websocket地址
    getWarningUrl: (state) => {
      return `ws://${state.api.warningServer.ip}:${state.api.warningServer.port}`
    },
    // 获取 uesr 信息
    getUser: (state) => {
      return state.user
    },
    getWarningSize: (state) => {
      return state.warning.length
    }
  }
})

export default store
