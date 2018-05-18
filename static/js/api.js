// api 配置项

const baseUrl = 'http://192.168.2.114:8000/api'
const api = {
  // geojson服务地址
  geojsonServiceUrl: 'http://192.168.2.114:8084/360hot/GetPointsInfoServlet?sceneitems_id=58',
  //  全景服务地址
  panoramaUrl: 'http://192.168.2.114:8084/360hot/senceServlet',
  // 3dTiles 服务地址
  modelTilesUrl: 'http://192.168.2.114:8084/360hot/data/Scene/Cesium_3D.json',
  // 用户信息获取地址
  userInfo: `${baseUrl}/userInfo`,
  // 上报位置接口
  localtionReport: `${baseUrl}/localtionReport`,
  // 报警地址查询服务
  warningIpQueryUrl: `${baseUrl}/warningAddr`
}

export default api
