import axios from 'axios'

/**
 * 日志上报
 * @type {{report: log.report}}
 */
const log = {
  report: function (url, params) {
    axios.post(url, {data: params})
      .then(function () {
      }).catch(function (error) {
        console.error(`日志上报信息出错${error}`)
      })
  }
}
export default log
