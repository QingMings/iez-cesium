
// api 配置项

const baseUrl = 'http://192.168.2.114:8000'
const _360hotUrl = 'http://192.168.2.114:8084/360hot'
const api = {
  // geojson服务地址
  geojsonServiceUrl: `${_360hotUrl}/GetPointsInfoServlet?sceneitems_id=58`,
  // 建筑 区域划分数据 服务地址
  buildGeoJsonServiceUrl: `${_360hotUrl}/GetbuildJson`, // 测试
  // buildGeoJsonServiceUrl: `${baseUrl}/api/getDivideData`, // 正式
  //  全景服务地址
  panoramaUrl: `${_360hotUrl}/senceServlet`,
  // 3dTiles 服务地址
  modelTilesUrl: `${_360hotUrl}/data/Scene/Cesium_3D.json`,
  // sceneInfoUrl
  sceneInfoUrl: `${_360hotUrl}/sjToqjbyBaojServlet`,
  // 用户信息获取地址
  userInfo: `${baseUrl}/api/userInfo`,
  // 上报位置接口
  localtionReport: `${baseUrl}/api/localtionReport`,
  // 报警地址查询服务
  warningIpQueryUrl: `${baseUrl}/api/warningAddr`,
  // 历史报警信息接口
  historyWarningsUrl: `${baseUrl}/api/historyWarnings`,
  // meterViewUrl: `${baseUrl}/meterView/`,
  meterViewUrl: `${baseUrl}/meterView/`,
  // 视频热点服务
  videoViewUrl: `${baseUrl}/videoView/`,
  // 位置上报服务
  locationsUrl: `${baseUrl}/api/getLocations`,
  // 日志上报服务
  logReportUrl: `${baseUrl}/api/insertLog`,
  // 巡检服务
  areaInspectionUrl: `${baseUrl}/areaInspection`,
  // 设置项初始化功能, 按钮是否启用，第四个依赖于第二个和第三个
  settings: {
    showHotPoint: true,
    showGroupMark: true,
    showBuildMark: true,
    // 资源正常加载之后，如果这个为 true，则在页面加载完成后就开始自动巡检
    autoInspection: true
  },
  // timer 时间间隔
  interval: {
    // 登录人数列表 刷新间隔
    loginListInterval: 5000,
    // 自动巡检刷新间隔
    autoInspectionInterval: 1000
  }
}
