// api 配置项
const api = {
  baseUrl: '',
  //  全景服务地址
  panoramaUrl: 'http://localhost:8084/360hot/senceServlet?',
  // 3dTiles 服务地址
  modelTilesUrl: 'http://192.168.2.114:8084/360hot/data/Scene/Cesium_3D.json',
  // 用户信息获取地址
  userInfo: `${this.baseUrl}/userInfo`,
  // 上报位置接口
  localtionReport: `${this.baseUrl}/localtionReport`,
  // 报警地址查询服务
  warningIpQueryUrl: `${this.baseUrl}/warningAddr`,
  // 报警IP 端口
  warningServer: {
    ip: '',
    port: ''
  },
  //  报警 websocket 地址
  warningUrl: `ws://${this.warningServer.ip}:${this.warningServer.port}`
}

export default api
