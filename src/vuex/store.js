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
      // build GeoJson
      buildGeoJsonServiceUrl: '',
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
      locationsUrl: '',
      logReportUrl: '',
      areaInspectionUrl: ''
    },
    // 报警
    warning: [],
    // 设置
    settings: {
      showHotPoint: true,
      showGroupMark: true,
      showBuildMark: true,
      autoInspection: true,
      cameraFollow: false
    },
    // 定时器的管理
    timeOut: {
      // 登录列表定时刷新
      loginListTimer: undefined,
      autoInspectionTimer: undefined
    },
    interval: {
      loginListInterval: 5000,
      autoInspectionInterval: 5000
    },
    complete: {
      hotPointLoaded: false,
      regionDataSourceLoaded: false,
      buildingDataSourceLoaded: false
    },
    layer: {
      autoLayerIndex: undefined,
      clickLayerIndex: undefined
    }
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
      state.api.buildGeoJsonServiceUrl = config.buildGeoJsonServiceUrl
      state.api.historyWarningsUrl = config.historyWarningsUrl
      state.api.meterViewUrl = config.meterViewUrl
      state.api.videoViewUrl = config.videoViewUrl
      state.api.locationsUrl = config.locationsUrl
      state.api.logReportUrl = config.logReportUrl
      state.api.areaInspectionUrl = config.areaInspectionUrl
      if (config.settings) {
        state.settings = config.settings
      }
      if (config.interval) {
        state.interval = config.interval
      }
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
      state.warning.remove(warning)
    },
    // 通过配置文件更新Setting
    updateSettings (state, mysettings) {
      state.settings = mysettings
    },
    // 是否显示 热点设置按钮
    showHotPoint (state, status) {
      state.settings.showHotPoint = status
    },
    //  是否显示 区域标注设置按钮
    showGroupMark (state, status) {
      state.settings.showGroupMark = status
    },
    // 是否显示 建筑标注设置按钮
    showBuildMark (state, status) {
      state.settings.showBuildMark = status
    },
    // 自动巡检功能
    autoInspection (state, status) {
      state.settings.autoInspection = status
    },
    cameraFollow (state, status) {
      state.settings.cameraFollow = status
    },
    // 更新 登录列表 timer
    updateLoginListTimer (state, timer) {
      state.timeOut.loginListTimer = timer
    },
    // 更新 自动巡检 timer
    updateAutoInspectionTimer (state, timer) {
      state.timeOut.autoInspectionTimer = timer
    },
    // 热点资源是否加载完成
    updateHotPointComplete (state, isLoaded) {
      state.complete.hotPointLoaded = isLoaded
    },
    // 区域资源是否加载完成
    updateRegionDataComplete (state, isLoaded) {
      state.complete.regionDataSourceLoaded = isLoaded
    },
    // 建筑资源是否加载完成
    updateBuildingDataComplete (state, isLoaded) {
      state.complete.buildingDataSourceLoaded = isLoaded
    },
    // 更新 loginlist 刷新间隔时间
    updateLoginListInterval (state, interval) {
      state.interval.loginListInterval = interval
    },
    // 更新 自动巡检 刷新间隔时间
    updateAutoInspectionInterval (state, interval) {
      state.interval.autoInspectionInterval = interval
    },
    updateAutoLayerIndex (state, index) {
      state.layer.autoLayerIndex = index
    },
    updateClickLayerIndex (state, index) {
      state.layer.clickLayerIndex = index
    }

  },
  getters: {
    // Geojson 服务地址
    getGeoJsonServiceUrl: (state) => {
      return state.api.geojsonServiceUrl
    },
    // build geoJson 服务地址
    getBuildGeoJsonServiceUrl: (state) => {
      return state.api.buildGeoJsonServiceUrl
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
    getLogInsertUrl: (state) => {
      return state.api.logReportUrl
    },
    getAreaInspectionUrl: (state) => {
      return state.api.areaInspectionUrl
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
    },
    getHotPointStatus: (state) => {
      return state.settings.showHotPoint
    },
    getGroupMarkStatus: (state) => {
      return state.settings.showGroupMark
    },
    getBuildMarkStatus: (state) => {
      return state.settings.showBuildMark
    },
    // 获取自动巡检 按钮状态
    getAutoInspectionStatus: (state) => {
      return state.settings.autoInspection
    },
    getCameraFollowStatus: (state) => {
      return state.settings.cameraFollow
    },
    // 根据下标获得 setting
    getSettingByIndex: (state) => (index) => {
      if (index === 0) {
        return state.settings.showHotPoint
      } else if (index === 1) {
        return state.settings.showGroupMark
      } else if (index === 2) {
        return state.settings.showBuildMark
      } else if (index === 3) {
        return state.settings.autoInspection
      } else if (index === 4) {
        return state.settings.cameraFollow
      }
    },
    getLoginListTimer: (state) => {
      return state.timeOut.loginListTimer
    },
    getAutoInspectionTimer: (state) => {
      return state.timeOut.autoInspectionTimer
    },
    getLoginListInterval: (state) => {
      return state.interval.loginListInterval
    },
    getAutoInspectionInterval: (state) => {
      return state.interval.autoInspectionInterval
    },
    getHotPointLoadstatus: (state) => {
      return state.complete.hotPointLoaded
    },
    getRegionLoadstatus: (state) => {
      return state.complete.regionDataSourceLoaded
    },
    getBuildingLoadstatus: (state) => {
      return state.complete.buildingDataSourceLoaded
    },
    // 在 建筑数据和区域数据加载正确完成够，自动巡检功能开启
    getAutoInspectionLoadstatus: (state) => {
      if (state.complete.buildingDataSourceLoaded === false && state.complete.regionDataSourceLoaded === false) {
        return true
      } else {
        return state.complete.buildingDataSourceLoaded && state.complete.regionDataSourceLoaded
      }
    },
    getSettingStatusByIndex: (state) => (index) => {
      if (index === 0) {
        return state.complete.hotPointLoaded
      } else if (index === 1) {
        return state.complete.regionDataSourceLoaded
      } else if (index === 2) {
        return state.complete.buildingDataSourceLoaded
      } else if (index === 3) {
        if (state.complete.buildingDataSourceLoaded === false && state.complete.regionDataSourceLoaded === false) {
          return true
        } else {
          return state.complete.buildingDataSourceLoaded && state.complete.regionDataSourceLoaded
        }
      } else if (index === 4) {
        return true
      }
    },
    getAutoLayerIndex: (state) => {
      return state.layer.autoLayerIndex
    },
    getClickLayerIndex: (state) => {
      return state.layer.clickLayerIndex
}
  }
})

export default store
