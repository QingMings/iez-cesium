import Vue from 'vue'
import Vuex from 'vuex'
import '../utils/ArrayExt'

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
    musicSrc: 'static/warn.mp3',
    // 用户信息缓存
    user: {
      userCode: 'default',
      userName: 'default',
      roleName: 'default',
      userPic: 'static/default.jpg'
    },
    api: {
      geojsonServiceUrl: '',
      //  全景服务地址
      panoramaUrl: '',
      // 3dTiles 服务地址
      modelTilesUrl: '',

      sceneInfoUrl: '',
      // 用户信息获取地址
      userInfo: ``,
      // 上报位置接口
      localtionReport: ``,
      // 报警地址查询服务
      warningIpQueryUrl: ``,
      // 报警IP 端口
      warningServer: {
        warning: '',
        cancelWarning: ''
      },
      //  报警 websocket 地址
      warningUrl: ``,
      historyWarningsUrl: '',
      meterViewUrl: '',
      videoViewUrl: '',
      locationsUrl: ''
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
      state.api.sceneInfoUrl = config.sceneInfoUrl
      state.api.geojsonServiceUrl = config.geojsonServiceUrl
      state.api.historyWarningsUrl = config.historyWarningsUrl
      state.api.meterViewUrl = config.meterViewUrl
      state.api.videoViewUrl = config.videoViewUrl
      state.api.locationsUrl = config.locationsUrl
    },
    // 更新 warning Server 地址
    updateWarningServer (state, serverConfig) {
      state.api.warningServer.warning = serverConfig.warning
      state.api.warningServer.cancelWarning = serverConfig.cancelWarning
    },
    // 添加报警
    addWarning (state, warning) {
      state.warning.push(warning)
    },
    // 移除报警
    removeWarning (state, warning) {
      console.info(warning)
      state.warning.remove(warning)
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
    // 获取场景信息服务
    getSceneInfoUrl: (state) => {
      return state.api.sceneInfoUrl
    },
    // 获取报警 地址查询地址
    getWarningQueryUrl: (state) => {
      return state.api.warningIpQueryUrl
    },
    // 用户信息查询地址
    getUserInfoUrl: (state) => {
      return state.api.userInfo
    },
    // 用户位置上报地址
    getlocaltionReportUrl: (state) => {
      return state.api.localtionReport
    },
    // 获取报警 websocket地址
    getWarningUrl: (state) => {
      return `ws://${state.api.warningServer.warning}`
    },
    getCancelWarning: (state) => {
      return `ws://${state.api.warningServer.cancelWarning}`
    },
    // 获取历史报警信息地址
    gethistoryWarningsUrl: (state) => {
      return state.api.historyWarningsUrl
    },
    // 获取动态页面进行展示
    getMeterViewUrl: (state) => {
      return state.api.meterViewUrl
    },
    getVideoViewUrl: (state) => {
      return state.api.videoViewUrl
    },
    getLocationsUrl: (state) => {
      return state.api.locationsUrl
    },
    // 获取 uesr 信息
    getUser: (state) => {
      return state.user
    },
    // 报警消息数量
    getWarningSize: (state) => {
      return state.warning.length
    },
    // 报警信息
    getWarnings: (state) => {
      return state.warning
    },
    getMusicSrc: (state) => {
      return state.musicSrc
    }

  }
})

export default store
